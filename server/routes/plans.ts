import express from 'express';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

const router = express.Router();

// Get all available plans
router.get('/', async (req, res) => {
  try {
    const plans = await prisma.planConfig.findMany({
      where: { isActive: true },
      orderBy: [
        { role: 'asc' },
        { priceCents: 'asc' },
      ],
    });

    // Group plans by role for easier frontend consumption
    const travelerPlans = plans.filter(p => p.role === Role.TRAVELER);
    const hostPlans = plans.filter(p => p.role === Role.HOST);

    return res.json({
      travelerPlans: travelerPlans.map(formatPlanForFrontend),
      hostPlans: hostPlans.map(formatPlanForFrontend),
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get plan by code
router.get('/:planCode', async (req, res) => {
  try {
    const { planCode } = req.params;
    
    const plan = await prisma.planConfig.findUnique({
      where: { planCode, isActive: true },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    return res.json(formatPlanForFrontend(plan));
  } catch (error) {
    console.error('Error fetching plan:', error);
    return res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

function formatPlanForFrontend(plan: any) {
  return {
    planCode: plan.planCode,
    name: plan.name,
    description: plan.description,
    price: {
      cents: plan.priceCents,
      display: formatPrice(plan.priceCents),
    },
    interval: plan.interval,
    role: plan.role,
    tier: plan.tier,
    entitlements: plan.entitlements,
    isPopular: isPopularPlan(plan.planCode),
  };
}

function formatPrice(cents: number): string {
  if (cents === 0) return 'Free';
  
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
}

function isPopularPlan(planCode: string): boolean {
  // Mark certain plans as "popular" for UI highlighting
  const popularPlans = [
    'TRAVELER_SILVER_MONTHLY',
    'HOST_PRO_MONTHLY',
  ];
  return popularPlans.includes(planCode);
}

export default router;