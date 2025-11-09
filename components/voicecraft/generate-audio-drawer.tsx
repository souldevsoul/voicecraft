"use client"

import { useState, useEffect } from "react"
import { RiSoundModuleLine, RiLoader4Line } from "react-icons/ri"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AudioPlayer } from "@/components/voicecraft/audio-player"

type Voice = {
  id: string
  name: string
  voiceId: string | null
}

type GenerateAudioDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GenerateAudioDrawer({ open, onOpenChange }: GenerateAudioDrawerProps) {
  const [text, setText] = useState("")
  const [voiceId, setVoiceId] = useState("Wise_Woman")
  const [emotion, setEmotion] = useState("auto")
  const [speed, setSpeed] = useState(1.0)
  const [voices, setVoices] = useState<Voice[]>([])
  const [loading, setLoading] = useState(false)
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchVoices()
    }
  }, [open])

  const fetchVoices = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'
      const response = await fetch(`${baseUrl}/api/voices`, {
        cache: 'no-store',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.voices) {
          setVoices(data.voices)
        }
      }
    } catch (error) {
      console.error('Error fetching voices:', error)
    }
  }

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter some text to generate")
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedAudioUrl(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'
      const response = await fetch(`${baseUrl}/api/voices/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId,
          userId: 'temp-user-id', // TODO: Get from session
          emotion,
          speed,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate audio')
      }

      setGeneratedAudioUrl(data.audioUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate audio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <RiSoundModuleLine className="h-5 w-5" />
            Generate Audio
          </SheetTitle>
          <SheetDescription>
            Convert text to speech with custom voices and emotions
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="text">Text to Generate</Label>
            <Textarea
              id="text"
              placeholder="Enter the text you want to convert to speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] border-2 border-black"
              maxLength={10000}
            />
            <p className="text-xs text-slate-500">
              {text.length} / 10,000 characters
            </p>
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select value={voiceId} onValueChange={setVoiceId}>
              <SelectTrigger id="voice" className="border-2 border-black">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wise_Woman">Wise Woman (Default)</SelectItem>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.voiceId || voice.id}>
                    {voice.name} {voice.voiceId && '(Custom)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Emotion Selection */}
          <div className="space-y-2">
            <Label htmlFor="emotion">Emotion</Label>
            <Select value={emotion} onValueChange={setEmotion}>
              <SelectTrigger id="emotion" className="border-2 border-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="sad">Sad</SelectItem>
                <SelectItem value="angry">Angry</SelectItem>
                <SelectItem value="excited">Excited</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="serious">Serious</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="speed">Speed</Label>
              <span className="text-sm text-slate-600">{speed.toFixed(1)}x</span>
            </div>
            <Slider
              id="speed"
              min={0.5}
              max={2.0}
              step={0.1}
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
              className="py-4"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md border-2 border-red-500 bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Generated Audio */}
          {generatedAudioUrl && (
            <div className="space-y-2">
              <Label>Generated Audio</Label>
              <div className="rounded-md border-2 border-black bg-white p-4">
                <AudioPlayer audioUrl={generatedAudioUrl} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="flex-1"
              variant="primary"
            >
              {loading ? (
                <>
                  <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RiSoundModuleLine className="mr-2 h-4 w-4" />
                  Generate Audio
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
