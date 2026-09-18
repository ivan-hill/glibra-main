import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const plans = [
  // Traveler Plans
  {
    planCode: 'TRAVELER_FREE',
    name: 'Free Traveler',
    description: 'Basic travel planning features',
    priceCents: 0,
    interval: 'month',
    role: Role.TRAVELER,
    tier: 'FREE',
    entitlements: {
      bookingsPerMonth: 3,
      serviceFeeDiscount: 0,
      creditsIncluded: 0,
      prioritySupport: false,
      advancedFilters: false,
    },
  },
  {
    planCode: 'TRAVELER_SILVER_MONTHLY',
    name: 'Silver Traveler',
    description: 'Enhanced travel planning with more bookings',
    priceCents: 999, // $9.99
    interval: 'month',
    role: Role.TRAVELER,
    tier: 'SILVER',
    entitlements: {
      bookingsPerMonth: 15,
      serviceFeeDiscount: 0.25, // 25% off service fees
      creditsIncluded: 100,
      prioritySupport: false,
      advancedFilters: true,
    },
  },
  {
    planCode: 'TRAVELER_SILVER_YEARLY',
    name: 'Silver Traveler (Annual)',
    description: 'Enhanced travel planning with more bookings - save with annual billing',
    priceCents: 9900, // $99/year (2 months free)
    interval: 'year',
    role: Role.TRAVELER,
    tier: 'SILVER',
    entitlements: {
      bookingsPerMonth: 15,
      serviceFeeDiscount: 0.25,
      creditsIncluded: 1200, // 12 months worth
      prioritySupport: false,
      advancedFilters: true,
    },
  },
  {
    planCode: 'TRAVELER_GOLD_MONTHLY',
    name: 'Gold Traveler',
    description: 'Premium travel planning with unlimited bookings',
    priceCents: 1999, // $19.99
    interval: 'month',
    role: Role.TRAVELER,
    tier: 'GOLD',
    entitlements: {
      bookingsPerMonth: -1, // unlimited
      serviceFeeDiscount: 0.5, // 50% off service fees
      creditsIncluded: 250,
      prioritySupport: true,
      advancedFilters: true,
      conciergeService: true,
    },
  },
  {
    planCode: 'TRAVELER_GOLD_YEARLY',
    name: 'Gold Traveler (Annual)',
    description: 'Premium travel planning with unlimited bookings - save with annual billing',
    priceCents: 19900, // $199/year (2 months free)
    interval: 'year',
    role: Role.TRAVELER,
    tier: 'GOLD',
    entitlements: {
      bookingsPerMonth: -1, // unlimited
      serviceFeeDiscount: 0.5,
      creditsIncluded: 3000, // 12 months worth
      prioritySupport: true,
      advancedFilters: true,
      conciergeService: true,
    },
  },
  // Host Plans - New Glibra Pricing with Media Placements
  {
    planCode: 'HOST_FREE',
    name: 'Free',
    description: 'Essential visibility + basic protection',
    priceCents: 0,
    interval: 'month',
    role: Role.HOST,
    tier: 'FREE',
    entitlements: {
      listingImport: true,
      discoveryVisibility: true,
      fallbacksPerMonth: 1,
      basicDashboard: true,
      aiRecommendations: true,
      listings: 1,
    },
  },
  {
    planCode: 'HOST_INTRO',
    name: 'Intro',
    description: 'Unlock dashboard after 3-day free trial',
    priceCents: 100, // $1 one-time
    interval: 'one-time',
    role: Role.HOST,
    tier: 'INTRO',
    entitlements: {
      unlimitedDashboard: true,
      fallbackAnalytics: true,
      aiCalendarInsights: true,
      visibilityScoring: true,
      listings: 3,
    },
  },
  {
    planCode: 'HOST_PROTECT',
    name: 'Protect',
    description: 'Core plan for revenue stability',
    priceCents: 900, // $9/month
    interval: 'month',
    role: Role.HOST,
    tier: 'PROTECT',
    entitlements: {
      fallbacksPerMonth: 5,
      priorityFallbackPlacement: true,
      autoAppliedBundles: true,
      aiGuestMessaging: true,
      weatherAwareForecasting: true,
      apiSpeed: '2x',
      listings: 10,
      bundlesBloodlines: true, // Audio series mention
    },
  },
  {
    planCode: 'HOST_GROWTH',
    name: 'Growth',
    description: 'Advanced visibility and protection',
    priceCents: 2900, // $29/month
    interval: 'month',
    role: Role.HOST,
    tier: 'GROWTH',
    entitlements: {
      unlimitedFallback: true,
      tier1DiscoveryPlacement: true,
      mediaVisibility: true,
      advancedAnalytics: true,
      compSetInsights: true,
      apiSpeed: '4x',
      listings: 25,
      bundlesBloodlines: true, // Audio series
      connectedTravelWaves: true, // Podcast placement
      nanoBanana: true, // Image enhancement
    },
  },
  {
    planCode: 'HOST_ELITE',
    name: 'Elite',
    description: 'Full automation + revenue maximization',
    priceCents: 9900, // $99/month
    interval: 'month',
    role: Role.HOST,
    tier: 'ELITE',
    entitlements: {
      guaranteedFallbackOccupancy: true,
      dynamicPricingEngine: true,
      publicMediaPlacement: true,
      guestAiConcierge: true,
      smartGlassesArVisibility: true,
      listings: -1, // Unlimited
      prioritySupport: true,
      bundlesBloodlines: true, // Audio series
      connectedTravelWaves: true, // Podcast placement
      nanoBanana: true, // Image enhancement
      interactiveGame: true, // Game placement
    },
  },
];

const sampleUsers = [
  {
    email: 'traveler@example.com',
    name: 'Sarah Traveler',
    role: Role.TRAVELER,
    password: 'password123',
  },
  {
    email: 'host@example.com',
    name: 'Mike Host',
    role: Role.HOST,
    password: 'password123',
  },
  {
    email: 'admin@glibra.com',
    name: 'Admin User',
    role: Role.ADMIN,
    password: 'admin123',
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.lineItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.creditLedger.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.planConfig.deleteMany();
  await prisma.user.deleteMany();

  // Seed plan configurations
  console.log('Creating plan configurations...');
  for (const plan of plans) {
    await prisma.planConfig.create({
      data: plan,
    });
  }

  // Seed sample users
  console.log('Creating sample users...');
  const createdUsers = [];
  for (const userData of sampleUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
    });
    createdUsers.push(user);
  }

  // Create a provider for the host user
  const hostUser = createdUsers.find(u => u.role === Role.HOST);
  if (hostUser) {
    console.log('Creating sample provider...');
    const provider = await prisma.provider.create({
      data: {
        userId: hostUser.id,
        name: "Mike's Travel Services",
        tier: 'BASIC',
        sponsoredCredits: 500,
      },
    });

    // Create sample listings
    const sampleListings = [
      {
        title: 'Cozy Mountain Cabin',
        description: 'Perfect retreat in the mountains',
        priceCents: 15000, // $150/night
      },
      {
        title: 'Downtown Apartment',
        description: 'Modern apartment in city center',
        priceCents: 12000, // $120/night
      },
      {
        title: 'Beachfront Villa',
        description: 'Stunning ocean views',
        priceCents: 35000, // $350/night
        isSponsored: true,
      },
    ];

    for (const listing of sampleListings) {
      await prisma.listing.create({
        data: {
          ...listing,
          providerId: provider.id,
        },
      });
    }
  }

  // Give the traveler some initial credits
  const travelerUser = createdUsers.find(u => u.role === Role.TRAVELER);
  if (travelerUser) {
    console.log('Adding initial credits...');
    await prisma.creditLedger.create({
      data: {
        userId: travelerUser.id,
        delta: 500,
        reason: 'welcome.bonus',
        balanceAfter: 500,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });