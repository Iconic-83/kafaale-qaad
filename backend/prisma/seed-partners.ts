import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const PARTNERS = [
  { slug: 'al-khair-foundation',       tier: 'featured',     name: 'Al-Khair Foundation',        avatar: '🏛️', type: 'ngo',          country: 'United Kingdom', countryFlag: '🇬🇧', color: '#3B82F6', isVerified: true,  casesSupported: 312, familiesImpacted: 840, totalDonated: 124000, description: 'Providing emergency food and medical support across East Africa since 2019.', focus: ['Food Aid','Medical','Shelter'],   impactStory: 'Family of 7 Receives Emergency Shelter', impactBefore: 'A mother and six children were sleeping in an open field after their home was destroyed by flooding.', impactAfter: 'Within 18 days of verification, shelter materials were delivered. The family now has a safe, weatherproof home.', caseRef: 'Case #KQ-2024-0441', featuredOrder: 1 },
  { slug: 'somali-medical-relief',     tier: 'featured',     name: 'Somali Medical Relief',      avatar: '🏥', type: 'organization', country: 'Somalia',        countryFlag: '🇸🇴', color: '#10B981', isVerified: true,  casesSupported: 198, familiesImpacted: 540, totalDonated: 78000,  description: 'Mobile medical units delivering care to remote communities and displaced families.', focus: ['Medical','Emergency Care'],   impactStory: 'Child Malnutrition Case Fully Resolved', impactBefore: 'A 4-year-old boy was referred for severe acute malnutrition with no family income.', impactAfter: 'Sponsored 3 months of therapeutic nutrition. Child recovered to healthy weight and was discharged.', caseRef: 'Case #KQ-2024-0189', featuredOrder: 2 },
  { slug: 'hope-bridge-initiative',    tier: 'featured',     name: 'Hope Bridge Initiative',     avatar: '🌱', type: 'ngo',          country: 'United States',  countryFlag: '🇺🇸', color: '#8B5CF6', isVerified: true,  casesSupported: 241, familiesImpacted: 610, totalDonated: 95000,  description: 'Sponsoring orphan education programs and long-term family resilience projects.', focus: ['Education','Orphan Support'], impactStory: '12 Orphaned Children Back in School', impactBefore: '12 children aged 6-14 had dropped out of school after losing their parents.', impactAfter: 'Sponsored a full academic year for all 12 children including materials, uniforms, and teacher support.', caseRef: 'Case #KQ-2024-0312', featuredOrder: 3 },
  { slug: 'gulf-humanitarian-council', tier: 'featured',     name: 'Gulf Humanitarian Council',  avatar: '🤝', type: 'organization', country: 'UAE',            countryFlag: '🇦🇪', color: '#F59E0B', isVerified: true,  casesSupported: 175, familiesImpacted: 490, totalDonated: 67000,  description: 'Coordinating large-scale disaster response and shelter rebuilding efforts.', focus: ['Disaster Relief','Shelter'], featuredOrder: 4 },
  { slug: 'education-without-borders', tier: 'featured',     name: 'Education Without Borders',  avatar: '📚', type: 'ngo',          country: 'Canada',         countryFlag: '🇨🇦', color: '#EC4899', isVerified: true,  casesSupported: 133, familiesImpacted: 320, totalDonated: 44000,  description: 'Funding school supplies, teachers, and learning spaces for conflict-affected children.', focus: ['Education','Children'], featuredOrder: 5 },
  { slug: 'diakonia-relief',           tier: 'featured',     name: 'Diakonia Relief Services',   avatar: '⛪', type: 'ngo',          country: 'Sweden',         countryFlag: '🇸🇪', color: '#06B6D4', isVerified: true,  casesSupported: 89,  familiesImpacted: 220, totalDonated: 31000,  description: 'Long-term partnership for food security and livelihoods in southern Somalia.', focus: ['Food Security','Livelihoods'], featuredOrder: 6 },
  { slug: 'anonymous-supporter-1',     tier: 'community',    name: 'Anonymous Supporter',        avatar: '👤', type: 'individual',   country: 'Global',         countryFlag: '🌍', color: '#5A6E8A', isAnonymous: true,  casesSupported: 14 },
  { slug: 'medical-aid-partner-de',    tier: 'community',    name: 'Medical Aid Partner',        avatar: '💊', type: 'individual',   country: 'Germany',        countryFlag: '🇩🇪', color: '#10B981', isVerified: true,   casesSupported: 7  },
  { slug: 'education-sponsor-nl',      tier: 'community',    name: 'Education Sponsor',          avatar: '📖', type: 'individual',   country: 'Netherlands',    countryFlag: '🇳🇱', color: '#8B5CF6', casesSupported: 11 },
  { slug: 'community-donor-global',    tier: 'community',    name: 'Community Donor',            avatar: '🌾', type: 'individual',   country: 'Global',         countryFlag: '🌍', color: '#F59E0B', isAnonymous: true,  casesSupported: 5  },
  { slug: 'shelter-aid-tr',            tier: 'community',    name: 'Shelter Aid Friend',         avatar: '🏗️', type: 'individual',   country: 'Turkey',         countryFlag: '🇹🇷', color: '#3B82F6', casesSupported: 9  },
  { slug: 'water-wash-fr',             tier: 'community',    name: 'Water & WASH Sponsor',       avatar: '💧', type: 'individual',   country: 'France',         countryFlag: '🇫🇷', color: '#06B6D4', casesSupported: 6  },
  { slug: 'orphan-care-sa',            tier: 'community',    name: 'Orphan Care Supporter',      avatar: '👶', type: 'individual',   country: 'Saudi Arabia',   countryFlag: '🇸🇦', color: '#EC4899', casesSupported: 18 },
  { slug: 'emergency-responder-no',    tier: 'community',    name: 'Emergency Responder',        avatar: '🚑', type: 'individual',   country: 'Norway',         countryFlag: '🇳🇴', color: '#C0392B', casesSupported: 4  },
  { slug: 'banadir-hospital',          tier: 'verified_org', name: 'Banadir Regional Hospital',  avatar: '🏥', type: 'organization', country: 'Somalia',        countryFlag: '🇸🇴', color: '#10B981', isVerified: true, description: 'Public Hospital' },
  { slug: 'mogadishu-ngo-consortium',  tier: 'verified_org', name: 'Mogadishu NGO Consortium',   avatar: '🌿', type: 'ngo',          country: 'Somalia',        countryFlag: '🇸🇴', color: '#3B82F6', isVerified: true, description: 'NGO Network' },
  { slug: 'fao-somalia',               tier: 'verified_org', name: 'FAO Somalia Field Office',   avatar: '🚜', type: 'government',   country: 'Somalia',        countryFlag: '🇸🇴', color: '#F59E0B', isVerified: true, description: 'UN Agency Partner' },
  { slug: 'wfp-distribution-hub',      tier: 'verified_org', name: 'WFP Local Distribution Hub', avatar: '📦', type: 'organization', country: 'Somalia',        countryFlag: '🇸🇴', color: '#8B5CF6', isVerified: true, description: 'Food Distribution' },
  { slug: 'unicef-child-aid',          tier: 'verified_org', name: 'UNICEF Child Aid Programme', avatar: '🧒', type: 'government',   country: 'Regional',       countryFlag: '🌍', color: '#EC4899', isVerified: true, description: 'Child Welfare Agency' },
  { slug: 'shelter-cluster',           tier: 'verified_org', name: 'Shelter Cluster Somalia',    avatar: '🏗️', type: 'organization', country: 'Somalia',        countryFlag: '🇸🇴', color: '#06B6D4', isVerified: true, description: 'Shelter Coordination' },
  { slug: 'who-immunization',          tier: 'verified_org', name: 'WHO Immunization Partners',  avatar: '💉', type: 'government',   country: 'Regional',       countryFlag: '🌍', color: '#C0392B', isVerified: true, description: 'Health Partner' },
  { slug: 'unhcr-education',           tier: 'verified_org', name: 'UNHCR Education Initiative', avatar: '📚', type: 'government',   country: 'Regional',       countryFlag: '🌍', color: '#E0AB21', isVerified: true, description: 'Refugee Education' },
];

async function main() {
  console.log('🌱 Seeding Impact Partners…');
  let count = 0;
  for (const p of PARTNERS) {
    await prisma.partner.upsert({
      where:  { slug: p.slug },
      update: p,
      create: { id: randomUUID(), updatedAt: new Date(), ...p },
    });
    count++;
    process.stdout.write(`  ✓ ${p.name}\n`);
  }
  console.log(`\n✅ ${count} partners seeded into the live database!`);
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
