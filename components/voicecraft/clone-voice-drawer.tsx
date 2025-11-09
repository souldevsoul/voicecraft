"use client"

import { useState } from "react"
import { RiVoiceprintLine, RiLoader4Line, RiUploadLine } from "react-icons/ri"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { put } from '@vercel/blob'

type CloneVoiceDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CloneVoiceDrawer({ open, onOpenChange, onSuccess }: CloneVoiceDrawerProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [model, setModel] = useState("speech-02-turbo")
  const [noiseReduction, setNoiseReduction] = useState(true)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4']
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
        setError("Please upload an MP3, WAV, or M4A audio file")
        return
      }

      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        setError("File size must be less than 20MB")
        return
      }

      setAudioFile(file)
      setError(null)
    }
  }

  const uploadAudio = async (): Promise<string> => {
    if (!audioFile) throw new Error("No audio file selected")

    setUploading(true)
    try {
      const blob = await put(
        `voices/temp-user-id/${Date.now()}-${audioFile.name}`,
        audioFile,
        { access: 'public', addRandomSuffix: true }
      )

      return blob.url
    } catch (err) {
      throw new Error("Failed to upload audio file")
    } finally {
      setUploading(false)
    }
  }

  const handleClone = async () => {
    if (!name.trim()) {
      setError("Please enter a name for your voice")
      return
    }

    if (!audioFile && !audioUrl) {
      setError("Please upload an audio file")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Upload audio if not already uploaded
      let finalAudioUrl = audioUrl
      if (audioFile && !audioUrl) {
        finalAudioUrl = await uploadAudio()
        setAudioUrl(finalAudioUrl)
      }

      if (!finalAudioUrl) {
        throw new Error("Failed to get audio URL")
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'
      const response = await fetch(`${baseUrl}/api/voices/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'temp-user-id', // TODO: Get from session
          name,
          description,
          audioFileUrl: finalAudioUrl,
          model,
          noiseReduction,
          normalizeVolume: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clone voice')
      }

      setSuccess(true)

      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.()
        onOpenChange(false)
        // Reset form
        setName("")
        setDescription("")
        setAudioFile(null)
        setAudioUrl(null)
        setSuccess(false)
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clone voice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <RiVoiceprintLine className="h-5 w-5" />
            Clone Voice
          </SheetTitle>
          <SheetDescription>
            Upload an audio sample to create a custom voice clone (10 seconds - 5 minutes)
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Voice Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Voice Name *</Label>
            <Input
              id="name"
              placeholder="e.g., My Professional Voice"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-black"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe this voice..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-2 border-black"
            />
          </div>

          {/* Audio Upload */}
          <div className="space-y-2">
            <Label htmlFor="audio">Audio Sample *</Label>
            <div className="rounded-md border-2 border-black bg-white p-6 text-center">
              <input
                id="audio"
                type="file"
                accept="audio/mp3,audio/mpeg,audio/wav,audio/x-m4a,audio/mp4,.mp3,.wav,.m4a"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="audio"
                className="flex flex-col items-center cursor-pointer"
              >
                <RiUploadLine className="h-12 w-12 text-slate-400 mb-2" />
                {audioFile ? (
                  <p className="text-sm font-medium text-slate-900">{audioFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-900">
                      Click to upload audio file
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      MP3, WAV, or M4A • 10 sec - 5 min • Max 20MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Target Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model" className="border-2 border-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="speech-02-turbo">Speech 02 Turbo (Fast)</SelectItem>
                <SelectItem value="speech-02-hd">Speech 02 HD (High Quality)</SelectItem>
                <SelectItem value="minimax-2.6-turbo">Minimax 2.6 Turbo (Latest)</SelectItem>
                <SelectItem value="minimax-2.6-hd">Minimax 2.6 HD (Best Quality)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Choose which voice generation model this clone will work with
            </p>
          </div>

          {/* Noise Reduction */}
          <div className="flex items-center gap-2">
            <input
              id="noise-reduction"
              type="checkbox"
              checked={noiseReduction}
              onChange={(e) => setNoiseReduction(e.target.checked)}
              className="h-4 w-4 border-2 border-black"
            />
            <Label htmlFor="noise-reduction" className="cursor-pointer">
              Enable noise reduction
            </Label>
          </div>

          {/* Requirements Info */}
          <div className="rounded-md border-2 border-blue-500 bg-blue-50 p-4">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Recording Tips</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Use clear audio with minimal background noise</li>
              <li>• Record 30-60 seconds of natural speech</li>
              <li>• Speak at a normal pace with varied intonation</li>
              <li>• Use a quiet environment or enable noise reduction</li>
            </ul>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md border-2 border-red-500 bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="rounded-md border-2 border-green-500 bg-green-50 p-4">
              <p className="text-sm text-green-800 font-medium">
                ✓ Voice cloned successfully!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleClone}
              disabled={loading || uploading || !name.trim() || (!audioFile && !audioUrl)}
              className="flex-1"
              variant="primary"
            >
              {loading || uploading ? (
                <>
                  <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
                  {uploading ? 'Uploading...' : 'Cloning Voice...'}
                </>
              ) : (
                <>
                  <RiVoiceprintLine className="mr-2 h-4 w-4" />
                  Clone Voice
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading || uploading}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
