import Stripe from 'stripe';

/**
 * Check if a value is a placeholder (not a real API key)
 */
function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;

  const placeholders = [
    'your-stripe-secret-key-here',
    'your-stripe-publishable-key-here',
    'your-stripe-webhook-secret-here',
    'sk_test_',
    'sk_live_',
  ];

  // Check if it's exactly a placeholder or starts with test/live prefix but is too short
  if (placeholders.some(p => value === p)) return true;
  if (value.startsWith('sk_test_') && value.length < 20) return true;
  if (value.startsWith('sk_live_') && value.length < 20) return true;

  return false;
}

/**
 * Get Stripe client instance with lazy initialization
 * This prevents Stripe from being instantiated during build time
 * when environment variables are not available
 */
export function getStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey || isPlaceholder(apiKey)) {
    throw new Error('STRIPE_SECRET_KEY is not configured. Please set a valid Stripe secret key in your environment variables.');
  }

  return new Stripe(apiKey, {
    apiVersion: '2025-10-29.clover',
  });
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  return !!apiKey && !isPlaceholder(apiKey);
}

/**
 * Get Stripe webhook secret
 */
export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || isPlaceholder(secret)) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured. Please set a valid Stripe webhook secret in your environment variables.');
  }

  return secret;
}
