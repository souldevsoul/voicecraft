"use client"

import { useState } from "react"
import { RiCoinLine } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Text, Heading } from "@/components/ui/typography"
import { BuyCreditsDialog } from "./buy-credits-dialog"

type DashboardCreditsCardProps = {
  creditsRemaining: number
}

export function DashboardCreditsCard({ creditsRemaining }: DashboardCreditsCardProps) {
  const [showBuyDialog, setShowBuyDialog] = useState(false)

  return (
    <>
      <Card variant="outlined" className="col-span-3 p-6">
        <div className="flex items-center justify-between">
          <Heading variant="h3" className="uppercase">
            Credits
          </Heading>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowBuyDialog(true)}
          >
            Buy More
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex h-32 w-32 items-center justify-center border-4 border-black bg-yellow-400">
              <div className="text-center">
                <Heading as="h2" className="text-4xl font-bold">
                  {creditsRemaining}
                </Heading>
                <Text variant="caption" className="text-xs uppercase">
                  Remaining
                </Text>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t-2 border-black pt-4">
            <div className="flex items-center justify-between text-sm">
              <Text variant="caption" className="text-slate-600">
                Voice Generation
              </Text>
              <Text variant="body" className="font-medium">
                10 credits
              </Text>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Text variant="caption" className="text-slate-600">
                Voice Cloning
              </Text>
              <Text variant="body" className="font-medium">
                50 credits
              </Text>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Text variant="caption" className="text-slate-600">
                AI Estimation
              </Text>
              <Text variant="body" className="font-medium">
                5 credits
              </Text>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowBuyDialog(true)}
          >
            View Pricing
          </Button>
        </div>
      </Card>

      <BuyCreditsDialog
        open={showBuyDialog}
        onOpenChange={setShowBuyDialog}
        currentBalance={creditsRemaining}
      />
    </>
  )
}
