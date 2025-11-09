"use client"

import { useState } from "react"
import { RiAddLine } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { CloneVoiceDrawer } from "@/components/voicecraft/clone-voice-drawer"

type VoiceActionsProps = {
  onVoiceCloned?: () => void
}

export function VoiceActions({ onVoiceCloned }: VoiceActionsProps) {
  const [cloneVoiceOpen, setCloneVoiceOpen] = useState(false)

  const handleSuccess = () => {
    // Refresh the page to show the new voice
    window.location.reload()
    if (onVoiceCloned) {
      onVoiceCloned()
    }
  }

  return (
    <>
      <Button variant="primary" onClick={() => setCloneVoiceOpen(true)}>
        <RiAddLine className="mr-2 h-4 w-4" />
        Clone New Voice
      </Button>

      {/* Clone Voice Drawer */}
      <CloneVoiceDrawer
        open={cloneVoiceOpen}
        onOpenChange={setCloneVoiceOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}
