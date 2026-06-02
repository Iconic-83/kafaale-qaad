import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const [totalCases, completedCases, activeCases, donationStats, familiesHelped] = await Promise.all([
      prisma.case.count({ where: { status: { in: ['waiting_for_sponsor','sponsored','delivering','completed'] } } }),
      prisma.case.count({ where: { status: 'completed' } }),
      prisma.case.count({ where: { status: { in: ['waiting_for_sponsor','sponsored','delivering'] } } }),
      prisma.donation.aggregate({ where: { status: 'confirmed' }, _sum: { amount: true }, _count: true }),
      prisma.case.count({ where: { status: 'completed' } }),
    ]);
    res.json({
      totalCasesPublished: totalCases,
      casesCompleted: completedCases,
      casesActive: activeCases,
      totalRaised: donationStats._sum.amount || 0,
      totalDonations: donationStats._count,
      familiesHelped,
      countriesReached: 1,
      verificationRate: 100,
    });
  } catch { res.status(500).json({ error: 'Failed to retrieve impact stats' }); }
});

export default router;
