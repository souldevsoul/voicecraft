"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  RiUploadLine,
  RiCheckLine,
  RiCloseLine,
  RiMusic2Line,
} from "react-icons/ri"

interface UploadAudioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadAudioDialog({
  open,
  onOpenChange,
}: UploadAudioDialogProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [filename, setFilename] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file type
      const validTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"]
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp3|wav|ogg)$/i)) {
        setError("Please select a valid audio file (MP3, WAV, or OGG)")
        return
      }

      // Check file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB")
        return
      }

      setFile(selectedFile)
      setFilename(selectedFile.name.replace(/\.[^/.]+$/, "")) // Remove extension
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    if (!filename.trim()) {
      setError("Please enter a filename")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      // Create FormData
      const formData = new FormData()
      formData.append("file", file)

      // Prepare metadata
      const metadata = {
        filename: filename,
        ...(description && { description }),
        ...(tags && {
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean)
        })
      }

      formData.append("metadata", JSON.stringify(metadata))

      // Upload to API
      const response = await fetch("/api/audios/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      // Success - refresh the page first
      router.refresh()

      // Small delay to allow revalidation to complete
      await new Promise(resolve => setTimeout(resolve, 500))

      // Close dialog
      onOpenChange(false)

      // Reset form
      setFile(null)
      setFilename("")
      setDescription("")
      setTags("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setFile(null)
    setFilename("")
    setDescription("")
    setTags("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white border-4 border-black brutalist-shadow">
        <DialogHeader>
          <DialogTitle className="font-black uppercase text-2xl">
            Upload Audio
          </DialogTitle>
          <DialogDescription>
            Upload your audio file to the library. Supported formats: MP3, WAV,
            OGG (max 50MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-4 border-red-500 p-4">
              <p className="text-red-700 font-bold uppercase text-sm flex items-center gap-2">
                <RiCloseLine className="w-5 h-5" />
                {error}
              </p>
            </div>
          )}

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="font-bold uppercase text-sm">
              Audio File
            </Label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,.mp3,.wav,.ogg"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 border-4 border-black font-bold uppercase"
                disabled={isUploading}
              >
                <RiUploadLine className="w-4 h-4" />
                Choose File
              </Button>
              {file && (
                <div className="flex items-center gap-2 text-sm">
                  <RiMusic2Line className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Filename */}
          <div className="space-y-2">
            <Label htmlFor="filename" className="font-bold uppercase text-sm">
              Filename
            </Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="My Audio Recording"
              className="border-4 border-black h-12"
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="font-bold uppercase text-sm"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of this audio..."
              className="border-4 border-black resize-none"
              rows={3}
              disabled={isUploading}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="font-bold uppercase text-sm">
              Tags (Optional)
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="music, podcast, voice-over (comma separated)"
              className="border-4 border-black h-12"
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t-4 border-black">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="gap-2 border-4 border-black font-bold uppercase"
            disabled={isUploading}
          >
            <RiCloseLine className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className="gap-2 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase"
            disabled={isUploading || !file}
          >
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <RiCheckLine className="w-4 h-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
