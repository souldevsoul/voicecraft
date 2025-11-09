"use client"

import { useState } from "react"
import { RiRefreshLine, RiErrorWarningLine } from "react-icons/ri"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/typography"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export interface ReEstimateDialogProps {
  projectId: string
  projectName: string
  clientName: string
  currentEstimate?: {
    cost: number
    duration: number
  }
  onReEstimate: (reason: string) => Promise<void>
  loading?: boolean
  trigger?: React.ReactNode
}

export function ReEstimateDialog({
  projectId,
  projectName,
  clientName,
  currentEstimate,
  onReEstimate,
  loading = false,
  trigger,
}: ReEstimateDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")

  const handleReEstimate = async () => {
    if (!reason.trim() || reason.length < 20) {
      alert("Please provide a detailed reason for re-estimation (at least 20 characters)")
      return
    }

    await onReEstimate(reason)
    setOpen(false)
    setReason("")
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
            <RiRefreshLine className="mr-2 h-4 w-4" />
            RE-ESTIMATE
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="border-4 border-blue-500 sm:max-w-[600px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-md border-4 border-blue-500 bg-blue-100 p-2">
              <RiRefreshLine className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-blue-900">RE-ESTIMATE PROJECT</AlertDialogTitle>
              <AlertDialogDescription className="text-blue-800">
                Generate a new AI estimate for this project
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          {/* Info */}
          <div className="rounded-md border-4 border-yellow-500 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <RiErrorWarningLine className="h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div>
                <Text variant="body" className="font-bold text-yellow-900">
                  This will generate a new estimate
                </Text>
                <Text variant="caption" className="mt-1 text-xs text-yellow-800">
                  The project will return to "waiting_for_estimate_accept" status. If credits were reserved,
                  they will be refunded first, and the client will need to accept the new estimate.
                </Text>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-3">
            <div className="rounded-md border-2 border-black bg-slate-50 p-4">
              <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                PROJECT
              </Text>
              <Text variant="body" className="mt-1 font-bold">
                {projectName}
              </Text>
            </div>

            <div className="rounded-md border-2 border-black bg-slate-50 p-4">
              <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                CLIENT
              </Text>
              <Text variant="body" className="mt-1 font-bold">
                {clientName}
              </Text>
            </div>

            {currentEstimate && (
              <div className="rounded-md border-2 border-black bg-slate-50 p-4">
                <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                  CURRENT ESTIMATE
                </Text>
                <div className="mt-2 flex items-center gap-4">
                  <div>
                    <Text variant="body" className="text-lg font-bold">
                      ${currentEstimate.cost.toFixed(2)}
                    </Text>
                    <Text variant="caption" className="text-xs text-slate-600">
                      Cost
                    </Text>
                  </div>
                  <Badge variant="outline">•</Badge>
                  <div>
                    <Text variant="body" className="text-lg font-bold">
                      {currentEstimate.duration}h
                    </Text>
                    <Text variant="caption" className="text-xs text-slate-600">
                      Duration
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-black" />

          {/* Reason */}
          <div>
            <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
              REASON FOR RE-ESTIMATION (REQUIRED)
            </Text>
            <Textarea
              placeholder="Explain why this project needs to be re-estimated. For example: scope changed, initial estimate was incorrect, client requested modifications, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={6}
              className="mt-2 border-2 border-black font-mono text-sm"
            />
            <div className="mt-2 flex items-center justify-between">
              <Text variant="caption" className="text-xs text-slate-500">
                {reason.length} characters (minimum 20)
              </Text>
              {reason.length >= 20 && (
                <Badge variant="success" className="text-xs">
                  VALID
                </Badge>
              )}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-2 border-black">CANCEL</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReEstimate}
            disabled={reason.length < 20 || loading}
            className="bg-blue-500 text-white border-4 border-black hover:bg-blue-600"
          >
            {loading ? "GENERATING NEW ESTIMATE..." : "CONFIRM RE-ESTIMATE"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
