import { Suspense } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns, type Audio } from "./columns"
import { Text, Heading } from "@/components/ui/typography"
import { AudioActions } from "@/components/dashboard/audio-actions"
import { getCurrentUserId } from "@/lib/get-current-user"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

async function getAudios(): Promise<Audio[]> {
  try {
    // Get current user from session
    const userId = await getCurrentUserId()

    if (!userId) {
      redirect('/auth/signin')
    }

    // Query database directly using Prisma
    const audios = await prisma.audio.findMany({
      where: { userId },
      include: {
        voice: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    // Map to Audio type
    return audios.map((audio) => ({
      id: audio.id,
      filename: audio.filename,
      audioUrl: audio.audioUrl,
      duration: audio.duration,
      fileSize: audio.fileSize,
      format: audio.format,
      voiceName: audio.voice?.name || null,
      text: audio.text,
      status: audio.status,
      createdAt: audio.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching audios:', error)
    return []
  }
}

export default async function AudiosPage() {
  const audios = await getAudios()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Heading as="h1" className="text-2xl font-bold uppercase tracking-tight">
            Audio Library
          </Heading>
          <Text variant="body" className="text-slate-600">
            Manage your generated and uploaded audio files
          </Text>
        </div>
        <AudioActions />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <DataTable
          columns={columns}
          data={audios}
          searchKey="filename"
          searchPlaceholder="Search audios..."
        />
      </Suspense>
    </div>
  )
}
