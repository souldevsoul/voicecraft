"use client"

import { useState } from "react"
import { RiStarLine, RiStarFill, RiCheckLine, RiErrorWarningLine } from "react-icons/ri"
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
import { AudioPlayer } from "@/components/voicecraft/audio-player"

export interface SubmittedWork {
  audioIds: string[]
  audios?: {
    id: string
    filename: string
    audioUrl: string
    duration?: number
  }[]
  notes?: string
  submittedAt: string
}

export interface WorkReviewCardProps {
  projectId: string
  submittedWork: SubmittedWork
  expertName: string
  expertRating?: number
  onApprove: (rating: number, feedback?: string) => Promise<void>
  onRequestChanges: (feedback: string) => Promise<void>
  loading?: boolean
}

export function WorkReviewCard({
  projectId,
  submittedWork,
  expertName,
  expertRating,
  onApprove,
  onRequestChanges,
  loading = false,
}: WorkReviewCardProps) {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [changeRequest, setChangeRequest] = useState("")
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showChangesDialog, setShowChangesDialog] = useState(false)

  const handleApprove = async () => {
    if (rating < 1 || rating > 5) {
      alert("Please select a rating from 1 to 5")
      return
    }
    await onApprove(rating, feedback || undefined)
    setShowApproveDialog(false)
  }

  const handleRequestChanges = async () => {
    if (!changeRequest.trim() || changeRequest.length < 10) {
      alert("Please provide detailed feedback (at least 10 characters)")
      return
    }
    await onRequestChanges(changeRequest)
    setShowChangesDialog(false)
    setChangeRequest("")
  }

  return (
    <>
      <Card variant="outlined" className="border-4 border-cyan-500 bg-cyan-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-cyan-900">
                <RiCheckLine className="h-6 w-6 text-cyan-600" />
                WORK SUBMITTED FOR REVIEW
              </CardTitle>
              <CardDescription className="text-cyan-800">
                {expertName} submitted completed work on{" "}
                {new Date(submittedWork.submittedAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant="primary" className="text-xs">
              ACTION REQUIRED
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Expert Notes */}
          {submittedWork.notes && (
            <div className="rounded-md border-4 border-black bg-white p-4">
              <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                NOTES FROM {expertName.toUpperCase()}
              </Text>
              <Text variant="body" className="mt-2 whitespace-pre-wrap">
                {submittedWork.notes}
              </Text>
            </div>
          )}

          {/* Submitted Audios */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Heading variant="h3" className="text-sm font-bold uppercase">
                SUBMITTED AUDIOS ({submittedWork.audios?.length || submittedWork.audioIds.length})
              </Heading>
            </div>
            <div className="space-y-3 rounded-md border-4 border-black bg-white p-4">
              {submittedWork.audios && submittedWork.audios.length > 0 ? (
                submittedWork.audios.map((audio, index) => (
                  <div key={audio.id} className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                    <div className="mb-2 flex items-center justify-between">
                      <Text variant="body" className="font-bold">
                        {index + 1}. {audio.filename}
                      </Text>
                      {audio.duration && (
                        <Badge variant="outline" className="text-xs">
                          {audio.duration}s
                        </Badge>
                      )}
                    </div>
                    <AudioPlayer audioUrl={audio.audioUrl} />
                  </div>
                ))
              ) : (
                <div className="rounded-md border-2 border-dashed border-black bg-slate-50 p-6 text-center">
                  <Text variant="caption" className="text-xs text-slate-400">
                    Audio details loading...
                  </Text>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-black" />

          {/* Instructions */}
          <div className="rounded-md border-4 border-yellow-500 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <RiErrorWarningLine className="h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div className="flex-1">
                <Heading variant="h3" className="text-sm font-bold text-yellow-900">
                  REVIEW THE WORK
                </Heading>
                <Text variant="body" className="mt-1 text-sm text-yellow-800">
                  Listen to all submitted audios. If satisfied, approve the work and rate the expert. If
                  changes are needed, provide detailed feedback for revision.
                </Text>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-4"
            onClick={() => setShowChangesDialog(true)}
            disabled={loading}
          >
            <RiErrorWarningLine className="mr-2 h-4 w-4" />
            REQUEST CHANGES
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => setShowApproveDialog(true)}
            disabled={loading}
          >
            <RiCheckLine className="mr-2 h-4 w-4" />
            APPROVE WORK
          </Button>
        </CardFooter>
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent className="border-4 border-black sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle>APPROVE & RATE WORK</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the project as completed and pay the expert. Rate the quality of work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-6 py-4">
            {/* Rating */}
            <div>
              <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                RATE THIS WORK (REQUIRED)
              </Text>
              <div className="mt-3 flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoveredRating || rating)
                  return (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      {isFilled ? (
                        <RiStarFill className="h-10 w-10 text-yellow-400" />
                      ) : (
                        <RiStarLine className="h-10 w-10 text-slate-300" />
                      )}
                    </button>
                  )
                })}
              </div>
              <Text variant="caption" className="mt-2 text-center text-sm text-slate-500">
                {rating === 5 && "Excellent work!"}
                {rating === 4 && "Great work!"}
                {rating === 3 && "Good work"}
                {rating === 2 && "Needs improvement"}
                {rating === 1 && "Poor quality"}
              </Text>
            </div>

            <Separator className="bg-black" />

            {/* Feedback */}
            <div>
              <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                FEEDBACK (OPTIONAL)
              </Text>
              <Textarea
                placeholder="Optional: Share your thoughts about the work..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="mt-2 border-2 border-black"
              />
            </div>

            {/* Expert Info */}
            <div className="rounded-md border-2 border-black bg-slate-50 p-4">
              <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                EXPERT
              </Text>
              <div className="mt-2 flex items-center justify-between">
                <Text variant="body" className="font-bold">
                  {expertName}
                </Text>
                {expertRating && (
                  <div className="flex items-center gap-1">
                    <RiStarFill className="h-4 w-4 text-yellow-400" />
                    <Text variant="caption" className="text-sm font-bold">
                      {expertRating.toFixed(1)}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-black">CANCEL</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={loading}
              className="bg-green-400 text-black border-4 border-black hover:bg-green-500"
            >
              {loading ? "APPROVING..." : "APPROVE & COMPLETE"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Request Changes Dialog */}
      <AlertDialog open={showChangesDialog} onOpenChange={setShowChangesDialog}>
        <AlertDialogContent className="border-4 border-black sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle>REQUEST CHANGES</AlertDialogTitle>
            <AlertDialogDescription>
              This will return the project to the expert for revisions. Provide detailed feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
              WHAT NEEDS TO BE CHANGED? (REQUIRED)
            </Text>
            <Textarea
              placeholder="Please provide detailed feedback about what needs to be changed or improved..."
              value={changeRequest}
              onChange={(e) => setChangeRequest(e.target.value)}
              rows={6}
              className="mt-2 border-2 border-black font-mono text-sm"
            />
            <Text variant="caption" className="mt-2 text-xs text-slate-500">
              {changeRequest.length} characters (minimum 10)
            </Text>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-black">CANCEL</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRequestChanges}
              disabled={changeRequest.length < 10 || loading}
              className="bg-orange-400 text-black border-4 border-black hover:bg-orange-500"
            >
              {loading ? "SENDING..." : "SEND FEEDBACK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
