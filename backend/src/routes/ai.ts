import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../prisma/client';
import { sysLog } from '../services/logger';

const router = Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

// POST /api/ai/chat — AI Assistant for platform users
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, context = 'general', caseId } = req.body;
    if (!message || typeof message !== 'string' || message.length > 1000) {
      return res.status(400).json({ error: 'Invalid message' });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'AI assistant not configured', reply: 'AI assistant is not yet configured. Please contact support.' });
    }

    let contextInfo = '';
    if (caseId) {
      const kase = await prisma.case.findUnique({
        where: { id: caseId },
        select: { publicTitle: true, publicStory: true, publicCity: true, category: true, emergencyLevel: true, targetGoal: true, totalRaised: true },
      }).catch(() => null);
      if (kase) {
        contextInfo = `\nCurrent case context: "${kase.publicTitle}" in ${kase.publicCity} - ${kase.category} emergency (${kase.emergencyLevel} priority). Goal: $${kase.targetGoal}, Raised: $${kase.totalRaised}.`;
      }
    }

    const systemPrompt = `You are the Kafaale Qaad AI Assistant — a helpful, empathetic guide for a Somali humanitarian aid platform. Your role is to:

1. Help donors understand cases and make informed sponsorship decisions
2. Guide reporters on how to properly submit emergency cases
3. Assist field agents with investigation procedures
4. Answer questions about the platform's verification process
5. Provide emotional support and encouragement for this important humanitarian work

Platform overview:
- Kafaale Qaad connects verified emergency cases in Somalia with global sponsors
- All cases go through 11-step verification: submission → field investigation → AI sanitization → admin review → public sponsorship
- Victims' privacy is protected — only safe, AI-sanitized information is shown publicly
- Field teams physically verify every case before it's published
- Donations are held in escrow until delivery is confirmed with proof

Tone: Warm, professional, clear. Use simple English. When relevant, acknowledge the importance of the humanitarian mission.${contextInfo}

Keep responses concise (2-4 sentences). Do not make up case details you don't have.`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : 'I could not process that request.';
    sysLog.info(`🤖 AI chat: ${message.slice(0, 50)}...`);
    res.json({ reply, tokensUsed: response.usage.input_tokens + response.usage.output_tokens });
  } catch (err: any) {
    sysLog.error('AI chat error', err);
    res.status(500).json({ error: 'AI assistant error', reply: 'I\'m having trouble right now. Please try again in a moment.' });
  }
});

// POST /api/ai/sanitize — Admin triggers AI sanitization for a case
router.post('/sanitize/:caseId', async (req: Request, res: Response) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'ANTHROPIC_API_KEY not set' });
    }
    const kase = await prisma.case.findUnique({
      where: { id: req.params.caseId },
      include: { fieldInvestigation: true },
    });
    if (!kase) return res.status(404).json({ error: 'Case not found' });

    const prompt = `You are a humanitarian aid sanitization AI for Kafaale Qaad, a Somali aid platform.

Your task: Generate a SAFE PUBLIC VERSION of this emergency case that:
- Removes ALL personally identifiable information (full names, phone numbers, exact addresses, GPS coordinates, national IDs, medical record numbers)
- Preserves the humanitarian story in a dignified, respectful way
- Creates a compelling but privacy-safe public case

PRIVATE CASE DATA (never show this publicly):
Category: ${kase.category}
Emergency Level: ${kase.emergencyLevel}
Description: ${kase.privateDescription}
Location hint: ${kase.privateAddress ? kase.privateAddress.split(',').slice(-2).join(',').trim() : 'Somalia'}
Family size: ${kase.privateFamilySize || 'not specified'}
${kase.fieldInvestigation ? `Field verified: Yes. Notes: ${kase.fieldInvestigation.situationNotes || ''}` : 'Field verification pending'}

Respond with valid JSON only:
{
  "generatedTitle": "concise public title (max 80 chars, no names)",
  "generatedStory": "2-3 paragraph public story (no PII, dignified, compelling)",
  "generatedCity": "city and country only (no street/GPS)",
  "generatedUrgency": "critical|high|medium|low",
  "piiDetected": true/false,
  "piiRemoved": ["list of what was removed"],
  "confidenceScore": 0-100
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: 'AI returned invalid response' });

    const aiData = JSON.parse(jsonMatch[0]);

    // Save AI output and update case
    const aiRecord = await prisma.aiPublicData.upsert({
      where: { caseId: kase.id },
      update: {
        generatedTitle: aiData.generatedTitle,
        generatedStory: aiData.generatedStory,
        generatedCategory: kase.category,
        generatedCity: aiData.generatedCity,
        generatedUrgency: aiData.generatedUrgency,
        piiDetected: aiData.piiDetected,
        piiRemoved: JSON.stringify(aiData.piiRemoved || []),
        confidenceScore: aiData.confidenceScore,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        updatedAt: new Date(),
      },
      create: {
        caseId: kase.id,
        generatedTitle: aiData.generatedTitle,
        generatedStory: aiData.generatedStory,
        generatedCategory: kase.category,
        generatedCity: aiData.generatedCity,
        generatedUrgency: aiData.generatedUrgency,
        safeMediaUrls: '[]',
        piiDetected: aiData.piiDetected,
        piiRemoved: JSON.stringify(aiData.piiRemoved || []),
        mediaFlagged: '[]',
        confidenceScore: aiData.confidenceScore,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        model: 'claude-sonnet-4-6',
      },
    });

    await prisma.case.update({
      where: { id: kase.id },
      data: {
        status: 'ai_sanitized',
        publicTitle: aiData.generatedTitle,
        publicStory: aiData.generatedStory,
        publicCity: aiData.generatedCity,
        publicCountry: 'Somalia',
        aiSanitizedAt: new Date(),
      },
    });

    sysLog.info(`🤖 AI sanitized case: ${kase.id}`);
    res.json({ message: 'Case sanitized successfully', aiData: aiRecord });
  } catch (err: any) {
    sysLog.error('AI sanitize error', err);
    res.status(500).json({ error: 'AI sanitization failed', details: err.message });
  }
});

export default router;
