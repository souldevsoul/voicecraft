"use client"

import { useState } from "react"
import { RiSoundModuleLine, RiVoiceprintLine, RiFolder3Line } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/typography"
import { GenerateAudioDrawer } from "@/components/voicecraft/generate-audio-drawer"
import { CloneVoiceDrawer } from "@/components/voicecraft/clone-voice-drawer"

export function DashboardQuickActions() {
  const [generateAudioOpen, setGenerateAudioOpen] = useState(false)
  const [cloneVoiceOpen, setCloneVoiceOpen] = useState(false)

  return (
    <>
      <Card variant="outlined" className="p-6">
        <Heading variant="h3" className="uppercase mb-4">
          Quick Actions
        </Heading>
        <div className="grid gap-3 md:grid-cols-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setGenerateAudioOpen(true)}
          >
            <RiSoundModuleLine className="mr-2 h-4 w-4" />
            Generate Audio
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setCloneVoiceOpen(true)}
          >
            <RiVoiceprintLine className="mr-2 h-4 w-4" />
            Clone Voice
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="/dashboard/projects">
              <RiFolder3Line className="mr-2 h-4 w-4" />
              Create Project
            </a>
          </Button>
        </div>
      </Card>

      {/* Drawers */}
      <GenerateAudioDrawer
        open={generateAudioOpen}
        onOpenChange={setGenerateAudioOpen}
      />
      <CloneVoiceDrawer
        open={cloneVoiceOpen}
        onOpenChange={setCloneVoiceOpen}
        onSuccess={() => {
          // Optionally refresh the page or show a success message
        }}
      />
    </>
  )
}
