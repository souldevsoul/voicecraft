"use client"

import { useState } from "react"
import { RiUploadLine, RiVoiceprintLine } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { GenerateAudioDrawer } from "@/components/voicecraft/generate-audio-drawer"

export function AudioActions() {
  const [generateAudioOpen, setGenerateAudioOpen] = useState(false)

  const handleUpload = () => {
    // TODO: Implement upload functionality
    alert("Upload functionality coming soon!")
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={handleUpload}>
          <RiUploadLine className="mr-2 h-4 w-4" />
          Upload Audio
        </Button>
        <Button variant="primary" onClick={() => setGenerateAudioOpen(true)}>
          <RiVoiceprintLine className="mr-2 h-4 w-4" />
          Generate Audio
        </Button>
      </div>

      {/* Generate Audio Drawer */}
      <GenerateAudioDrawer
        open={generateAudioOpen}
        onOpenChange={setGenerateAudioOpen}
      />
    </>
  )
}
