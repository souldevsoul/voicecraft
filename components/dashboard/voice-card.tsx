"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiVoiceprintLine, RiDeleteBinLine, RiPlayLine } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Text, Heading } from "@/components/ui/typography"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { MoreHorizontal } from "lucide-react"
import { ClientDate } from "@/components/ui/client-date"

type Voice = {
  id: string
  name: string
  description: string | null
  language: string
  gender: "male" | "female" | "neutral"
  previewUrl: string | null
  isCloned: boolean
  createdAt: string
}

type VoiceCardProps = {
  voice: Voice
}

export function VoiceCard({ voice }: VoiceCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const handlePlayPreview = () => {
    if (!voice.previewUrl) return

    // Stop any currently playing audio
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
    }

    // Create and play new audio
    const audio = new Audio(voice.previewUrl)
    setAudioElement(audio)

    audio.play().catch((error) => {
      console.error('Error playing audio:', error)
      setError('Failed to play audio preview')
      setTimeout(() => setError(null), 3000)
    })

    audio.onended = () => {
      setAudioElement(null)
    }
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(voice.id)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      setError('Failed to copy voice ID')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      const response = await fetch(`/api/voices/${voice.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete voice')
      }

      // Refresh the page to show updated list
      router.refresh()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Delete error:', error)
      setError(error instanceof Error ? error.message : "Failed to delete voice")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card key={voice.id} variant="outlined" className="p-6">
      {/* Status Messages */}
      {error && (
        <div className="mb-4 rounded-md border-2 border-red-500 bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      {copySuccess && (
        <div className="mb-4 rounded-md border-2 border-green-500 bg-green-50 p-3">
          <p className="text-sm text-green-800">Voice ID copied to clipboard!</p>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-yellow-400">
            <RiVoiceprintLine className="h-6 w-6" />
          </div>
          <div>
            <Heading variant="h4" className="uppercase">
              {voice.name}
            </Heading>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="text-xs">
                {voice.language}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {voice.gender}
              </Badge>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-yellow-100">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleCopyId}>
              Copy voice ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {voice.previewUrl && (
              <DropdownMenuItem onClick={handlePlayPreview}>
                <RiPlayLine className="mr-2 h-4 w-4" />
                Play Preview
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setShowDeleteDialog(true)}
            >
              <RiDeleteBinLine className="mr-2 h-4 w-4" />
              Delete Voice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {voice.description && (
        <Text variant="body" className="mt-4 text-sm text-slate-600">
          {voice.description}
        </Text>
      )}

      <div className="mt-4 flex items-center justify-between">
        <Text variant="caption" className="text-xs text-slate-500">
          Created <ClientDate date={voice.createdAt} />
        </Text>
        {voice.isCloned && (
          <Badge variant="primary" className="text-xs">
            Cloned
          </Badge>
        )}
      </div>

      {voice.previewUrl && (
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={handlePlayPreview}
        >
          <RiPlayLine className="mr-2 h-4 w-4" />
          Play Preview
        </Button>
      )}
    </Card>

    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Voice</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{voice.name}"? This action cannot be undone.
            This will permanently delete the voice clone and its audio sample.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="rounded-md border-2 border-red-500 bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
