// ─── /api/partners ───────────────────────────────────────────────────────────
// Public endpoint — no auth required
import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';

const router = Router();

// GET /api/partners — all active partners grouped by tier
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [featured, community, orgs, stats] = await Promise.all([
      prisma.partner.findMany({
        where: { tier: 'featured', isActive: true },
        orderBy: [{ featuredOrder: 'asc' }, { casesSupported: 'desc' }],
      }),
      prisma.partner.findMany({
        where: { tier: 'community', isActive: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.partner.findMany({
        where: { tier: 'verified_org', isActive: true },
        orderBy: { name: 'asc' },
      }),
      // aggregate totals for the impact stats strip
      prisma.partner.aggregate({
        where: { isActive: true },
        _sum:   { casesSupported: true, familiesImpacted: true, totalDonated: true },
        _count: { id: true },
      }),
    ]);

    res.json({
      featured,
      community,
      organizations: orgs,
      totals: {
        activePartners:   stats._count.id,
        casesSupported:   stats._sum.casesSupported   ?? 0,
        familiesImpacted: stats._sum.familiesImpacted ?? 0,
        totalDonated:     stats._sum.totalDonated     ?? 0,
      },
    });
  } catch (err) {
    console.error('partners error', err);
    res.status(500).json({ error: 'Failed to load partners' });
  }
});

// GET /api/partners/stories — impact stories (partners with impactBefore/After)
router.get('/stories', async (_req: Request, res: Response) => {
  try {
    const stories = await prisma.partner.findMany({
      where: {
        isActive: true,
        impactBefore: { not: null },
        impactAfter:  { not: null },
      },
      select: {
        id: true, name: true, avatar: true, color: true,
        impactStory: true, impactBefore: true, impactAfter: true,
        caseRef: true, country: true, countryFlag: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
    res.json({ stories });
  } catch {
    res.status(500).json({ error: 'Failed to load stories' });
  }
});

export default router;
