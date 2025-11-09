import { Suspense } from "react"
import { RiAddLine, RiVoiceprintLine, RiDeleteBinLine, RiPlayLine } from "react-icons/ri"
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
import { MoreHorizontal } from "lucide-react"
import { VoiceActions } from "@/components/dashboard/voice-actions"

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

async function getVoices(): Promise<Voice[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/voices`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('Failed to fetch voices:', response.statusText)
      return []
    }

    const data = await response.json()

    if (!data.success || !data.voices) {
      console.error('Invalid API response:', data)
      return []
    }

    // Map API response to Voice type
    return data.voices.map((voice: any) => ({
      id: voice.id,
      name: voice.name,
      description: voice.description,
      language: voice.language,
      gender: (voice.gender || 'neutral') as "male" | "female" | "neutral",
      previewUrl: voice.sampleAudioUrl,
      isCloned: voice.isCloned,
      createdAt: new Date(voice.createdAt).toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching voices:', error)
    return []
  }
}

export default async function VoicesPage() {
  const voices = await getVoices()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Heading variant="h1" className="uppercase">
            Voice Library
          </Heading>
          <Text variant="body" className="text-slate-600">
            Manage your cloned voices
          </Text>
        </div>
        <VoiceActions />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {voices.map((voice) => (
            <Card key={voice.id} variant="outlined" className="p-6">
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
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(voice.id)}
                    >
                      Copy voice ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <RiPlayLine className="mr-2 h-4 w-4" />
                      Play Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Voice</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
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
                  Created {new Date(voice.createdAt).toLocaleDateString()}
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
                  onClick={() => voice.previewUrl && window.open(voice.previewUrl, '_blank')}
                >
                  <RiPlayLine className="mr-2 h-4 w-4" />
                  Play Preview
                </Button>
              )}
            </Card>
          ))}
        </div>

        {voices.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-black p-12">
            <RiVoiceprintLine className="h-12 w-12 text-slate-400" />
            <Heading variant="h2" className="mt-4 uppercase">
              No Voices Yet
            </Heading>
            <Text variant="body" className="mt-2 text-slate-600">
              Clone your first voice to get started
            </Text>
            <div className="mt-4">
              <VoiceActions />
            </div>
          </div>
        )}
      </Suspense>
    </div>
  )
}
