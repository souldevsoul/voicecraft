"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heading, Text } from "@/components/ui/typography"
import {
  RiCheckLine,
  RiCloseLine,
  RiArrowRightLine,
  RiTimerLine,
  RiSparklingLine,
  RiShieldCheckLine,
  RiVipCrownLine,
} from "react-icons/ri"

interface Subscription {
  id: string
  plan: string
  status: string
  trialEndsAt: Date | null
  isTrialing: boolean
  monthlyCharacterLimit: number
  monthlyVoiceClones: number
  allowCustomVoices: boolean
  allowCommercialUse: boolean
  createdAt: Date
  cancelledAt: Date | null
}

interface SubscriptionManagerProps {
  subscription: Subscription | null
  trialDaysRemaining: number
}

export function SubscriptionManager({
  subscription,
  trialDaysRemaining,
}: SubscriptionManagerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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

      // Redirect to Stripe checkout or success page
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

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You will lose access to Pro features."
      )
    ) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to cancel subscription")
        setIsLoading(false)
        return
      }

      router.refresh()
    } catch (error) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const planFeatures = {
    starter: [
      { text: "5,000 characters/month", included: true },
      { text: "Basic voice presets", included: true },
      { text: "MP3 downloads", included: true },
      { text: "Voice cloning", included: false },
      { text: "Commercial use", included: false },
      { text: "Priority support", included: false },
    ],
    pro: [
      { text: "100,000 characters/month", included: true },
      { text: "All voice models", included: true },
      { text: "5 voice clones", included: true },
      { text: "WAV, MP3, FLAC formats", included: true },
      { text: "50+ languages", included: true },
      { text: "Commercial use", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: true },
    ],
    enterprise: [
      { text: "Unlimited characters", included: true },
      { text: "All voice models + beta", included: true },
      { text: "Unlimited voice clones", included: true },
      { text: "All audio formats", included: true },
      { text: "Custom model training", included: true },
      { text: "Commercial use", included: true },
      { text: "Dedicated support 24/7", included: true },
      { text: "Full API access", included: true },
      { text: "Custom integrations", included: true },
      { text: "SLA guarantee", included: true },
    ],
  }

  const currentPlan = subscription?.plan || "starter"
  const features = planFeatures[currentPlan as keyof typeof planFeatures]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Error Message */}
      {error && (
        <Card className="bg-red-100 border-4 border-red-500 p-6">
          <Text className="text-red-700 font-bold uppercase">{error}</Text>
        </Card>
      )}

      {/* Trial Banner */}
      {subscription?.isTrialing && trialDaysRemaining > 0 && (
        <Card className="bg-yellow-400 border-4 border-black brutalist-shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black flex items-center justify-center">
              <RiTimerLine className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex-1">
              <Heading variant="h3" className="uppercase mb-2">
                FREE TRIAL ACTIVE
              </Heading>
              <Text variant="body">
                You have{" "}
                <strong className="text-xl">{trialDaysRemaining} days</strong>{" "}
                remaining in your free trial. Enjoy full Pro access!
              </Text>
            </div>
          </div>
        </Card>
      )}

      {/* Current Plan Card */}
      <Card
        className={`p-8 border-4 border-black ${
          currentPlan === "pro"
            ? "bg-yellow-400 brutalist-shadow"
            : "bg-white brutalist-shadow"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-16 h-16 flex items-center justify-center ${
              currentPlan === "pro" ? "bg-black" : "bg-black"
            }`}>
              {currentPlan === "pro" ? (
                <RiVipCrownLine className="w-8 h-8 text-yellow-400" />
              ) : (
                <RiShieldCheckLine className="w-8 h-8 text-yellow-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heading
                  variant="h2"
                  className={`uppercase ${
                    currentPlan === "pro" ? "text-black" : "text-black"
                  }`}
                >
                  {currentPlan.toUpperCase()} PLAN
                </Heading>
                {currentPlan === "pro" && (
                  <span className="inline-flex items-center px-3 py-1 bg-black text-yellow-400 text-xs font-bold uppercase">
                    ACTIVE
                  </span>
                )}
              </div>
              <Text
                variant="body-sm"
                className={currentPlan === "pro" ? "text-black" : "text-gray-600"}
              >
                Status:{" "}
                <span className="font-bold uppercase">
                  {subscription?.status || "ACTIVE"}
                </span>
              </Text>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-5xl font-black uppercase ${
                currentPlan === "pro" ? "text-black" : "text-black"
              }`}
            >
              {currentPlan === "starter" ? "$0" : "$29"}
            </div>
            {currentPlan !== "starter" && (
              <Text
                variant="body-sm"
                className={`font-bold ${
                  currentPlan === "pro" ? "text-black" : "text-gray-600"
                }`}
              >
                /MONTH
              </Text>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="mb-8">
          <Heading
            variant="h4"
            className={`uppercase mb-6 ${
              currentPlan === "pro" ? "text-black" : "text-black"
            }`}
          >
            What's Included
          </Heading>
          <div className="grid md:grid-cols-2 gap-4">
            {features?.map((feature, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 border-2 ${
                  feature.included
                    ? currentPlan === "pro"
                      ? "border-black bg-white"
                      : "border-black bg-gray-50"
                    : currentPlan === "pro"
                      ? "border-gray-400 bg-gray-100"
                      : "border-gray-300 bg-gray-100"
                }`}
              >
                <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 ${
                  feature.included
                    ? currentPlan === "pro"
                      ? "bg-black text-white"
                      : "bg-black text-white"
                    : currentPlan === "pro"
                      ? "bg-gray-400 text-gray-600"
                      : "bg-gray-300 text-gray-600"
                }`}>
                  {feature.included ? (
                    <RiCheckLine className="w-4 h-4" />
                  ) : (
                    <RiCloseLine className="w-4 h-4" />
                  )}
                </div>
                <Text
                  variant="body-sm"
                  className={`font-medium ${
                    feature.included
                      ? currentPlan === "pro" ? "text-black" : "text-black"
                      : currentPlan === "pro" ? "text-gray-600" : "text-gray-600"
                  }`}
                >
                  {feature.text}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {currentPlan === "starter" && (
            <Button
              size="lg"
              onClick={handleUpgrade}
              disabled={isLoading}
              className="flex-1 gap-3 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow"
            >
              <RiSparklingLine className="w-5 h-5" />
              {isLoading ? "Processing..." : "Upgrade to Pro"}
              <RiArrowRightLine className="w-5 h-5" />
            </Button>
          )}
          {currentPlan === "pro" &&
            subscription?.status !== "cancelled" &&
            !subscription?.cancelledAt && (
              <Button
                size="lg"
                onClick={handleCancel}
                disabled={isLoading}
                variant="secondary"
                className="flex-1 gap-3 bg-white text-black hover:bg-gray-100 border-4 border-black font-bold uppercase"
              >
                {isLoading ? "Processing..." : "Cancel Subscription"}
              </Button>
            )}
        </div>

        {subscription?.cancelledAt && (
          <div className="mt-6 p-4 bg-yellow-400 border-4 border-black">
            <Text variant="body-sm" className="font-bold text-black">
              Your subscription has been cancelled. You will have access to Pro
              features until{" "}
              {subscription.trialEndsAt
                ? new Date(subscription.trialEndsAt).toLocaleDateString()
                : "the end of your billing period"}
              .
            </Text>
          </div>
        )}
      </Card>

      {/* Other Plans */}
      {currentPlan !== "enterprise" && (
        <Card className="border-4 border-black bg-white brutalist-shadow p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 bg-black flex items-center justify-center">
                <RiVipCrownLine className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <Heading variant="h3" className="uppercase mb-2">
                  NEED MORE POWER?
                </Heading>
                <Text variant="body" className="text-gray-600">
                  Enterprise Plan: Unlimited usage, custom training, dedicated support
                </Text>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => router.push("/contact")}
              className="gap-3 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase"
            >
              Contact Sales
              <RiArrowRightLine className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Usage Stats */}
      <Card className="border-4 border-black bg-white brutalist-shadow p-8">
        <Heading variant="h3" className="uppercase mb-6">
          USAGE LIMITS
        </Heading>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 border-4 border-black bg-gray-50">
            <div className="text-4xl font-black text-black mb-2">
              {subscription?.monthlyCharacterLimit.toLocaleString() || "5,000"}
            </div>
            <Text variant="body-sm" className="text-gray-600 font-bold uppercase">
              Characters/Month
            </Text>
          </div>
          <div className="text-center p-6 border-4 border-black bg-gray-50">
            <div className="text-4xl font-black text-black mb-2">
              {subscription?.monthlyVoiceClones || "0"}
            </div>
            <Text variant="body-sm" className="text-gray-600 font-bold uppercase">
              Voice Clones
            </Text>
          </div>
          <div className="text-center p-6 border-4 border-black bg-gray-50">
            <div className="text-4xl font-black text-black mb-2">
              {subscription?.allowCommercialUse ? "YES" : "NO"}
            </div>
            <Text variant="body-sm" className="text-gray-600 font-bold uppercase">
              Commercial Use
            </Text>
          </div>
        </div>
      </Card>
    </div>
  )
}
