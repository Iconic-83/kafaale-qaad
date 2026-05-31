import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
const router = Router();
router.use(authenticate, requireRole(['field_agent','admin','super_admin']));

router.get('/assignments', async (req: AuthRequest, res: Response) => {
  try {
    const cases = await prisma.case.findMany({
      where: { assignedAgentId: req.user!.id, status: { in: ['team_assigned','investigating','investigation_completed','ai_sanitized','sponsored','delivering','proof_uploaded'] } },
      include: { reporter: { select: { name: true, phone: true } }, fieldInvestigation: true },
    });
    res.json(cases);
  } catch { res.status(500).json({ error: 'Failed' }); }
});

const InvestigationSchema = z.object({
  caseId: z.string(),
  victimVerified: z.boolean(),
  situationAccurate: z.boolean(),
  situationNotes: z.string().max(2000).optional(),
  estimatedAmountNeeded: z.number().positive(),
  urgencyConfirmed: z.enum(['low','medium','high','critical']),
  deliveryFeasible: z.boolean().default(true),
  deliveryMethod: z.string().max(200).optional(),
  deliveryNotes: z.string().max(1000).optional(),
  fraudRiskScore: z.number().int().min(0).max(100).default(0),
  fraudRiskLevel: z.enum(['low','medium','high']).default('low'),
  fraudRiskNotes: z.string().max(500).optional(),
  verificationStatus: z.enum(['verified','rejected','needs_review']),
  officialNotes: z.string().max(2000).optional(),
  programRecommendation: z.enum(['child_sponsorship','education','medical','family_care','emergency']).optional(),
});

router.post('/investigate', async (req: AuthRequest, res: Response) => {
  try {
    const data = InvestigationSchema.parse(req.body);
    const kase = await prisma.case.findUnique({ where: { id: data.caseId } });
    if (!kase) return res.status(404).json({ error: 'Case not found' });
    if (kase.assignedAgentId !== req.user!.id) return res.status(403).json({ error: 'Not assigned to this case' });

    const investigation = await prisma.fieldInvestigation.upsert({
      where: { caseId: data.caseId },
      update: { ...data, updatedAt: new Date() },
      create: { ...data, agentId: req.user!.id },
    });
    await prisma.case.update({
      where: { id: data.caseId },
      data: {
        status: 'investigation_completed',
        investigationCompletedAt: new Date(),
        ...(data.programRecommendation && { programRecommendation: data.programRecommendation }),
      },
    });
    const admins = await prisma.user.findMany({ where: { role: { in: ['admin','super_admin'] } }, select: { id: true } });
    await prisma.notification.createMany({
      data: admins.map(a => ({ userId: a.id, caseId: kase.id, type: 'investigation_completed', title: '📋 Investigation Complete', message: `Field investigation submitted for case. Ready for AI sanitization.` })),
    });
    res.status(201).json({ message: 'Investigation submitted', investigationId: investigation.id });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: err.issues });
    res.status(500).json({ error: 'Failed to submit investigation' });
  }
});

// ── Delivery Proof Schema ───────────────────────────────────────────────────
const DeliverySchema = z.object({
  caseId:          z.string(),
  deliveryMethod:  z.enum(['cash','food_package','medical_supplies','clothing','goods','mixed']),
  amountDelivered: z.number().positive(),
  recipientName:   z.string().max(200).optional(),
  deliveryNotes:   z.string().max(2000),
  deliveryDate:    z.string().datetime().optional(),  // ISO string; defaults to now
});

// POST /api/field/delivery — Field agent submits delivery proof
router.post('/delivery', async (req: AuthRequest, res: Response) => {
  try {
    const data = DeliverySchema.parse(req.body);
    const kase = await prisma.case.findUnique({ where: { id: data.caseId } });
    if (!kase) return res.status(404).json({ error: 'Case not found' });
    if (kase.assignedAgentId !== req.user!.id) return res.status(403).json({ error: 'Not assigned to this case' });
    if (!['sponsored','delivering'].includes(kase.status)) {
      return res.status(400).json({ error: 'Case is not in a deliverable state' });
    }

    // Create or update delivery proof record
    const proof = await prisma.deliveryProof.upsert({
      where:  { caseId: data.caseId },
      update: {
        deliveredBy:     req.user!.id,
        deliveryDate:    data.deliveryDate ? new Date(data.deliveryDate) : new Date(),
        deliveryMethod:  data.deliveryMethod,
        amountDelivered: data.amountDelivered,
        recipientName:   data.recipientName,
        deliveryNotes:   data.deliveryNotes,
        updatedAt:       new Date(),
      },
      create: {
        caseId:          data.caseId,
        deliveredBy:     req.user!.id,
        deliveryDate:    data.deliveryDate ? new Date(data.deliveryDate) : new Date(),
        deliveryMethod:  data.deliveryMethod,
        amountDelivered: data.amountDelivered,
        recipientName:   data.recipientName,
        deliveryNotes:   data.deliveryNotes,
      },
    });

    // Move case to proof_uploaded
    await prisma.case.update({
      where: { id: data.caseId },
      data:  { status: 'proof_uploaded' },
    });

    // Notify all admins
    const admins = await prisma.user.findMany({ where: { role: { in: ['admin','super_admin'] } }, select: { id: true } });
    await prisma.notification.createMany({
      data: admins.map(a => ({
        userId:  a.id,
        caseId:  kase.id,
        type:    'delivery_proof_submitted',
        title:   '📦 Delivery Proof Submitted',
        message: `Field agent submitted delivery proof for case. ${data.amountDelivered} delivered via ${data.deliveryMethod}. Please review and mark complete.`,
      })),
    });

    // Notify reporter that aid was delivered
    if (kase.reporterId) {
      await prisma.notification.create({
        data: {
          userId:  kase.reporterId,
          caseId:  kase.id,
          type:    'aid_delivered',
          title:   '📦 Aid Has Been Delivered',
          message: `The aid for your reported case has been delivered by our field team. Awaiting final admin confirmation.`,
        },
      });
    }

    res.status(201).json({ message: 'Delivery proof submitted', proofId: proof.id });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: err.issues });
    res.status(500).json({ error: 'Failed to submit delivery proof' });
  }
});

export default router;
