import express from 'express';
import { stripe, isStripeConfigured } from '../lib/stripe';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { isAuthenticated } from '../replitAuth';

const router = express.Router();

// Validation schemas
const checkoutSchema = z.object({
  planCode: z.string(),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
});

const webhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
});

// Create Stripe Checkout Session
router.post('/checkout', isAuthenticated, async (req: any, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ 
        error: 'Billing system not configured. Please contact support.' 
      });
    }

    const { planCode, successUrl, cancelUrl } = checkoutSchema.parse(req.body);
    const sessionUser = req.user as any;
    const userEmail = sessionUser?.claims?.email;
    const userId = sessionUser?.claims?.sub;

    if (!userEmail || !userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get or create user in database
    let dbUser = await prisma.user.findFirst({
      where: { email: userEmail }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: userEmail,
          name: sessionUser?.claims?.first_name ? `${sessionUser.claims.first_name} ${sessionUser.claims.last_name || ''}`.trim() : null,
        }
      });
    }

    // Get plan configuration
    const plan = await prisma.planConfig.findUnique({
      where: { planCode },
    });

    if (!plan || !plan.isActive) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check for existing subscription
    const existingSub = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        status: { in: ['active', 'trialing'] },
      },
    });

    if (existingSub) {
      return res.status(400).json({ 
        error: 'You already have an active subscription' 
      });
    }

    // Create or get Stripe customer
    let stripeCustomerId: string;
    
    const existingCustomer = await prisma.subscription.findFirst({
      where: { userId: dbUser.id },
      select: { stripeCustId: true },
    });

    if (existingCustomer?.stripeCustId) {
      stripeCustomerId = existingCustomer.stripeCustId;
    } else {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name || undefined,
        metadata: {
          userId: dbUser.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    // Create Stripe Price if needed (in production, pre-create these)
    const priceOptions: any = {
      currency: 'usd',
      unit_amount: plan.priceCents,
      product_data: {
        name: plan.name,
        description: plan.description || undefined,
      },
    };

    // Only add recurring if it's not a one-time payment
    if (plan.interval !== 'one-time' && plan.priceCents > 0) {
      priceOptions.recurring = { interval: plan.interval as 'month' | 'year' };
    }

    const stripePrice = await stripe.prices.create(priceOptions);

    // Determine mode based on plan type
    const isSubscription = plan.interval !== 'one-time' && plan.priceCents > 0;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: successUrl || `${req.protocol}://${req.hostname}/checkout?success=true`,
      cancel_url: cancelUrl || `${req.protocol}://${req.hostname}/checkout?canceled=true`,
      metadata: {
        userId: dbUser.id,
        planCode: plan.planCode,
      },
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create Stripe Customer Portal Session
router.post('/portal', isAuthenticated, async (req: any, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ 
        error: 'Billing system not configured. Please contact support.' 
      });
    }

    const sessionUser = req.user as any;
    const userEmail = sessionUser?.claims?.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const dbUser = await prisma.user.findFirst({
      where: { email: userEmail }
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find user's Stripe customer ID
    const subscription = await prisma.subscription.findFirst({
      where: { userId: dbUser.id },
      select: { stripeCustId: true },
    });

    if (!subscription?.stripeCustId) {
      return res.status(404).json({ error: 'No billing information found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustId,
      return_url: `${req.protocol}://${req.hostname}/dashboard`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// Stripe Webhook Handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).send('Billing system not configured');
    }

    const signature = req.headers['stripe-signature'] as string;
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('No webhook secret configured');
      return res.status(400).send('Webhook secret not configured');
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        await handlePaymentFailed(invoice);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error}`);
  }
});

// Webhook handlers
async function handleCheckoutCompleted(session: any) {
  const userId = session.metadata?.userId;
  const planCode = session.metadata?.planCode;

  if (!userId || !planCode) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const plan = await prisma.planConfig.findUnique({
    where: { planCode },
  });

  if (!plan) {
    console.error('Plan not found:', planCode);
    return;
  }

  // Create subscription record
  if (session.subscription) {
    const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);
    
    await prisma.subscription.create({
      data: {
        userId,
        planCode,
        stripeCustId: session.customer,
        stripeSubId: session.subscription,
        status: stripeSubscription.status,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    });

    // Grant initial credits if plan includes them
    const entitlements = plan.entitlements as any;
    if (entitlements?.creditsIncluded > 0) {
      await grantCredits(userId, entitlements.creditsIncluded, 'subscription.grant');
    }
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  await prisma.subscription.updateMany({
    where: { stripeSubId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  await prisma.subscription.updateMany({
    where: { stripeSubId: subscription.id },
    data: { status: 'canceled' },
  });
}

async function handlePaymentFailed(invoice: any) {
  // Update subscription status to past_due
  if (invoice.subscription) {
    await prisma.subscription.updateMany({
      where: { stripeSubId: invoice.subscription },
      data: { status: 'past_due' },
    });
  }
}

async function grantCredits(userId: string, amount: number, reason: string) {
  const currentBalance = await getCurrentCreditsBalance(userId);
  
  await prisma.creditLedger.create({
    data: {
      userId,
      delta: amount,
      reason,
      balanceAfter: currentBalance + amount,
    },
  });
}

async function getCurrentCreditsBalance(userId: string): Promise<number> {
  const latestEntry = await prisma.creditLedger.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { balanceAfter: true },
  });

  return latestEntry?.balanceAfter || 0;
}

export default router;