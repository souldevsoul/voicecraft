import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
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

    // Get user with subscription
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

    const subscription = user.subscriptions[0]

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      )
    }

    // Check if already cancelled
    if (subscription.cancelledAt) {
      return NextResponse.json(
        { error: "Subscription is already cancelled" },
        { status: 400 }
      )
    }

    // If subscription has Stripe ID, cancel it in Stripe
    if (subscription.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        })
      } catch (stripeError: any) {
        console.error("Stripe cancellation error:", stripeError)
        // Continue even if Stripe fails
      }
    }

    // Mark subscription as cancelled in database
    const now = new Date()
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "cancelled",
        cancelledAt: now,
      },
    })

    return NextResponse.json({
      success: true,
      message:
        "Subscription cancelled successfully. You will have access until the end of your billing period.",
    })
  } catch (error: any) {
    console.error("Cancel subscription error:", error)

    return NextResponse.json(
      {
        error: "Failed to cancel subscription",
        message: error.message,
      },
      { status: 500 }
    )
  }
}
