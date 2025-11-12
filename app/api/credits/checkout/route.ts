import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/get-current-user';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});

// Validation schema
const CheckoutSchema = z.object({
  packageId: z.string(),
  credits: z.number().min(1),
  price: z.number().min(0.5), // Stripe minimum
});

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();

    // Parse and validate request
    const body = await request.json();
    const { packageId, credits, price } = CheckoutSchema.parse(body);

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment system is not configured' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} Credits`,
              description: 'VoiceCraft AI Credits - Never expires',
              images: [], // You can add product images here
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=success&credits=${credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=cancelled`,
      metadata: {
        userId,
        packageId,
        credits: credits.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });

  } catch (error: any) {
    console.error('Checkout error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Stripe errors
    if (error.type) {
      return NextResponse.json(
        {
          error: 'Payment processing error',
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
