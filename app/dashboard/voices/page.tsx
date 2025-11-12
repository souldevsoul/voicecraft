import { RiVoiceprintLine } from "react-icons/ri"
import { Text, Heading } from "@/components/ui/typography"
import { VoiceActions } from "@/components/dashboard/voice-actions"
import { VoiceCard } from "@/components/dashboard/voice-card"
import { getCurrentUserId } from "@/lib/get-current-user"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

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
    // Get current user from session
    const userId = await getCurrentUserId()

    if (!userId) {
      redirect('/auth/signin')
    }

    // Query database directly using Prisma
    const voices = await prisma.voice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    // Map to Voice type
    return voices.map((voice) => ({
      id: voice.id,
      name: voice.name,
      description: voice.description,
      language: voice.language,
      gender: (voice.gender || 'neutral') as "male" | "female" | "neutral",
      previewUrl: voice.sampleAudioUrl,
      isCloned: voice.isCloned,
      createdAt: voice.createdAt.toISOString(),
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

      {voices.length === 0 ? (
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {voices.map((voice) => (
            <VoiceCard key={voice.id} voice={voice} />
          ))}
        </div>
      )}
    </div>
  )
}
