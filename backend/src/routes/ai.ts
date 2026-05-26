import { Router, Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../prisma/client';
import { sysLog } from '../services/logger';

const router = Router();

// ── Demo responses (used when no API key) ───────────────────────────────────
const DEMO_RESPONSES: Record<string, string> = {
  default: "I'm the Kafaale Qaad AI Assistant! I help connect verified emergency cases in Somalia with global sponsors. Every case goes through 11 steps: submission → field investigation → AI sanitization → admin approval → sponsorship → delivery. How can I help you today?",
  sponsor: "To sponsor a case: 1) Browse our verified cases at /cases, 2) Click 'Sponsor' on a case you want to support, 3) Choose your contribution amount (full, partial, or custom), 4) Your payment is held in secure escrow until delivery is confirmed with proof. Would you like to browse open cases?",
  verify: "Our verification process has 4 layers: 📝 Reporter submits with photos & GPS → 🔍 Field team physically visits the location → 🤖 AI sanitizes private data for public safety → 🏢 Admin reviews both private and public versions before publishing. This ensures 100% of published cases are real.",
  privacy: "Victim privacy is our top priority. We NEVER show: full names, phone numbers, exact addresses, GPS coordinates, national IDs, or medical records publicly. Our AI automatically removes all personally identifiable information and generates a safe public summary. Only city/region, category, and urgency are shown to donors.",
  report: "To report an emergency case: 1) Register as a Reporter at /login, 2) Fill the case form with victim details (kept private), 3) Upload photos/videos as evidence, 4) Include GPS location, 5) Submit — our team reviews within 24 hours. Your report goes directly to our verification office.",
  delivery: "Once a case is funded: 1) Our field agent delivers the aid (cash, food, medicine, or goods), 2) Photos and receipts are uploaded as proof, 3) GPS coordinates confirm the delivery location, 4) Admin confirms delivery, 5) Donor receives notification with full delivery report. Complete transparency!",
};

function getDemoResponse(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('sponsor') || msg.includes('donat') || msg.includes('fund')) return DEMO_RESPONSES.sponsor;
  if (msg.includes('verif') || msg.includes('trust') || msg.includes('real')) return DEMO_RESPONSES.verify;
  if (msg.includes('privac') || msg.includes('name') || msg.includes('pii') || msg.includes('personal')) return DEMO_RESPONSES.privacy;
  if (msg.includes('report') || msg.includes('submit') || msg.includes('how do i')) return DEMO_RESPONSES.report;
  if (msg.includes('deliver') || msg.includes('proof') || msg.includes('receip')) return DEMO_RESPONSES.delivery;
  return DEMO_RESPONSES.default;
}

// POST /api/ai/chat — AI Assistant
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, context = 'general', caseId } = req.body;
    if (!message || typeof message !== 'string' || message.length > 1000) {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // ── DEMO MODE (no API key) ──────────────────────────────────
    if (!apiKey) {
      const reply = getDemoResponse(message);
      return res.json({ reply, mode: 'demo', note: 'Add ANTHROPIC_API_KEY to backend/.env for full AI' });
    }

    // ── LIVE MODE (with API key) ────────────────────────────────
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    let contextInfo = '';
    if (caseId) {
      const kase = await prisma.case.findUnique({
        where: { id: caseId },
        select: { publicTitle: true, publicCity: true, category: true, emergencyLevel: true, targetGoal: true, totalRaised: true },
      }).catch(() => null);
      if (kase) {
        contextInfo = `\nActive case: "${kase.publicTitle}" in ${kase.publicCity} — ${kase.category} (${kase.emergencyLevel}). Goal: $${kase.targetGoal}, Raised: $${kase.totalRaised}.`;
      }
    }

    const systemPrompt = `You are the Kafaale Qaad AI Assistant — a warm, helpful guide for a Somali humanitarian aid platform that verifies emergency cases and connects them with global sponsors.

Platform: Kafaale Qaad connects verified emergency cases in Somalia with donors worldwide.
Pipeline: submission → field investigation → AI sanitization → admin approval → sponsorship → delivery → completion.
Privacy policy: Victim names, phones, exact addresses are NEVER shown publicly. Only city/region shown.
Verification: 100% of published cases are physically verified by field teams.${contextInfo}

Keep responses to 2-4 sentences. Be warm and encouraging about the humanitarian mission.`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : 'Unable to process.';
    sysLog.info(`🤖 AI chat (live): ${message.slice(0, 60)}`);
    res.json({ reply, mode: 'live', tokensUsed: response.usage.input_tokens + response.usage.output_tokens });
  } catch (err: any) {
    sysLog.error('AI chat error', err);
    res.json({ reply: getDemoResponse(req.body.message || ''), mode: 'demo-fallback' });
  }
});

// POST /api/ai/sanitize/:caseId — Admin triggers AI sanitization
router.post('/sanitize/:caseId', async (req: AuthRequest, res: Response) => {
  try {
    const kase = await prisma.case.findUnique({
      where: { id: req.params.caseId },
      include: { fieldInvestigation: true },
    }) as any;
    if (!kase) return res.status(404).json({ error: 'Case not found' });

    const apiKey = process.env.ANTHROPIC_API_KEY;

    let aiData: any;

    if (!apiKey) {
      // ── DEMO sanitization ─────────────────────────────────────
      const cityHint = kase.privateAddress
        ? kase.privateAddress.split(',').slice(-2).join(',').trim()
        : 'Somalia';
      aiData = {
        generatedTitle: `Urgent ${kase.category.charAt(0).toUpperCase() + kase.category.slice(1)} Support Needed in ${cityHint}`,
        generatedStory: `A family in ${cityHint} is facing a serious ${kase.category} emergency. Our field team has physically verified the situation and confirmed the urgent need for support. With your sponsorship, we can deliver immediate assistance to those in critical need. Every contribution makes a real difference.`,
        generatedCity: cityHint,
        generatedUrgency: kase.emergencyLevel,
        piiDetected: true,
        piiRemoved: ['victim full name', 'phone number', 'exact home address', 'GPS coordinates'],
        confidenceScore: 87,
        mode: 'demo',
      };
    } else {
      // ── LIVE AI sanitization ──────────────────────────────────
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const client = new Anthropic({ apiKey });

      const prompt = `You are a humanitarian aid sanitization AI. Generate a SAFE PUBLIC VERSION of this emergency case.

RULES: Remove ALL PII (names, phones, exact addresses, GPS). Keep only city/region. Write with dignity and empathy.

PRIVATE DATA:
Category: ${kase.category}
Level: ${kase.emergencyLevel}
Description: ${kase.privateDescription}
Location hint: ${kase.privateAddress ? kase.privateAddress.split(',').slice(-2).join(',').trim() : 'Somalia'}
Family size: ${kase.privateFamilySize || 'not specified'}
${kase.fieldInvestigation ? `Field verified: ${kase.fieldInvestigation.officialNotes || 'Yes'}` : ''}

Respond with valid JSON only:
{
  "generatedTitle": "max 80 chars, no names",
  "generatedStory": "2-3 paragraphs, no PII, compelling",
  "generatedCity": "city + country only",
  "generatedUrgency": "critical|high|medium|low",
  "piiDetected": true,
  "piiRemoved": ["list what was removed"],
  "confidenceScore": 0-100
}`;

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return res.status(500).json({ error: 'AI returned invalid response' });
      aiData = JSON.parse(match[0]);
      aiData.mode = 'live';
    }

    // Save AI output and update case status
    await prisma.aiPublicData.upsert({
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
        model: apiKey ? 'claude-sonnet-4-6' : 'demo-mode',
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

    sysLog.info(`🤖 Case ${kase.id} sanitized (${aiData.mode})`);
    res.json({ message: 'Case sanitized successfully', aiData, caseId: kase.id });
  } catch (err: any) {
    sysLog.error('AI sanitize error', err);
    res.status(500).json({ error: 'AI sanitization failed', details: err.message });
  }
});

export default router;
