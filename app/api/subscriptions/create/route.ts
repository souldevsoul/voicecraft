import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/get-current-user'
import { createSubscription, PLANS } from '@/lib/subscriptions'

const CreateSubscriptionSchema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise']),
  startTrial: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()

    // Parse and validate request
    const body = await request.json()
    const { plan, startTrial } = CreateSubscriptionSchema.parse(body)

    // Check if trial is available for this plan
    const planConfig = PLANS[plan]
    const canStartTrial = startTrial && planConfig.trialDays > 0

    // Create subscription
    const subscription = await createSubscription(userId, plan, canStartTrial)

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        isTrialing: subscription.isTrialing,
        trialEndsAt: subscription.trialEndsAt,
        monthlyCharacterLimit: subscription.monthlyCharacterLimit,
        monthlyVoiceClones: subscription.monthlyVoiceClones,
        allowCustomVoices: subscription.allowCustomVoices,
        allowCommercialUse: subscription.allowCommercialUse,
      },
    })

  } catch (error: any) {
    console.error('Create subscription error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create subscription',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
