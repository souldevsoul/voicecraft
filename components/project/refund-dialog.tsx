"use client"

import { useState } from "react"
import { RiRefund2Line, RiErrorWarningLine } from "react-icons/ri"
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

export interface RefundDialogProps {
  projectId: string
  projectName: string
  clientName: string
  reservedCredits: number // Amount to refund
  onRefund: (reason: string) => Promise<void>
  loading?: boolean
  trigger?: React.ReactNode
}

export function RefundDialog({
  projectId,
  projectName,
  clientName,
  reservedCredits,
  onRefund,
  loading = false,
  trigger,
}: RefundDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")

  const handleRefund = async () => {
    if (!reason.trim() || reason.length < 20) {
      alert("Please provide a detailed reason for the refund (at least 20 characters)")
      return
    }

    await onRefund(reason)
    setOpen(false)
    setReason("")
  }

  const refundAmount = reservedCredits / 100 // Convert to dollars

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="border-2 border-red-500 text-red-600 hover:bg-red-50">
            <RiRefund2Line className="mr-2 h-4 w-4" />
            REFUND PROJECT
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="border-4 border-red-500 sm:max-w-[600px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-md border-4 border-red-500 bg-red-100 p-2">
              <RiRefund2Line className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-red-900">REFUND PROJECT</AlertDialogTitle>
              <AlertDialogDescription className="text-red-800">
                This action will cancel the project and refund credits to the client
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning */}
          <div className="rounded-md border-4 border-yellow-500 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <RiErrorWarningLine className="h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div>
                <Text variant="body" className="font-bold text-yellow-900">
                  WARNING: This action cannot be undone
                </Text>
                <Text variant="caption" className="mt-1 text-xs text-yellow-800">
                  The project will be marked as refunded and credits will be returned to the client immediately.
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

            <div className="rounded-md border-2 border-black bg-green-50 p-4">
              <Text variant="caption" className="text-xs font-bold uppercase text-green-900">
                REFUND AMOUNT
              </Text>
              <div className="mt-2 flex items-baseline gap-2">
                <Text variant="body" className="text-2xl font-bold text-green-900">
                  ${refundAmount.toFixed(2)}
                </Text>
                <Badge variant="success" className="text-xs">
                  {reservedCredits.toLocaleString()} CREDITS
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="bg-black" />

          {/* Reason */}
          <div>
            <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
              REASON FOR REFUND (REQUIRED)
            </Text>
            <Textarea
              placeholder="Provide a detailed explanation for why this project is being refunded. This will be recorded in the system logs and shown to the client."
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
            onClick={handleRefund}
            disabled={reason.length < 20 || loading}
            className="bg-red-500 text-white border-4 border-black hover:bg-red-600"
          >
            {loading ? "PROCESSING REFUND..." : "CONFIRM REFUND"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
