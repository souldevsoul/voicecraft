import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, getStripeWebhookSecret } from '@/lib/stripe';
import { purchaseCredits } from '@/lib/credits';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Get webhook secret (will throw if not configured)
    let webhookSecret: string;
    try {
      webhookSecret = getStripeWebhookSecret();
    } catch (error: any) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Initialize Stripe client (lazy initialization)
    const stripe = getStripeClient();

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Extract metadata
        const userId = session.metadata?.userId;
        const credits = parseInt(session.metadata?.credits || '0', 10);
        const packageId = session.metadata?.packageId;

        if (!userId || !credits) {
          console.error('Missing metadata in checkout session:', session.id);
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        console.log('Processing payment for user:', {
          userId,
          credits,
          packageId,
          sessionId: session.id,
          amountTotal: session.amount_total,
        });

        // Grant credits to user
        try {
          await purchaseCredits(
            userId,
            credits,
            session.id,
            {
              packageId,
              amountPaid: session.amount_total ? session.amount_total / 100 : 0,
              currency: session.currency,
              paymentIntent: session.payment_intent,
            }
          );

          console.log(`Successfully granted ${credits} credits to user ${userId}`);
        } catch (error) {
          console.error('Failed to grant credits:', error);
          // Don't fail the webhook, Stripe will retry
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        console.log('Checkout session expired:', session.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}
