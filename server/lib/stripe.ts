import Stripe from 'stripe';

// Initialize Stripe only if the secret key is provided
export let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });
  console.log('Stripe initialized successfully');
} else {
  console.log('Stripe not initialized - STRIPE_SECRET_KEY not provided');
}

export function isStripeConfigured(): boolean {
  return stripe !== null;
}

export default stripe;