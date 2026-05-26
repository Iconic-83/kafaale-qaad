import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { sysLog } from '../services/logger';

const router = Router();
router.use(authenticate, requireRole(['admin','super_admin']));

// GET /api/admin/cases — All cases with full details
router.get('/cases', async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query as Record<string,string>;
    const where: any = {};
    if (status) where.status = status;
    const skip = (parseInt(page)-1) * parseInt(limit);
    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit),
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          assignedAgent: { select: { id: true, name: true, email: true } },
          fieldInvestigation: { select: { verificationStatus: true, estimatedAmountNeeded: true, fraudRiskLevel: true } },
          aiPublicData: { select: { generatedTitle: true, confidenceScore: true } },
          _count: { select: { donations: true, mediaFiles: true } },
        },
      }),
      prisma.case.count({ where }),
    ]);
    res.json({ cases, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total/parseInt(limit)) } });
  } catch { res.status(500).json({ error: 'Failed to retrieve cases' }); }
});

// GET /api/admin/cases/:id — Full private case detail
router.get('/cases/:id', async (req: AuthRequest, res: Response) => {
  try {
    const kase = await prisma.case.findUnique({
      where: { id: req.params.id },
      include: {
        reporter: { select: { id: true, name: true, email: true, phone: true } },
        assignedAgent: { select: { id: true, name: true, email: true, phone: true } },
        fieldInvestigation: true,
        aiPublicData: true,
        deliveryProof: true,
        mediaFiles: true,
        donations: { include: { donor: { select: { id: true, name: true, email: true } } } },
        auditLogs: { include: { admin: { select: { id: true, name: true } } }, orderBy: { timestamp: 'desc' } },
      },
    });
    if (!kase) return res.status(404).json({ error: 'Case not found' });
    res.json(kase);
  } catch { res.status(500).json({ error: 'Failed to retrieve case' }); }
});

// PATCH /api/admin/cases/:id/status — Update case status
router.patch('/cases/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes, rejectionReason } = req.body;
    const validStatuses = ['pending_review','team_assigned','investigating','investigation_completed','ai_sanitized','waiting_for_sponsor','sponsored','delivering','proof_uploaded','completed','rejected'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    
    const updateData: any = { status };
    if (status === 'rejected') { updateData.rejectedAt = new Date(); updateData.rejectionReason = rejectionReason; }
    if (status === 'waiting_for_sponsor') updateData.adminPublishedAt = new Date();
    if (status === 'completed') updateData.completedAt = new Date();

    const kase = await prisma.case.update({ where: { id: req.params.id }, data: updateData });
    await prisma.adminAuditLog.create({
      data: { adminId: req.user!.id, caseId: kase.id, action: status === 'rejected' ? 'rejected' : 'approved', notes },
    });
    sysLog.info(`Admin ${req.user!.email} updated case ${kase.id} → ${status}`);
    res.json({ message: 'Status updated', caseId: kase.id, status });
  } catch { res.status(500).json({ error: 'Failed to update status' }); }
});

// PATCH /api/admin/cases/:id/assign — Assign field agent
router.patch('/cases/:id/assign', async (req: AuthRequest, res: Response) => {
  try {
    const { agentId } = req.body;
    const agent = await prisma.user.findUnique({ where: { id: agentId } });
    if (!agent || agent.role !== 'field_agent') return res.status(400).json({ error: 'Invalid field agent' });
    
    const kase = await prisma.case.update({
      where: { id: req.params.id },
      data: { assignedAgentId: agentId, status: 'team_assigned', teamAssignedAt: new Date() },
    });
    await prisma.notification.create({
      data: { userId: agentId, caseId: kase.id, type: 'case_assigned', title: '🗂️ New Case Assigned', message: `A ${kase.emergencyLevel} priority ${kase.category} case has been assigned to you for field investigation.` },
    });
    await prisma.adminAuditLog.create({ data: { adminId: req.user!.id, caseId: kase.id, action: 'assigned_team', notes: `Assigned to agent ${agent.name}` } });
    res.json({ message: 'Agent assigned', caseId: kase.id });
  } catch { res.status(500).json({ error: 'Failed to assign agent' }); }
});

// PATCH /api/admin/cases/:id/publish — Publish case after AI sanitization
router.patch('/cases/:id/publish', async (req: AuthRequest, res: Response) => {
  try {
    const { publicTitle, publicStory, publicCity, targetGoal } = req.body;
    const kase = await prisma.case.update({
      where: { id: req.params.id },
      data: { status: 'waiting_for_sponsor', publicTitle, publicStory, publicCity, targetGoal, adminPublishedAt: new Date() },
    });
    if (kase.reporterId) {
      await prisma.notification.create({
        data: { userId: kase.reporterId, caseId: kase.id, type: 'case_published', title: '✅ Your Case is Now Live', message: 'Your case has been verified and published to the donor portal.' },
      });
    }
    await prisma.adminAuditLog.create({ data: { adminId: req.user!.id, caseId: kase.id, action: 'published', notes: 'Case published to donor portal' } });
    res.json({ message: 'Case published', caseId: kase.id });
  } catch { res.status(500).json({ error: 'Failed to publish case' }); }
});

// GET /api/admin/stats — Dashboard stats
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [totalCases, pendingCases, activeCases, completedCases, totalUsers, totalDonations] = await Promise.all([
      prisma.case.count(),
      prisma.case.count({ where: { status: 'pending_review' } }),
      prisma.case.count({ where: { status: { in: ['waiting_for_sponsor','sponsored','delivering'] } } }),
      prisma.case.count({ where: { status: 'completed' } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.donation.aggregate({ where: { status: 'confirmed' }, _sum: { amount: true }, _count: true }),
    ]);
    res.json({ totalCases, pendingCases, activeCases, completedCases, totalUsers, totalDonationsAmount: totalDonations._sum.amount || 0, totalDonationsCount: totalDonations._count });
  } catch { res.status(500).json({ error: 'Failed to retrieve stats' }); }
});

// GET /api/admin/users — All users
router.get('/users', async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, phone: true, country: true, city: true, isActive: true, createdAt: true, lastLoginAt: true, _count: { select: { reportedCases: true, donations: true } } },
    });
    res.json(users);
  } catch { res.status(500).json({ error: 'Failed to retrieve users' }); }
});

// GET /api/admin/audit — Audit log
router.get('/audit', async (_req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.adminAuditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: { admin: { select: { name: true, email: true } }, case: { select: { id: true, category: true, emergencyLevel: true } } },
    });
    res.json(logs);
  } catch { res.status(500).json({ error: 'Failed to retrieve audit log' }); }
});

export default router;
