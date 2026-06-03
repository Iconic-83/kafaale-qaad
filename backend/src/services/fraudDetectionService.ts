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

    // 1. Field investigation signals
    const inv = kase.fieldInvestigation;
    if (inv) {
      // GPS verification mismatch (compare report vs verification coords)
      if (kase.privateGpsLat && inv.gpsVerificationLat) {
        const latDiff = Math.abs(kase.privateGpsLat - inv.gpsVerificationLat);
        const lngDiff = Math.abs((kase.privateGpsLng || 0) - (inv.gpsVerificationLng || 0));
        if (latDiff > 0.05 || lngDiff > 0.05) {  // ~5km
          flags.push('GPS coordinates do not match reported location');
          riskScore += 30;
        }
      }
      if (inv.fraudRiskScore > 60) {
        flags.push(`Field agent flagged high risk: score ${inv.fraudRiskScore}`);
        riskScore += 20;
      }
      if (!inv.victimVerified) {
        flags.push('Victim identity not verified by field team');
        riskScore += 20;
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
      const reporterCases = await prisma.case.count({ where: { reporterId: kase.reporterId! } });
      const rejectedCases = await prisma.case.count({ where: { reporterId: kase.reporterId!, status: 'rejected' } });
      if (reporterCases > 1 && rejectedCases / reporterCases > 0.5) {
        flags.push(`Reporter has high rejection rate: ${rejectedCases}/${reporterCases} cases rejected`);
        riskScore += 25;
      }
      // Reporter banned check
      if (!kase.reporter.isActive) {
        flags.push('Reporter account is suspended/banned');
        riskScore += 50;
      }
    }

    // 3. GPS duplicate proximity detection (~500m radius)
    if (kase.privateGpsLat && kase.privateGpsLng) {
      const nearbyCases = await prisma.case.findMany({
        where: {
          id: { not: kase.id },
          privateGpsLat: { gte: kase.privateGpsLat - 0.005, lte: kase.privateGpsLat + 0.005 },
          privateGpsLng: { gte: kase.privateGpsLng - 0.005, lte: kase.privateGpsLng + 0.005 },
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // last 30 days
        },
        select: { id: true, caseRef: true, status: true },
      });
      if (nearbyCases.length > 0) {
        flags.push(`${nearbyCases.length} other case(s) within 500m in the last 30 days: ${nearbyCases.map(c => c.caseRef).join(', ')}`);
        riskScore += Math.min(30, nearbyCases.length * 10);
      }
    }

    // 4. Same victim name in recent cases
    if (kase.privateVictimName) {
      const nameDupes = await prisma.case.count({
        where: {
          id: { not: kase.id },
          privateVictimName: { equals: kase.privateVictimName, mode: 'insensitive' },
          createdAt: { gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        },
      });
      if (nameDupes > 0) {
        flags.push(`Same victim name found in ${nameDupes} other case(s) in the last 60 days`);
        riskScore += 20;
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
        victimVerified: true,
        verificationStatus: true,
        gpsVerificationLat: true,
        gpsVerificationLng: true,
      },
    });
  }
}

export const fraudDetectionService = new FraudDetectionService();
