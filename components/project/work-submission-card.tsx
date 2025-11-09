"use client"

import { useState } from "react"
import { RiUploadLine, RiCheckLine, RiDeleteBinLine, RiFileAddLine } from "react-icons/ri"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Text, Heading } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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

export interface ProjectAudio {
  id: string
  filename: string
  audioUrl: string
  duration?: number
}

export interface WorkSubmissionCardProps {
  projectId: string
  projectName: string
  projectDescription?: string
  existingAudios: ProjectAudio[]
  onSubmit: (audioIds: string[], notes?: string) => Promise<void>
  loading?: boolean
}

export function WorkSubmissionCard({
  projectId,
  projectName,
  projectDescription,
  existingAudios,
  onSubmit,
  loading = false,
}: WorkSubmissionCardProps) {
  const [uploadedAudios, setUploadedAudios] = useState<ProjectAudio[]>([])
  const [selectedAudioIds, setSelectedAudioIds] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Combine existing and newly uploaded audios
  const allAudios = [...existingAudios, ...uploadedAudios]

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm"]
        if (!allowedTypes.includes(file.type)) {
          alert(`Invalid file type for ${file.name}. Please upload audio files only.`)
          continue
        }

        // Validate file size (max 50MB)
        const MAX_FILE_SIZE = 50 * 1024 * 1024
        if (file.size > MAX_FILE_SIZE) {
          alert(`File ${file.name} is too large. Maximum size is 50MB.`)
          continue
        }

        // Create FormData for upload
        const formData = new FormData()
        formData.append("file", file)
        formData.append("metadata", JSON.stringify({
          filename: file.name,
          description: `Submitted for project: ${projectName}`,
        }))

        // Upload to server
        const response = await fetch("/api/audios/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          alert(`Failed to upload ${file.name}: ${error.error}`)
          continue
        }

        const data = await response.json()

        // Add to uploaded audios list
        const newAudio: ProjectAudio = {
          id: data.audio.id,
          filename: data.audio.filename,
          audioUrl: data.audio.audioUrl,
          duration: data.audio.duration,
        }

        setUploadedAudios(prev => [...prev, newAudio])

        // Auto-select newly uploaded audio
        setSelectedAudioIds(prev => [...prev, data.audio.id])
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload audio files")
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ""
    }
  }

  const handleToggleAudio = (audioId: string) => {
    setSelectedAudioIds(prev =>
      prev.includes(audioId)
        ? prev.filter(id => id !== audioId)
        : [...prev, audioId]
    )
  }

  const handleRemoveUploadedAudio = (audioId: string) => {
    setUploadedAudios(prev => prev.filter(audio => audio.id !== audioId))
    setSelectedAudioIds(prev => prev.filter(id => id !== audioId))
  }

  const handleSubmit = async () => {
    if (selectedAudioIds.length === 0) {
      alert("Please select at least one audio file to submit")
      return
    }

    await onSubmit(selectedAudioIds, notes || undefined)
    setShowConfirmDialog(false)
  }

  const canSubmit = selectedAudioIds.length > 0 && !loading && !uploading

  return (
    <>
      <Card variant="outlined" className="border-4 border-blue-500 bg-blue-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <RiFileAddLine className="h-6 w-6 text-blue-600" />
                SUBMIT COMPLETED WORK
              </CardTitle>
              <CardDescription className="text-blue-800">
                Upload completed audio files and submit for client review
              </CardDescription>
            </div>
            <Badge variant="primary" className="text-xs">
              IN PROGRESS
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Info */}
          <div className="rounded-md border-4 border-black bg-white p-4">
            <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
              PROJECT DETAILS
            </Text>
            <Heading variant="h3" className="mt-2 font-bold uppercase">
              {projectName}
            </Heading>
            {projectDescription && (
              <Text variant="body" className="mt-1 text-sm text-slate-600">
                {projectDescription}
              </Text>
            )}
          </div>

          <Separator className="bg-black" />

          {/* Upload Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Heading variant="h3" className="text-sm font-bold uppercase">
                UPLOAD COMPLETED FILES
              </Heading>
              <input
                type="file"
                id={`file-upload-${projectId}`}
                multiple
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor={`file-upload-${projectId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploading || loading}
                  className="cursor-pointer border-2"
                  asChild
                >
                  <span>
                    <RiUploadLine className="mr-2 h-4 w-4" />
                    {uploading ? "UPLOADING..." : "UPLOAD FILES"}
                  </span>
                </Button>
              </label>
            </div>

            <div className="rounded-md border-2 border-dashed border-black bg-slate-50 p-4 text-center">
              <RiUploadLine className="mx-auto h-8 w-8 text-slate-400" />
              <Text variant="body" className="mt-2 text-sm text-slate-600">
                Click "Upload Files" to select audio files
              </Text>
              <Text variant="caption" className="mt-1 text-xs text-slate-400">
                Max 50MB per file • MP3, WAV, OGG, WEBM
              </Text>
            </div>
          </div>

          {/* Audio Selection */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Heading variant="h3" className="text-sm font-bold uppercase">
                SELECT FILES TO SUBMIT ({selectedAudioIds.length})
              </Heading>
              {allAudios.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (selectedAudioIds.length === allAudios.length) {
                      setSelectedAudioIds([])
                    } else {
                      setSelectedAudioIds(allAudios.map(a => a.id))
                    }
                  }}
                  className="text-xs"
                >
                  {selectedAudioIds.length === allAudios.length ? "DESELECT ALL" : "SELECT ALL"}
                </Button>
              )}
            </div>

            <div className="space-y-3 rounded-md border-4 border-black bg-white p-4">
              {allAudios.length > 0 ? (
                allAudios.map((audio, index) => {
                  const isSelected = selectedAudioIds.includes(audio.id)
                  const isNewlyUploaded = uploadedAudios.some(a => a.id === audio.id)

                  return (
                    <div
                      key={audio.id}
                      className={`border-b border-slate-200 pb-3 last:border-0 last:pb-0 ${
                        isSelected ? "bg-blue-50" : ""
                      } rounded-md p-3 transition-colors`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleAudio(audio.id)}
                            className="border-2 border-black"
                          />
                          <Text variant="body" className="font-bold text-sm">
                            {index + 1}. {audio.filename}
                          </Text>
                          {isNewlyUploaded && (
                            <Badge variant="success" className="text-xs">
                              NEW
                            </Badge>
                          )}
                        </div>
                        {isNewlyUploaded && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUploadedAudio(audio.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <RiDeleteBinLine className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <AudioPlayer audioUrl={audio.audioUrl} />
                    </div>
                  )
                })
              ) : (
                <div className="rounded-md border-2 border-dashed border-black bg-slate-50 p-6 text-center">
                  <Text variant="caption" className="text-xs text-slate-400">
                    No audio files yet. Upload files to get started.
                  </Text>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-black" />

          {/* Submission Notes */}
          <div>
            <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
              SUBMISSION NOTES (OPTIONAL)
            </Text>
            <Textarea
              placeholder="Add notes about the work you've completed, techniques used, or anything the client should know..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="mt-2 border-2 border-black font-mono text-sm"
            />
            <Text variant="caption" className="mt-2 text-xs text-slate-500">
              {notes.length} characters
            </Text>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setShowConfirmDialog(true)}
            disabled={!canSubmit}
          >
            <RiCheckLine className="mr-2 h-4 w-4" />
            SUBMIT FOR REVIEW ({selectedAudioIds.length} {selectedAudioIds.length === 1 ? "FILE" : "FILES"})
          </Button>
        </CardFooter>
      </Card>

      {/* Confirm Submission Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="border-4 border-black sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle>SUBMIT WORK FOR REVIEW?</AlertDialogTitle>
            <AlertDialogDescription>
              This will send {selectedAudioIds.length} audio {selectedAudioIds.length === 1 ? "file" : "files"} to the client for review.
              The client will be able to approve or request changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            {/* Selected Files Summary */}
            <div className="rounded-md border-2 border-black bg-slate-50 p-4">
              <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                FILES TO SUBMIT
              </Text>
              <div className="mt-2 space-y-1">
                {allAudios
                  .filter(audio => selectedAudioIds.includes(audio.id))
                  .map((audio, index) => (
                    <div key={audio.id} className="flex items-center gap-2">
                      <RiCheckLine className="h-4 w-4 text-green-600" />
                      <Text variant="body" className="text-sm">
                        {index + 1}. {audio.filename}
                      </Text>
                    </div>
                  ))}
              </div>
            </div>

            {/* Notes Preview */}
            {notes && (
              <div className="rounded-md border-2 border-black bg-slate-50 p-4">
                <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                  YOUR NOTES
                </Text>
                <Text variant="body" className="mt-2 whitespace-pre-wrap text-sm">
                  {notes}
                </Text>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-black">CANCEL</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-400 text-black border-4 border-black hover:bg-blue-500"
            >
              {loading ? "SUBMITTING..." : "CONFIRM SUBMISSION"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
