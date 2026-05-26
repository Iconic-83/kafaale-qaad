import { prisma } from '../prisma/client';
import { sysLog } from './logger';
import { socketService } from './socketService';

interface EscrowMetrics {
  totalLocked: number;
  totalReleased: number;
  totalRefunded: number;
  pendingCount: number;
  confirmedCount: number;
  refundedCount: number;
}

class EscrowService {
  /** Lock funds when donation received (status: pending) */
  async lockFunds(donationId: string): Promise<void> {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { case: true },
    });
    if (!donation) throw new Error('Donation not found');

    sysLog.info(`🔒 Escrow: Funds locked — donation ${donationId} — $${donation.amount}`);

    socketService.broadcastToRoom('admin', 'escrow_event', {
      type: 'funds_locked',
      donationId,
      caseId: donation.caseId,
      amount: donation.amount,
      caseTitle: donation.case.publicTitle || donation.case.privateDescription?.slice(0, 50),
    });
  }

  /** Confirm payment — admin verifies transaction is real */
  async confirmPayment(donationId: string, adminId: string, transactionRef?: string): Promise<void> {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { case: true, donor: true },
    });
    if (!donation) throw new Error('Donation not found');
    if (donation.status !== 'pending') throw new Error('Donation is not in pending state');

    await prisma.$transaction([
      prisma.donation.update({
        where: { id: donationId },
        data: { status: 'confirmed', confirmedAt: new Date(), transactionRef: transactionRef || donation.transactionRef },
      }),
      prisma.case.update({
        where: { id: donation.caseId },
        data: { totalRaised: { increment: donation.amount } },
      }),
    ]);

    sysLog.info(`✅ Escrow: Payment confirmed — donation ${donationId} — $${donation.amount}`);
    socketService.broadcastToRoom('admin', 'escrow_event', {
      type: 'payment_confirmed', donationId, caseId: donation.caseId,
      donorName: donation.donor.name, amount: donation.amount,
    });
  }

  /** Release funds after delivery confirmed */
  async releaseFunds(caseId: string, amountDelivered: number): Promise<void> {
    const kase = await prisma.case.findUnique({ where: { id: caseId } });
    if (!kase) throw new Error('Case not found');
    await prisma.case.update({
      where: { id: caseId },
      data: { escrowReleased: { increment: amountDelivered } },
    });
    sysLog.info(`💸 Escrow: Funds released — case ${caseId} — $${amountDelivered}`);
    socketService.broadcastToRoom('admin', 'escrow_event', {
      type: 'funds_released', caseId, amountReleased: amountDelivered, caseTitle: kase.publicTitle,
    });
  }

  /** Process refund */
  async refundDonation(donationId: string, reason: string): Promise<void> {
    const donation = await prisma.donation.findUnique({ where: { id: donationId } });
    if (!donation) throw new Error('Donation not found');
    if (donation.status === 'refunded') throw new Error('Already refunded');
    const wasConfirmed = donation.status === 'confirmed';
    await prisma.$transaction([
      prisma.donation.update({
        where: { id: donationId },
        data: { status: 'refunded', refundedAt: new Date(), refundReason: reason },
      }),
      ...(wasConfirmed ? [prisma.case.update({
        where: { id: donation.caseId },
        data: { totalRaised: { decrement: donation.amount } },
      })] : []),
    ]);
    sysLog.info(`↩️ Escrow: Refund processed — donation ${donationId} — reason: ${reason}`);
  }

  /** Global escrow metrics for admin dashboard */
  async getEscrowMetrics(): Promise<EscrowMetrics> {
    const [pending, confirmed, refunded] = await Promise.all([
      prisma.donation.aggregate({ where: { status: 'pending' }, _sum: { amount: true }, _count: true }),
      prisma.donation.aggregate({ where: { status: 'confirmed' }, _sum: { amount: true }, _count: true }),
      prisma.donation.aggregate({ where: { status: 'refunded' }, _sum: { amount: true }, _count: true }),
    ]);
    return {
      totalLocked: Number(pending._sum.amount ?? 0),
      totalReleased: Number(confirmed._sum.amount ?? 0),
      totalRefunded: Number(refunded._sum.amount ?? 0),
      pendingCount: pending._count,
      confirmedCount: confirmed._count,
      refundedCount: refunded._count,
    };
  }
}

export const escrowService = new EscrowService();
