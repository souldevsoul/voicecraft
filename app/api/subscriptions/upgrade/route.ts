import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
})

const UpgradeSchema = z.object({
  plan: z.enum(["pro", "enterprise"]),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plan } = UpgradeSchema.parse(body)

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const currentSubscription = user.subscriptions[0]

    // Check if user is already on this plan
    if (currentSubscription?.plan === plan) {
      return NextResponse.json(
        { error: `You are already on the ${plan} plan` },
        { status: 400 }
      )
    }

    // If upgrading to Pro, create Stripe Checkout session
    if (plan === "pro") {
      // For now, start a 14-day free trial (no payment required)
      // In production, you would create a Stripe checkout session here

      const planLimits = {
        pro: {
          monthlyCharacterLimit: 100000,
          monthlyVoiceClones: 5,
          allowCustomVoices: true,
          allowCommercialUse: true,
          trialDays: 14,
        },
      }

      const limits = planLimits[plan]
      const now = new Date()
      const trialEndsAt = new Date(
        now.getTime() + limits.trialDays * 24 * 60 * 60 * 1000
      )

      // Update or create subscription
      if (currentSubscription) {
        await prisma.subscription.update({
          where: { id: currentSubscription.id },
          data: {
            plan,
            status: "trialing",
            isTrialing: true,
            trialEndsAt,
            monthlyCharacterLimit: limits.monthlyCharacterLimit,
            monthlyVoiceClones: limits.monthlyVoiceClones,
            allowCustomVoices: limits.allowCustomVoices,
            allowCommercialUse: limits.allowCommercialUse,
            cancelledAt: null,
          },
        })
      } else {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            plan,
            status: "trialing",
            isTrialing: true,
            trialEndsAt,
            monthlyCharacterLimit: limits.monthlyCharacterLimit,
            monthlyVoiceClones: limits.monthlyVoiceClones,
            allowCustomVoices: limits.allowCustomVoices,
            allowCommercialUse: limits.allowCommercialUse,
          },
        })
      }

      return NextResponse.json({
        success: true,
        message: "Successfully upgraded to Pro plan with 14-day free trial!",
      })
    }

    // For Enterprise, redirect to contact page
    if (plan === "enterprise") {
      return NextResponse.json({
        success: true,
        message: "Please contact sales for Enterprise plan",
        redirectUrl: "/contact",
      })
    }

    return NextResponse.json(
      { error: "Invalid plan" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("Upgrade subscription error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to upgrade subscription",
        message: error.message,
      },
      { status: 500 }
    )
  }
}
