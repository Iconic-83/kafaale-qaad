import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
const router = Router();

const DonationSchema = z.object({
  caseId: z.string().min(1),
  amount: z.number().positive().max(100000),
  method: z.enum(['mobile_money','card','wallet','bank_transfer']).default('bank_transfer'),
  isAnonymous: z.boolean().default(false),
  donorMessage: z.string().max(500).optional(),
  transactionRef: z.string().max(100).optional(),
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Idempotency: client sends Idempotency-Key header to prevent duplicate submissions
    const idempotencyKey = req.headers['idempotency-key'] as string | undefined;
    if (idempotencyKey) {
      const existing = await prisma.idempotencyKey.findUnique({ where: { key: idempotencyKey } }).catch(() => null);
      if (existing) return res.status(200).json({ message: 'Donation already submitted', idempotent: true });
    }

    const data = DonationSchema.parse(req.body);
    const kase = await prisma.case.findUnique({ where: { id: data.caseId } });
    if (!kase || !['waiting_for_sponsor','sponsored'].includes(kase.status)) return res.status(400).json({ error: 'Case not available for donation' });

    const donation = await prisma.donation.create({
      data: { donorId: req.user!.id, ...data, status: 'pending' },
    });

    if (idempotencyKey) {
      await prisma.idempotencyKey.create({ data: { key: idempotencyKey } }).catch(() => {});
    }

    res.status(201).json({ message: 'Donation submitted', donationId: donation.id, donation: { id: donation.id, amount: donation.amount }, status: 'pending' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: err.issues });
    res.status(500).json({ error: 'Donation failed' });
  }
});


router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { donorId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        case: {
          select: {
            id: true, publicTitle: true, publicCity: true, status: true,
            completedAt: true,
            deliveryProof: {
              select: {
                deliveryDate: true, deliveryMethod: true, amountDelivered: true,
                recipientName: true, deliveryNotes: true, adminConfirmed: true, adminConfirmedAt: true,
              },
            },
          },
        },
      },
    });
    res.json(donations);
  } catch { res.status(500).json({ error: 'Failed to retrieve donations' }); }
});

export default router;
