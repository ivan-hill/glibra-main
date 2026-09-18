// Rate card configuration for fees, commissions, and pricing

export interface RateCard {
  serviceFee: {
    basePct: number; // Base service fee percentage
    travelerDiscounts: {
      [tier: string]: number; // Discount percentage by tier
    };
  };
  partnerCommissions: {
    defaultPct: number;
    hostTierRates: {
      [tier: string]: number; // Commission rate by host tier
    };
  };
  sponsored: {
    costPerImpression: number; // Cost per impression in cents
    costPerClick: number; // Cost per click in cents
    monthlyPackages: {
      [tier: string]: {
        priceCents: number;
        impressionsIncluded: number;
        clicksIncluded: number;
      };
    };
  };
  credits: {
    autoTopupTriggerPct: number; // Trigger auto-topup at this % of last purchase
    autoTopupAmount: number; // Default auto-topup amount in credits
    exchangeRate: number; // Credits to cents (1 credit = 1 cent)
  };
}

export const rateCard: RateCard = {
  serviceFee: {
    basePct: 0.055, // 5.5% base service fee
    travelerDiscounts: {
      FREE: 0, // No discount
      SILVER: 0.25, // 25% off service fee
      GOLD: 0.50, // 50% off service fee
    },
  },
  partnerCommissions: {
    defaultPct: 0.10, // 10% default commission
    hostTierRates: {
      BASIC: 0.15, // 15% commission for basic hosts
      PRO: 0.12, // 12% commission for pro hosts  
      ENTERPRISE: 0.10, // 10% commission for enterprise hosts
    },
  },
  sponsored: {
    costPerImpression: 5, // 5 cents per impression
    costPerClick: 25, // 25 cents per click
    monthlyPackages: {
      STARTER: {
        priceCents: 2500, // $25/month
        impressionsIncluded: 10000,
        clicksIncluded: 500,
      },
      GROWTH: {
        priceCents: 7500, // $75/month
        impressionsIncluded: 50000,
        clicksIncluded: 2000,
      },
      SCALE: {
        priceCents: 20000, // $200/month
        impressionsIncluded: 200000,
        clicksIncluded: 8000,
      },
    },
  },
  credits: {
    autoTopupTriggerPct: 0.20, // Auto-topup when balance < 20% of last purchase
    autoTopupAmount: 1000, // Default 1000 credits ($10)
    exchangeRate: 1, // 1 credit = 1 cent
  },
};

// Helper functions for rate calculations
export function calculateServiceFee(
  subtotalCents: number,
  travelerTier: string = 'FREE'
): number {
  const baseFee = Math.round(subtotalCents * rateCard.serviceFee.basePct);
  const discount = rateCard.serviceFee.travelerDiscounts[travelerTier] || 0;
  return Math.round(baseFee * (1 - discount));
}

export function calculatePartnerCommission(
  subtotalCents: number,
  hostTier: string = 'BASIC'
): number {
  const rate = rateCard.partnerCommissions.hostTierRates[hostTier] || 
               rateCard.partnerCommissions.defaultPct;
  return Math.round(subtotalCents * rate);
}

export function calculateSponsoredCost(
  impressions: number = 0,
  clicks: number = 0
): number {
  return (impressions * rateCard.sponsored.costPerImpression) +
         (clicks * rateCard.sponsored.costPerClick);
}

export function shouldTriggerAutoTopup(
  currentBalance: number,
  lastTopupAmount: number
): boolean {
  const threshold = Math.round(lastTopupAmount * rateCard.credits.autoTopupTriggerPct);
  return currentBalance <= threshold;
}

export function creditsTocents(credits: number): number {
  return credits * rateCard.credits.exchangeRate;
}

export function centsToCredits(cents: number): number {
  return Math.round(cents / rateCard.credits.exchangeRate);
}