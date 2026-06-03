import { prisma } from '../prisma/client';
import { socketService } from './socketService';
import { sysLog } from './logger';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import nodemailer from 'nodemailer';

const expo = new Expo();

async function sendEmailFallback(to: string, subject: string, body: string) {
  if (!process.env.SMTP_HOST) return;
  try {
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await t.sendMail({ from: process.env.EMAIL_FROM || 'noreply@kafaaleqaad.org', to, subject, text: body });
  } catch (e: any) { sysLog.warn(`Email fallback failed for ${to}: ${e.message}`); }
}

async function sendPush(userId: string, title: string, message: string, data?: Record<string, any>) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { expoPushToken: true, email: true } });
    if (!user?.expoPushToken || !Expo.isExpoPushToken(user.expoPushToken)) return;

    const msg: ExpoPushMessage = {
      to: user.expoPushToken,
      sound: 'default',
      title,
      body: message,
      data: data || {},
      badge: 1,
    };
    const chunks = expo.chunkPushNotifications([msg]);
    for (const chunk of chunks) {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      for (const r of receipts) {
        if (r.status === 'error') {
          sysLog.warn(`Push delivery error for ${userId}: ${r.message}`);
          // Fallback to email on DeviceNotRegistered (token stale)
          if (r.details?.error === 'DeviceNotRegistered' && user.email) {
            await sendEmailFallback(user.email, title, message);
            await prisma.user.update({ where: { id: userId }, data: { expoPushToken: null } });
          }
        }
      }
    }
  } catch (e: any) {
    sysLog.warn(`Push notification failed for user ${userId}: ${e.message}`);
  }
}

interface CreateNotificationInput {
  userId: string;
  caseId?: string;
  type: string;   // stored as plain string (not a Prisma enum)
  title: string;
  message: string;
}

class NotificationService {
  /** Create and deliver a notification to a user */
  async create(input: CreateNotificationInput) {
    const notif = await prisma.notification.create({
      data: {
        userId: input.userId,
        caseId: input.caseId,
        type: input.type as any,
        title: input.title,
        message: input.message,
      },
    });

    // Real-time WebSocket
    socketService.broadcastToRoom(`user:${input.userId}`, 'notification', {
      id: notif.id, type: notif.type, title: notif.title,
      message: notif.message, caseId: notif.caseId, createdAt: notif.createdAt,
    });

    // Actual Expo push notification (fire-and-forget)
    sendPush(input.userId, input.title, input.message, { caseId: input.caseId, type: input.type }).catch(() => {});

    sysLog.info(`🔔 Notification sent to user ${input.userId}: [${input.type}] ${input.title}`);
    return notif;
  }

  /** Notify all admins */
  async notifyAdmins(input: Omit<CreateNotificationInput, 'userId'>) {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['admin', 'super_admin'] }, isActive: true },
      select: { id: true },
    });

    const results = await Promise.all(
      admins.map((admin) => this.create({ ...input, userId: admin.id }))
    );
    return results;
  }

  /** Notify all field agents */
  async notifyFieldAgents(input: Omit<CreateNotificationInput, 'userId'>, agentId?: string) {
    if (agentId) {
      return [await this.create({ ...input, userId: agentId })];
    }
    const agents = await prisma.user.findMany({
      where: { role: 'field_agent', isActive: true },
      select: { id: true },
    });
    return Promise.all(agents.map((a) => this.create({ ...input, userId: a.id })));
  }

  /** Get user notifications */
  async getUserNotifications(userId: string, unreadOnly = false) {
    return prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /** Mark notification as read */
  async markRead(notifId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notifId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /** Mark all notifications as read */
  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /** Unread count for badge */
  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }
}

export const notificationService = new NotificationService();
