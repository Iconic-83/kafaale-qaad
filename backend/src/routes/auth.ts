import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sysLog } from '../services/logger';

const router = Router();

const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  organization: z.string().max(200).optional(),
  preferredLanguage: z.enum(['en', 'so', 'ar', 'fr', 'es', 'tr']).default('en'),
  role: z.enum(['guest', 'reporter', 'donor', 'field_agent']).default('donor'),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name, email: data.email, password: hashedPassword, role: data.role,
        phone: data.phone, country: data.country, city: data.city,
        organization: data.organization, preferredLanguage: data.preferredLanguage,
      },
      select: { id: true, name: true, email: true, role: true, preferredLanguage: true },
    });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    sysLog.info(`✅ New user registered: ${user.email} [${user.role}]`);
    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: err.issues });
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid credentials or account suspended' });

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Update last login
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    sysLog.info(`🔐 User login: ${user.email} [${user.role}]`);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, preferredLanguage: user.preferredLanguage },
      token,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: err.issues });
    res.status(400).json({ error: err.message });
  }
});

// GET /api/auth/me — Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, phone: true, role: true,
        country: true, city: true, organization: true, preferredLanguage: true,
        createdAt: true, lastLoginAt: true,
        _count: { select: { reportedCases: true, donations: true } },
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

export default router;
