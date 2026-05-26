import { prisma } from '../prisma/client';
import { sysLog } from './logger';

interface FraudRiskResult {
  riskScore: number;      // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  recommendation: string;
}

class FraudDetectionService {
  /**
   * Score a case for fraud risk based on multiple signals
   */
  async scoreCaseRisk(caseId: string): Promise<FraudRiskResult> {
    const kase = await prisma.case.findUnique({
      where: { id: caseId },
      include: { fieldInvestigation: true, reporter: true },
    });
    if (!kase) throw new Error('Case not found');

    const flags: string[] = [];
    let riskScore = 0;

    // 1. GPS mismatch signal
    const inv = kase.fieldInvestigation;
    if (inv) {
      if (!inv.gpsMatchesReport) {
        flags.push('GPS coordinates do not match reported location');
        riskScore += 30;
      }
      if (inv.fraudRiskScore > 60) {
        flags.push(`Field agent flagged high risk: score ${inv.fraudRiskScore}`);
        riskScore += 20;
      }
      if (!inv.victimVerified) {
        flags.push('Victim identity not verified by field team');
        riskScore += 20;
      }
      if (!inv.victimIdConfirmed) {
        flags.push('Victim ID document not confirmed');
        riskScore += 10;
      }
      // Unreasonably high amount for category
      const amount = Number(inv.estimatedAmountNeeded);
      if (kase.category === 'food' && amount > 5000) {
        flags.push(`Unusually high food aid request: $${amount}`);
        riskScore += 15;
      }
      if (kase.category === 'medical' && amount > 50000) {
        flags.push(`Unusually high medical request: $${amount}`);
        riskScore += 10;
      }
    } else {
      flags.push('No field investigation on record');
      riskScore += 40;
    }

    // 2. Reporter history check
    if (kase.reporter) {
      const reporterCases = await prisma.case.count({
        where: { reporterId: kase.reporterId! },
      });
      const rejectedCases = await prisma.case.count({
        where: { reporterId: kase.reporterId!, status: 'rejected' },
      });
      if (reporterCases > 1 && rejectedCases / reporterCases > 0.5) {
        flags.push(`Reporter has high rejection rate: ${rejectedCases}/${reporterCases} cases rejected`);
        riskScore += 25;
      }
    }

    // 3. Cap at 100
    riskScore = Math.min(100, riskScore);

    const riskLevel: FraudRiskResult['riskLevel'] =
      riskScore >= 70 ? 'critical' :
      riskScore >= 50 ? 'high' :
      riskScore >= 25 ? 'medium' : 'low';

    const recommendation =
      riskLevel === 'critical' ? 'Do not approve — requires re-investigation and supervisor review' :
      riskLevel === 'high' ? 'Extra verification required before approval' :
      riskLevel === 'medium' ? 'Review carefully before approving' :
      'Looks safe — standard review recommended';

    // Update field investigation risk scores
    if (inv) {
      await prisma.fieldInvestigation.update({
        where: { caseId },
        data: { fraudRiskScore: riskScore, fraudRiskLevel: riskLevel, fraudRiskNotes: flags.join(' | ') },
      });
    }

    sysLog.info(`🔍 Fraud analysis for case ${caseId}: score=${riskScore}, level=${riskLevel}`, { flags });

    return { riskScore, riskLevel, flags, recommendation };
  }

  /** Get all high-risk cases for admin review */
  async getFraudAudits() {
    const investigations = await prisma.fieldInvestigation.findMany({
      where: { fraudRiskLevel: { in: ['high', 'critical'] } },
      include: {
        case: {
          select: {
            id: true,
            publicTitle: true,
            status: true,
            category: true,
            emergencyLevel: true,
            createdAt: true,
          },
        },
        agent: { select: { name: true, email: true } },
      },
      orderBy: { fraudRiskScore: 'desc' },
    });
    return investigations;
  }

  /** Get fraud audit for a specific case */
  async getCaseAudit(caseId: string) {
    return prisma.fieldInvestigation.findUnique({
      where: { caseId },
      select: {
        fraudRiskScore: true,
        fraudRiskLevel: true,
        fraudRiskNotes: true,
        gpsMatchesReport: true,
        victimVerified: true,
        victimIdConfirmed: true,
        verificationStatus: true,
      },
    });
  }
}

export const fraudDetectionService = new FraudDetectionService();
