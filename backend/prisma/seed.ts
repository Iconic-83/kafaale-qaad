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
      publicCity: 'Mogadishu', publicCountry: 'Somalia', publicMediaUrls: [],
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
      safeMediaUrls: [], piiDetected: true,
      piiRemoved: ['victim full name', 'victim phone', 'exact home address', 'GPS coords'],
      mediaFlagged: [], confidenceScore: 94, model: 'claude-sonnet-4-6',
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
      publicCity: 'Baidoa', publicCountry: 'Somalia', publicMediaUrls: [],
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

  // ── Impact Partners seed ──────────────────────────────────────────────────
  const partnerData = [
    // Featured
    { slug: 'al-khair-foundation',     tier: 'featured',      name: 'Al-Khair Foundation',       avatar: '🏛️', type: 'ngo',          country: 'United Kingdom', countryFlag: '🇬🇧', color: '#3B82F6', isVerified: true, casesSupported: 312, familiesImpacted: 840, totalDonated: 124000, description: 'Providing emergency food and medical support across East Africa since 2019.', focus: ['Food Aid','Medical','Shelter'],      impactStory: 'Family of 7 Receives Emergency Shelter', impactBefore: 'A mother and six children were sleeping in an open field after their home was destroyed by flooding.', impactAfter: 'Within 18 days of verification, shelter materials were delivered. The family now has a safe, weatherproof home.', caseRef: 'Case #KQ-2024-0441', featuredOrder: 1 },
    { slug: 'somali-medical-relief',   tier: 'featured',      name: 'Somali Medical Relief',     avatar: '🏥', type: 'organization', country: 'Somalia',        countryFlag: '🇸🇴', color: '#10B981', isVerified: true, casesSupported: 198, familiesImpacted: 540, totalDonated: 78000,  description: 'Mobile medical units delivering care to remote communities and displaced families.',focus: ['Medical','Emergency Care'],         impactStory: 'Child Malnutrition Case Fully Resolved', impactBefore: 'A 4-year-old boy was referred for severe acute malnutrition. His family had no income and could not afford therapeutic food.', impactAfter: 'Medical aid partner sponsored 3 months of therapeutic nutrition support. The child recovered to healthy weight and was discharged.', caseRef: 'Case #KQ-2024-0189', featuredOrder: 2 },
    { slug: 'hope-bridge-initiative',  tier: 'featured',      name: 'Hope Bridge Initiative',    avatar: '🌱', type: 'ngo',          country: 'United States',  countryFlag: '🇺🇸', color: '#8B5CF6', isVerified: true, casesSupported: 241, familiesImpacted: 610, totalDonated: 95000,  description: 'Sponsoring orphan education programs and long-term family resilience projects.', focus: ['Education','Orphan Support'],       impactStory: '12 Orphaned Children Back in School', impactBefore: '12 children aged 6–14 had dropped out of school after losing their parents. No funds for supplies, uniforms, or school fees.', impactAfter: 'Education Without Borders sponsored a full academic year for all 12 children including materials, uniforms, and teacher support.', caseRef: 'Case #KQ-2024-0312', featuredOrder: 3 },
    { slug: 'gulf-humanitarian-council', tier: 'featured',    name: 'Gulf Humanitarian Council', avatar: '🤝', type: 'organization', country: 'UAE',            countryFlag: '🇦🇪', color: '#F59E0B', isVerified: true, casesSupported: 175, familiesImpacted: 490, totalDonated: 67000,  description: 'Coordinating large-scale disaster response and shelter rebuilding efforts.',     focus: ['Disaster Relief','Shelter'],        featuredOrder: 4 },
    { slug: 'education-without-borders', tier: 'featured',    name: 'Education Without Borders', avatar: '📚', type: 'ngo',          country: 'Canada',         countryFlag: '🇨🇦', color: '#EC4899', isVerified: true, casesSupported: 133, familiesImpacted: 320, totalDonated: 44000,  description: 'Funding school supplies, teachers, and learning spaces for conflict-affected children.', focus: ['Education','Children'],          featuredOrder: 5 },
    { slug: 'diakonia-relief',         tier: 'featured',      name: 'Diakonia Relief Services',  avatar: '⛪', type: 'ngo',          country: 'Sweden',         countryFlag: '🇸🇪', color: '#06B6D4', isVerified: true, casesSupported: 89,  familiesImpacted: 220, totalDonated: 31000,  description: 'Long-term partnership for food security and livelihoods in southern Somalia.',  focus: ['Food Security','Livelihoods'],      featuredOrder: 6 },
    // Community supporters
    { slug: 'anonymous-supporter-1',   tier: 'community',     name: 'Anonymous Supporter',       avatar: '👤', type: 'individual',   country: 'Global',         countryFlag: '🌍', color: '#5A6E8A', isAnonymous: true,  casesSupported: 14 },
    { slug: 'medical-aid-partner-de',  tier: 'community',     name: 'Medical Aid Partner',       avatar: '💊', type: 'individual',   country: 'Germany',        countryFlag: '🇩🇪', color: '#10B981', isVerified: true,   casesSupported: 7  },
    { slug: 'education-sponsor-nl',    tier: 'community',     name: 'Education Sponsor',         avatar: '📖', type: 'individual',   country: 'Netherlands',    countryFlag: '🇳🇱', color: '#8B5CF6', casesSupported: 11 },
    { slug: 'community-donor-global',  tier: 'community',     name: 'Community Donor',           avatar: '🌾', type: 'individual',   country: 'Global',         countryFlag: '🌍', color: '#F59E0B', isAnonymous: true,  casesSupported: 5  },
    { slug: 'shelter-aid-tr',          tier: 'community',     name: 'Shelter Aid Friend',        avatar: '🏗️', type: 'individual',   country: 'Turkey',         countryFlag: '🇹🇷', color: '#3B82F6', casesSupported: 9  },
    { slug: 'water-wash-fr',           tier: 'community',     name: 'Water & WASH Sponsor',      avatar: '💧', type: 'individual',   country: 'France',         countryFlag: '🇫🇷', color: '#06B6D4', casesSupported: 6  },
    { slug: 'orphan-care-sa',          tier: 'community',     name: 'Orphan Care Supporter',     avatar: '👶', type: 'individual',   country: 'Saudi Arabia',   countryFlag: '🇸🇦', color: '#EC4899', casesSupported: 18 },
    { slug: 'emergency-responder-no',  tier: 'community',     name: 'Emergency Responder',       avatar: '🚑', type: 'individual',   country: 'Norway',         countryFlag: '🇳🇴', color: '#C0392B', casesSupported: 4  },
    // Verified organizations
    { slug: 'banadir-hospital',        tier: 'verified_org',  name: 'Banadir Regional Hospital', avatar: '🏥', type: 'organization', country: 'Somalia',        countryFlag: '🇸🇴', color: '#10B981', isVerified: true, description: 'Public Hospital' },
    { slug: 'mogadishu-ngo-consortium',tier: 'verified_org',  name: 'Mogadishu NGO Consortium',  avatar: '🌿', type: 'ngo',          country: 'Somalia',        countryFlag: '🇸🇴', color: '#3B82F6', isVerified: true, description: 'NGO Network' },
    { slug: 'fao-somalia',             tier: 'verified_org',  name: 'FAO Somalia Field Office',  avatar: '🚜', type: 'government',   country: 'Somalia',        countryFlag: '🇸🇴', color: '#F59E0B', isVerified: true, description: 'UN Agency Partner' },
    { slug: 'wfp-distribution-hub',   tier: 'verified_org',  name: 'WFP Local Distribution Hub',avatar: '📦', type: 'organization', country: 'Somalia',        countryFlag: '🇸🇴', color: '#8B5CF6', isVerified: true, description: 'Food Distribution' },
    { slug: 'unicef-child-aid',        tier: 'verified_org',  name: 'UNICEF Child Aid Programme',avatar: '🧒', type: 'government',   country: 'Regional',       countryFlag: '🌍', color: '#EC4899', isVerified: true, description: 'Child Welfare Agency' },
    { slug: 'shelter-cluster',         tier: 'verified_org',  name: 'Shelter Cluster Somalia',   avatar: '🏗️', type: 'organization', country: 'Somalia',        countryFlag: '🇸🇴', color: '#06B6D4', isVerified: true, description: 'Shelter Coordination' },
    { slug: 'who-immunization',        tier: 'verified_org',  name: 'WHO Immunization Partners', avatar: '💉', type: 'government',   country: 'Regional',       countryFlag: '🌍', color: '#C0392B', isVerified: true, description: 'Health Partner' },
    { slug: 'unhcr-education',         tier: 'verified_org',  name: 'UNHCR Education Initiative',avatar: '📚', type: 'government',   country: 'Regional',       countryFlag: '🌍', color: '#E0AB21', isVerified: true, description: 'Refugee Education' },
  ];

  for (const p of partnerData) {
    await prisma.partner.upsert({
      where:  { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✅ ${partnerData.length} Impact Partners seeded`);

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
║  22 Impact Partners seeded                           ║
╚══════════════════════════════════════════════════════╝
  `);
}

main().catch(e => { console.error('❌ Seed error:', e); process.exit(1); }).finally(() => prisma.$disconnect());
