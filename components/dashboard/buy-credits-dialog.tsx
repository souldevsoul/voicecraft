"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiCoinLine, RiCheckLine, RiLoader4Line } from "react-icons/ri"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Text, Heading } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"

type BuyCreditsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBalance: number
}

type CreditPackage = {
  id: string
  name: string
  credits: number
  price: number
  bonus?: number
  popular?: boolean
}

const creditPackages: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 9.99,
  },
  {
    id: "popular",
    name: "Popular",
    credits: 500,
    price: 39.99,
    bonus: 50,
    popular: true,
  },
  {
    id: "pro",
    name: "Professional",
    credits: 1000,
    price: 69.99,
    bonus: 150,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 5000,
    price: 299.99,
    bonus: 1000,
  },
]

export function BuyCreditsDialog({ open, onOpenChange, currentBalance }: BuyCreditsDialogProps) {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async (pkg: CreditPackage) => {
    setLoading(true)
    setError(null)
    setSelectedPackage(pkg.id)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/credits/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          credits: pkg.credits + (pkg.bonus || 0),
          price: pkg.price,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }

    } catch (err) {
      console.error('Purchase error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process purchase')
      setLoading(false)
      setSelectedPackage(null)
    }
  }

  const totalCredits = (pkg: CreditPackage) => pkg.credits + (pkg.bonus || 0)
  const pricePerCredit = (pkg: CreditPackage) => (pkg.price / totalCredits(pkg)).toFixed(3)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <RiCoinLine className="h-6 w-6 text-yellow-600" />
            Buy Credits
          </DialogTitle>
          <DialogDescription>
            Choose a credit package that fits your needs. Credits never expire.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Balance */}
          <div className="rounded-lg border-2 border-black bg-yellow-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="caption" className="text-sm font-semibold uppercase text-slate-700">
                  Current Balance
                </Text>
                <Heading as="h3" className="text-3xl font-bold">
                  {currentBalance} Credits
                </Heading>
              </div>
              <RiCoinLine className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md border-2 border-red-500 bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Credit Packages */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.id}
                variant="outlined"
                className={`relative p-6 transition-all hover:shadow-lg cursor-pointer overflow-visible ${
                  pkg.popular ? 'border-yellow-400 border-4' : ''
                }`}
              >
                {pkg.popular && (
                  <Badge
                    variant="primary"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-bold whitespace-nowrap z-10"
                  >
                    Most Popular
                  </Badge>
                )}

                <div className="space-y-4">
                  {/* Package Name */}
                  <div className="text-center">
                    <Heading variant="h4" className="uppercase">
                      {pkg.name}
                    </Heading>
                    <Text variant="caption" className="text-xs text-slate-600">
                      ${pricePerCredit(pkg)} per credit
                    </Text>
                  </div>

                  {/* Credits Amount */}
                  <div className="text-center py-4 border-y-2 border-black">
                    <div className="flex items-center justify-center gap-2">
                      <RiCoinLine className="h-8 w-8 text-yellow-600" />
                      <Heading as="h2" className="text-4xl font-bold">
                        {pkg.credits}
                      </Heading>
                    </div>
                    {pkg.bonus && (
                      <Badge variant="success" className="mt-2">
                        +{pkg.bonus} Bonus
                      </Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-center">
                    <Heading as="h3" className="text-3xl font-bold">
                      ${pkg.price}
                    </Heading>
                    <Text variant="caption" className="text-xs text-slate-600">
                      One-time payment
                    </Text>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <RiCheckLine className="h-4 w-4 text-green-600" />
                      <Text variant="caption" className="text-xs">
                        {Math.floor(totalCredits(pkg) / 10)} Voice Generations
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiCheckLine className="h-4 w-4 text-green-600" />
                      <Text variant="caption" className="text-xs">
                        {Math.floor(totalCredits(pkg) / 50)} Voice Clonings
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiCheckLine className="h-4 w-4 text-green-600" />
                      <Text variant="caption" className="text-xs">
                        Never expires
                      </Text>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button
                    onClick={() => handlePurchase(pkg)}
                    disabled={loading}
                    variant={pkg.popular ? "primary" : "outline"}
                    className="w-full"
                  >
                    {loading && selectedPackage === pkg.id ? (
                      <>
                        <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Buy Now'
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Credit Usage</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>Voice Generation:</strong> 10 credits per audio</li>
              <li>• <strong>Voice Cloning:</strong> 50 credits per voice</li>
              <li>• <strong>AI Estimation:</strong> 5 credits per project</li>
              <li>• Credits never expire and can be used anytime</li>
              <li>• Secure payment processing via Stripe</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
