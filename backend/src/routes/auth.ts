import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sysLog } from '../services/logger';

const router = Router();

// Single source of truth for all valid roles
export const ALL_ROLES = [
  'reporter','sponsor','field_agent','office_staff',
  'program_manager','project_manager','partner','admin','super_admin',
] as const;
export type AppRole = typeof ALL_ROLES[number];

const RegisterSchema = z.object({
  name:              z.string().min(2).max(100),
  email:             z.string().email(),
  password:          z.string().min(8),
  phone:             z.string().max(20).optional(),
  country:           z.string().max(100).optional(),
  city:              z.string().max(100).optional(),
  organization:      z.string().max(200).optional(),
  preferredLanguage: z.enum(['en','so','ar','fr','es','tr']).default('en'),
  role:              z.enum(ALL_ROLES).default('reporter'),
});

// Email helper — logs to console if SMTP not configured
async function sendEmail(to: string, subject: string, text: string) {
  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({ from: process.env.EMAIL_FROM || 'noreply@kafaaleqaad.org', to, subject, text });
  } else {
    sysLog.info(`[EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
  }
}

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

// POST /api/auth/push-token — Save Expo push token for this device
router.post('/push-token', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') return res.status(400).json({ error: 'Token required' });
    await prisma.user.update({ where: { id: req.user!.id }, data: { expoPushToken: token } });
    res.json({ message: 'Push token saved' });
  } catch { res.status(500).json({ error: 'Failed to save push token' }); }
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

// PATCH /api/auth/profile — Update own profile
router.patch('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      name:         z.string().min(2).max(100).optional(),
      phone:        z.string().max(20).optional(),
      city:         z.string().max(100).optional(),
      organization: z.string().max(200).optional(),
    });
    const data = schema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: { id: true, name: true, email: true, phone: true, role: true, city: true, organization: true, preferredLanguage: true },
    });
    res.json({ user });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: err.issues });
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/auth/forgot-password — Send OTP to email
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond 200 to prevent email enumeration
    if (!user) return res.json({ message: 'If that email exists, a code has been sent.' });

    const code      = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.otpRecord.create({ data: { email, code, expiresAt } });
    await sendEmail(email, 'Kafaale Qaad — Password Reset Code', `Your password reset code is: ${code}\n\nThis code expires in 15 minutes. Do not share it with anyone.`);

    sysLog.info(`OTP generated for ${email}`);
    res.json({ message: 'If that email exists, a code has been sent.' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid email' });
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// POST /api/auth/resend-otp — Resend OTP
router.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ message: 'If that email exists, a new code has been sent.' });

    const code      = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.otpRecord.create({ data: { email, code, expiresAt } });
    await sendEmail(email, 'Kafaale Qaad — New Verification Code', `Your new code is: ${code}\n\nExpires in 15 minutes.`);

    res.json({ message: 'If that email exists, a new code has been sent.' });
  } catch { res.status(500).json({ error: 'Failed to resend OTP' }); }
});

// POST /api/auth/verify-otp — Verify OTP (registration email confirmation)
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = z.object({ email: z.string().email(), otp: z.string().length(6) }).parse(req.body);
    const record = await prisma.otpRecord.findFirst({
      where: { email, code: otp, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) return res.status(400).json({ error: 'Invalid or expired code' });

    await prisma.otpRecord.update({ where: { id: record.id }, data: { used: true } });
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true, role: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid input' });
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /api/auth/reset-password — Reset password with OTP
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = z.object({
      email:       z.string().email(),
      otp:         z.string().length(6),
      newPassword: z.string().min(8),
    }).parse(req.body);

    const record = await prisma.otpRecord.findFirst({
      where: { email, code: otp, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) return res.status(400).json({ error: 'Invalid or expired code' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { email }, data: { password: hashed } });
    await prisma.otpRecord.update({ where: { id: record.id }, data: { used: true } });

    sysLog.info(`Password reset for ${email}`);
    res.json({ message: 'Password reset successfully. Please log in.' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: err.issues });
    res.status(500).json({ error: 'Password reset failed' });
  }
});

export default router;
