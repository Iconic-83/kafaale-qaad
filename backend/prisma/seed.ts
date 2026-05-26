import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Kafaale database…');
  const pw = await bcrypt.hash('Kafaale123!', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@kafaale.org' },
    update: {},
    create: { name: 'Super Admin', email: 'superadmin@kafaale.org', password: pw, role: 'super_admin', phone: '+252612000001', country: 'Somalia', city: 'Mogadishu' },
  });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kafaale.org' },
    update: {},
    create: { name: 'Ahmed Kafaale', email: 'admin@kafaale.org', password: pw, role: 'admin', phone: '+252612000002', country: 'Somalia', city: 'Mogadishu' },
  });
  const agent = await prisma.user.upsert({
    where: { email: 'agent@kafaale.org' },
    update: {},
    create: { name: 'Abdi Yusuf', email: 'agent@kafaale.org', password: pw, role: 'field_agent', phone: '+252612000003', country: 'Somalia', city: 'Garowe' },
  });
  const donor = await prisma.user.upsert({
    where: { email: 'donor@kafaale.org' },
    update: {},
    create: { name: 'Fatima Al-Thani', email: 'donor@kafaale.org', password: pw, role: 'donor', phone: '+97450000001', country: 'Qatar', city: 'Doha' },
  });
  const reporter = await prisma.user.upsert({
    where: { email: 'reporter@kafaale.org' },
    update: {},
    create: { name: 'Hodan Farah', email: 'reporter@kafaale.org', password: pw, role: 'reporter', phone: '+252612000005', country: 'Somalia', city: 'Mogadishu' },
  });
  console.log('✅ 5 users created');

  // Case A — published, waiting for sponsor
  const caseA = await prisma.case.create({
    data: {
      reporterId: reporter.id,
      category: 'medical', emergencyLevel: 'critical', status: 'waiting_for_sponsor',
      privateVictimName: 'Faadumo Hassan', privateVictimPhone: '+252612999888',
      privateAddress: 'Hodan District, House 47, Near Makka Al-Mukarama Road',
      privateGpsLat: 2.0469, privateGpsLng: 45.3182, privateFamilySize: 7,
      privateVictimAge: 38, privateVictimGender: 'female',
      privateDescription: 'Mother of 5 with stage-3 kidney disease. Family cannot afford dialysis. Husband lost job after flood. Children malnourished.',
      publicTitle: 'Urgent Medical Support for a Family in Mogadishu',
      publicStory: 'A mother of five children in Mogadishu is facing a critical medical emergency. She requires life-saving dialysis treatment three times per week but her family cannot cover the costs. Her husband recently lost his livelihood due to floods. Your support will fund essential medical treatments.',
      publicCity: 'Mogadishu', publicCountry: 'Somalia', publicMediaUrls: '[]',
      targetGoal: 5400, totalRaised: 1200,
      aiSanitizedAt: new Date(), adminPublishedAt: new Date(),
      teamAssignedAt: new Date(Date.now() - 5*86400000),
      investigationCompletedAt: new Date(Date.now() - 3*86400000),
      assignedAgentId: agent.id,
    },
  });

  await prisma.fieldInvestigation.create({
    data: {
      caseId: caseA.id, agentId: agent.id,
      victimVerified: true, situationAccurate: true,
      situationNotes: 'Visited home. Medical documents confirmed. Hospital referral letter verified.',
      gpsVerificationLat: 2.0470, gpsVerificationLng: 45.3180,
      estimatedAmountNeeded: 5400, urgencyConfirmed: 'critical',
      deliveryFeasible: true, deliveryMethod: 'Direct payment to hospital dialysis unit',
      fraudRiskScore: 5, fraudRiskLevel: 'low',
      fraudRiskNotes: 'All documents verified. GPS matches. No inconsistencies found.',
      verificationStatus: 'verified',
      officialNotes: 'Urgent case. Medical documentation solid. Recommend immediate publication.',
    },
  });

  await prisma.aiPublicData.create({
    data: {
      caseId: caseA.id,
      generatedTitle: 'Urgent Medical Support for a Family in Mogadishu',
      generatedStory: 'A mother of five children in Mogadishu is facing a critical medical emergency requiring life-saving dialysis treatment. Your support will fund essential medical treatments.',
      generatedCategory: 'medical', generatedCity: 'Mogadishu, Somalia', generatedUrgency: 'critical',
      safeMediaUrls: '[]', piiDetected: true,
      piiRemoved: JSON.stringify(['victim full name', 'victim phone', 'exact home address', 'GPS coords']),
      mediaFlagged: '[]', confidenceScore: 94, model: 'claude-sonnet-4-6',
    },
  });

  await prisma.donation.create({
    data: {
      donorId: donor.id, caseId: caseA.id,
      amount: 1200, currency: 'USD', method: 'card',
      status: 'confirmed', transactionRef: 'TXN-DEMO-001',
      confirmedAt: new Date(Date.now() - 2*86400000),
      donorMessage: 'May Allah make it easy for this family.',
    },
  });

  // Case B — food, pending review
  await prisma.case.create({
    data: {
      reporterId: reporter.id, category: 'food', emergencyLevel: 'high', status: 'pending_review',
      privateVictimName: 'Ibrahim Warsame', privateVictimPhone: '+252615000222',
      privateAddress: 'Aato IDP Camp, North-East Garowe, Puntland',
      privateGpsLat: 8.4064, privateGpsLng: 48.4821, privateFamilySize: 12,
      privateDescription: 'Displaced farmer family. Drought wiped out crops. Children showing signs of acute malnutrition.',
      targetGoal: 7500, totalRaised: 0,
    },
  });

  // Case C — shelter, team assigned
  const caseC = await prisma.case.create({
    data: {
      reporterId: reporter.id, category: 'shelter', emergencyLevel: 'high', status: 'team_assigned',
      privateVictimName: 'Halima Nur', privateVictimPhone: '+252618000333',
      privateAddress: 'Daynile District Flood Zone, Mogadishu',
      privateGpsLat: 2.0628, privateGpsLng: 45.2974, privateFamilySize: 30,
      privateDescription: 'Flash floods destroyed 30 IDP family shelters. Families sleeping in the open. Need urgent shelter materials.',
      targetGoal: 6200, totalRaised: 0,
      teamAssignedAt: new Date(), assignedAgentId: agent.id,
    },
  });

  // Case D — completed
  await prisma.case.create({
    data: {
      reporterId: reporter.id, category: 'orphan', emergencyLevel: 'critical', status: 'completed',
      privateVictimName: 'Mahad Jimcaale', privateVictimPhone: '+252617000444',
      privateAddress: 'Baidoa, Bay Region',
      privateFamilySize: 1, privateVictimAge: 8, privateVictimGender: 'male',
      privateDescription: 'Orphan child, severe malnutrition, needs immediate nutrition support and shelter.',
      publicTitle: 'Nutrition Support for Orphan Child in Baidoa',
      publicStory: 'An 8-year-old orphan in Baidoa required urgent nutrition and medical support. Thanks to your donations, this child has been fully supported.',
      publicCity: 'Baidoa', publicCountry: 'Somalia', publicMediaUrls: '[]',
      targetGoal: 1200, totalRaised: 1200,
      aiSanitizedAt: new Date(Date.now() - 20*86400000),
      adminPublishedAt: new Date(Date.now() - 18*86400000),
      completedAt: new Date(Date.now() - 5*86400000),
      assignedAgentId: agent.id,
    },
  });

  await prisma.notification.createMany({
    data: [
      { userId: admin.id, caseId: caseA.id, type: 'investigation_completed', title: '📋 Investigation Report Submitted', message: 'Field investigation complete. Ready for AI sanitization.', isRead: true },
      { userId: admin.id, type: 'case_submitted', title: '📥 New Emergency Report', message: 'A new food emergency case has been submitted and requires your review.', isRead: false },
      { userId: reporter.id, caseId: caseA.id, type: 'case_published', title: '✅ Your Case is Now Live', message: 'Your submitted case has been verified and published to the donor portal.', isRead: false },
      { userId: donor.id, caseId: caseA.id, type: 'payment_confirmed', title: '💳 Payment Confirmed', message: 'Your donation of $1,200 has been confirmed and is now in escrow.', isRead: false },
      { userId: agent.id, caseId: caseC.id, type: 'case_assigned', title: '🗂️ New Investigation Assigned', message: 'A high-priority shelter case in Mogadishu has been assigned to you.', isRead: true },
    ],
  });

  await prisma.adminAuditLog.createMany({
    data: [
      { adminId: admin.id, caseId: caseA.id, action: 'assigned_team', notes: 'Assigned Abdi Yusuf to investigate this medical emergency.' },
      { adminId: admin.id, caseId: caseA.id, action: 'triggered_ai', notes: 'Triggered AI sanitization after field report submitted.' },
      { adminId: admin.id, caseId: caseA.id, action: 'published', notes: 'Approved AI output and published to donor portal.' },
    ],
  });

  console.log(`
╔══════════════════════════════════════════════════════╗
║           🌍 KAFAALE DATABASE SEEDED ✅              ║
╠══════════════════════════════════════════════════════╣
║  Password for all accounts: Kafaale123!              ║
╠══════════════════════════════════════════════════════╣
║  superadmin@kafaale.org  → Super Admin               ║
║  admin@kafaale.org       → Admin / Office            ║
║  agent@kafaale.org       → Field Agent               ║
║  donor@kafaale.org       → Sponsor / Donor           ║
║  reporter@kafaale.org    → Reporter                  ║
╠══════════════════════════════════════════════════════╣
║  4 cases created (medical, food, shelter, orphan)    ║
╚══════════════════════════════════════════════════════╝
  `);
}

main().catch(e => { console.error('❌ Seed error:', e); process.exit(1); }).finally(() => prisma.$disconnect());
