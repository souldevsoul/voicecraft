"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import {
  RiVipCrownLine,
  RiShieldCheckLine,
  RiSparklingLine,
  RiArrowRightLine,
  RiTimerLine,
} from "react-icons/ri"

type Subscription = {
  plan: string
  status: string
  isTrialing: boolean
  trialEndsAt: Date | null
} | null

type DashboardSubscriptionBannerProps = {
  subscription: Subscription
}

export function DashboardSubscriptionBanner({
  subscription,
}: DashboardSubscriptionBannerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const currentPlan = subscription?.plan || "starter"
  const isStarter = currentPlan === "starter"
  const isPro = currentPlan === "pro"

  // Calculate trial days remaining
  let trialDaysRemaining = 0
  if (subscription?.isTrialing && subscription.trialEndsAt) {
    const now = new Date()
    const trialEnd = new Date(subscription.trialEndsAt)
    const diffTime = trialEnd.getTime() - now.getTime()
    trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (trialDaysRemaining < 0) trialDaysRemaining = 0
  }

  const handleUpgrade = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/subscriptions/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: "pro",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to upgrade subscription")
        setIsLoading(false)
        return
      }

      // Redirect to Stripe checkout or refresh page
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        router.refresh()
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // Show trial banner for Pro users on trial
  if (isPro && subscription?.isTrialing && trialDaysRemaining > 0) {
    return (
      <Card className="bg-yellow-400 border-4 border-black brutalist-shadow p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <RiTimerLine className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <Heading variant="h4" className="uppercase mb-1">
                FREE TRIAL ACTIVE
              </Heading>
              <Text variant="body-sm">
                You have{" "}
                <strong className="text-lg">{trialDaysRemaining} days</strong>{" "}
                remaining in your Pro trial
              </Text>
            </div>
          </div>
          <Link href="/dashboard/subscription">
            <Button
              size="md"
              className="gap-2 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase"
            >
              View Details
              <RiArrowRightLine className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  // Show upgrade banner for Starter users
  if (isStarter) {
    return (
      <Card className="bg-gradient-to-r from-yellow-400 to-yellow-300 border-4 border-black brutalist-shadow p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-500">
            <Text className="text-red-700 font-bold text-sm">{error}</Text>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
              <RiVipCrownLine className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <Heading variant="h3" className="uppercase mb-2">
                Unlock Pro Features
              </Heading>
              <Text variant="body" className="text-black mb-3">
                Get 100,000 characters/month, 5 voice clones, commercial use,
                and priority support. Start your 14-day free trial today!
              </Text>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center px-2 py-1 bg-black text-yellow-400 text-xs font-bold uppercase">
                  <RiSparklingLine className="w-3 h-3 mr-1" />
                  100K chars/month
                </div>
                <div className="inline-flex items-center px-2 py-1 bg-black text-yellow-400 text-xs font-bold uppercase">
                  <RiSparklingLine className="w-3 h-3 mr-1" />
                  5 Voice Clones
                </div>
                <div className="inline-flex items-center px-2 py-1 bg-black text-yellow-400 text-xs font-bold uppercase">
                  <RiSparklingLine className="w-3 h-3 mr-1" />
                  Commercial Use
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              onClick={handleUpgrade}
              disabled={isLoading}
              className="gap-3 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow whitespace-nowrap"
            >
              <RiSparklingLine className="w-5 h-5" />
              {isLoading ? "Processing..." : "Start Free Trial"}
              <RiArrowRightLine className="w-5 h-5" />
            </Button>
            <Link href="/dashboard/subscription">
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-xs font-bold uppercase"
              >
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  // Show current plan info for Pro users (not on trial)
  if (isPro) {
    return (
      <Card className="bg-yellow-400 border-4 border-black brutalist-shadow p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <RiVipCrownLine className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <Heading variant="h4" className="uppercase mb-1">
                Pro Plan Active
              </Heading>
              <Text variant="body-sm">
                You have access to all Pro features
              </Text>
            </div>
          </div>
          <Link href="/dashboard/subscription">
            <Button
              size="md"
              className="gap-2 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase"
            >
              Manage Subscription
              <RiArrowRightLine className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  return null
}
