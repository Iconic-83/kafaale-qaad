import { prisma } from '../prisma/client';
import { socketService } from './socketService';
import { sysLog } from './logger';

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
        type: input.type,
        title: input.title,
        message: input.message,
      },
    });

    // Push real-time via WebSocket to user's room
    socketService.broadcastToRoom(`user:${input.userId}`, 'notification', {
      id: notif.id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      caseId: notif.caseId,
      createdAt: notif.createdAt,
    });

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
