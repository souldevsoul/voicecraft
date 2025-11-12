import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SubscriptionManager } from "@/components/dashboard/subscription-manager"

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/dashboard/subscription")
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
    redirect("/auth/signin")
  }

  const subscription = user.subscriptions[0]

  // Calculate trial days remaining
  let trialDaysRemaining = 0
  if (subscription?.trialEndsAt && subscription.isTrialing) {
    const now = new Date()
    const trialEnd = new Date(subscription.trialEndsAt)
    const diffTime = trialEnd.getTime() - now.getTime()
    trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (trialDaysRemaining < 0) trialDaysRemaining = 0
  }

  return (
    <SubscriptionManager
      subscription={subscription}
      trialDaysRemaining={trialDaysRemaining}
    />
  )
}
