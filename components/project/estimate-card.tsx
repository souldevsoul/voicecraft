"use client"

import { useState } from "react"
import { RiMoneyDollarCircleLine, RiTimeLine, RiCheckLine, RiCloseLine, RiAlertLine } from "react-icons/ri"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Text, Heading } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface EstimateData {
  estimatedCost: number
  estimatedDuration: number
  breakdown?: {
    editing?: number
    mixing?: number
    mastering?: number
    [key: string]: number | undefined
  }
  assumptions?: string[]
}

export interface EstimateCardProps {
  projectId: string
  status: "pending" | "waiting" | "accepted" | "rejected"
  estimate?: EstimateData
  userCredits: number
  onGetEstimate?: (request: string) => Promise<void>
  onAcceptEstimate?: () => Promise<void>
  onRejectEstimate?: (reason?: string) => Promise<void>
  loading?: boolean
}

export function EstimateCard({
  projectId,
  status,
  estimate,
  userCredits,
  onGetEstimate,
  onAcceptEstimate,
  onRejectEstimate,
  loading = false,
}: EstimateCardProps) {
  const [requestText, setRequestText] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)

  // Calculate credits needed (1 credit = $0.01)
  const creditsNeeded = estimate ? Math.ceil(estimate.estimatedCost * 100) : 0
  const hasEnoughCredits = userCredits >= creditsNeeded
  const shortfall = creditsNeeded - userCredits

  const handleGetEstimate = async () => {
    if (!requestText.trim() || requestText.length < 10) {
      alert("Please provide a detailed request (at least 10 characters)")
      return
    }
    if (onGetEstimate) {
      await onGetEstimate(requestText)
      setShowRequestDialog(false)
      setRequestText("")
    }
  }

  const handleRejectEstimate = async () => {
    if (onRejectEstimate) {
      await onRejectEstimate(rejectReason)
      setShowRejectDialog(false)
      setRejectReason("")
    }
  }

  // Pending: Show "Get Estimate" button
  if (status === "pending") {
    return (
      <>
        <Card variant="outlined" className="border-4 border-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiMoneyDollarCircleLine className="h-6 w-6 text-yellow-400" />
              AI ESTIMATION
            </CardTitle>
            <CardDescription>
              Get an instant cost and time estimate for your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border-2 border-dashed border-black bg-slate-50 p-6 text-center">
              <Text variant="body" className="text-slate-600">
                Provide your project requirements to get an AI-powered estimate
              </Text>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setShowRequestDialog(true)}
              disabled={loading}
            >
              <RiMoneyDollarCircleLine className="mr-2 h-4 w-4" />
              GET ESTIMATE
            </Button>
          </CardFooter>
        </Card>

        {/* Request Dialog */}
        <AlertDialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <AlertDialogContent className="border-4 border-black sm:max-w-[600px]">
            <AlertDialogHeader>
              <AlertDialogTitle>DESCRIBE YOUR PROJECT</AlertDialogTitle>
              <AlertDialogDescription>
                Provide detailed requirements for accurate estimation (minimum 10 characters)
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Please edit all podcast episodes, apply noise reduction, normalize volume, and master for streaming platforms..."
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                rows={6}
                className="border-2 border-black font-mono text-sm"
              />
              <Text variant="caption" className="mt-2 text-xs text-slate-500">
                {requestText.length} / 5000 characters
              </Text>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-2 border-black">
                CANCEL
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleGetEstimate}
                disabled={requestText.length < 10 || requestText.length > 5000 || loading}
                className="bg-yellow-400 text-black border-4 border-black hover:bg-yellow-500"
              >
                {loading ? "ESTIMATING..." : "GET ESTIMATE"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  // Waiting: Show estimate with Accept/Reject
  if (status === "waiting" && estimate) {
    return (
      <>
        <Card variant="gradient" className="border-4 border-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiMoneyDollarCircleLine className="h-6 w-6" />
              ESTIMATE READY
            </CardTitle>
            <CardDescription className="text-black/80">
              Review the AI-generated estimate for your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cost & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md border-4 border-black bg-white p-4">
                <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                  ESTIMATED COST
                </Text>
                <div className="mt-2 flex items-baseline gap-2">
                  <Heading variant="h2" className="text-3xl font-bold">
                    ${estimate.estimatedCost.toFixed(2)}
                  </Heading>
                  <Text variant="caption" className="text-xs text-slate-500">
                    {creditsNeeded.toLocaleString()} credits
                  </Text>
                </div>
              </div>
              <div className="rounded-md border-4 border-black bg-white p-4">
                <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                  ESTIMATED DURATION
                </Text>
                <div className="mt-2 flex items-baseline gap-2">
                  <Heading variant="h2" className="text-3xl font-bold">
                    {estimate.estimatedDuration}
                  </Heading>
                  <Text variant="caption" className="text-xs text-slate-500">
                    hours
                  </Text>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            {estimate.breakdown && Object.keys(estimate.breakdown).length > 0 && (
              <>
                <Separator className="bg-black" />
                <div>
                  <Heading variant="h3" className="mb-3 text-sm font-bold uppercase">
                    COST BREAKDOWN
                  </Heading>
                  <div className="space-y-2 rounded-md border-4 border-black bg-white p-4">
                    {Object.entries(estimate.breakdown).map(([key, value]) => (
                      value !== undefined && (
                        <div key={key} className="flex items-center justify-between">
                          <Text variant="body" className="capitalize">
                            {key}
                          </Text>
                          <Text variant="body" className="font-bold">
                            {value} hours
                          </Text>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Assumptions */}
            {estimate.assumptions && estimate.assumptions.length > 0 && (
              <>
                <Separator className="bg-black" />
                <div>
                  <Heading variant="h3" className="mb-3 text-sm font-bold uppercase">
                    ASSUMPTIONS
                  </Heading>
                  <ul className="space-y-2 rounded-md border-4 border-black bg-white p-4">
                    {estimate.assumptions.map((assumption, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <RiCheckLine className="h-4 w-4 flex-shrink-0 text-green-600" />
                        <Text variant="body" className="text-sm">
                          {assumption}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Credit Balance Warning */}
            {!hasEnoughCredits && (
              <>
                <Separator className="bg-black" />
                <div className="rounded-md border-4 border-red-500 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <RiAlertLine className="h-5 w-5 flex-shrink-0 text-red-600" />
                    <div className="flex-1">
                      <Heading variant="h3" className="text-sm font-bold text-red-900">
                        INSUFFICIENT CREDITS
                      </Heading>
                      <Text variant="body" className="mt-1 text-sm text-red-800">
                        You need {creditsNeeded.toLocaleString()} credits but only have{" "}
                        {userCredits.toLocaleString()} credits.
                        <br />
                        Shortfall: {shortfall.toLocaleString()} credits (${(shortfall / 100).toFixed(2)})
                      </Text>
                      <Button variant="primary" size="sm" className="mt-3">
                        ADD CREDITS
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-4"
              onClick={() => setShowRejectDialog(true)}
              disabled={loading}
            >
              <RiCloseLine className="mr-2 h-4 w-4" />
              REJECT
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={onAcceptEstimate}
              disabled={!hasEnoughCredits || loading}
            >
              <RiCheckLine className="mr-2 h-4 w-4" />
              {loading ? "ACCEPTING..." : "ACCEPT & RESERVE CREDITS"}
            </Button>
          </CardFooter>
        </Card>

        {/* Reject Dialog */}
        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent className="border-4 border-black">
            <AlertDialogHeader>
              <AlertDialogTitle>REJECT ESTIMATE</AlertDialogTitle>
              <AlertDialogDescription>
                This will return the project to draft status. You can provide a reason (optional).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Optional: Explain why you're rejecting this estimate..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="border-2 border-black"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-2 border-black">
                CANCEL
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRejectEstimate}
                className="bg-red-400 text-black border-4 border-black hover:bg-red-500"
              >
                REJECT ESTIMATE
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  // Accepted: Show confirmed estimate
  if (status === "accepted" && estimate) {
    return (
      <Card variant="outlined" className="border-4 border-green-500 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <RiCheckLine className="h-6 w-6 text-green-600" />
            ESTIMATE ACCEPTED
          </CardTitle>
          <CardDescription className="text-green-800">
            Credits reserved • Waiting for expert assignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text variant="caption" className="text-xs font-bold uppercase text-green-700">
                COST
              </Text>
              <Heading variant="h3" className="font-bold text-green-900">
                ${estimate.estimatedCost.toFixed(2)}
              </Heading>
            </div>
            <div>
              <Text variant="caption" className="text-xs font-bold uppercase text-green-700">
                DURATION
              </Text>
              <Heading variant="h3" className="font-bold text-green-900">
                {estimate.estimatedDuration}h
              </Heading>
            </div>
          </div>
          <div className="rounded-md border-2 border-green-600 bg-white p-3">
            <Text variant="caption" className="text-xs font-bold uppercase text-green-700">
              CREDITS RESERVED
            </Text>
            <Text variant="body" className="mt-1 font-bold text-green-900">
              {creditsNeeded.toLocaleString()} credits
            </Text>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
