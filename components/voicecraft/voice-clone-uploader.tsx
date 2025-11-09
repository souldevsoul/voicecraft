"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ActionIcon, Group, Stack, Text, Progress, Badge, Transition } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import { cn } from "@/lib/utils"
import { Upload, X, FileAudio, AlertCircle, CheckCircle2, Music } from "lucide-react"
import { Waveform } from "./waveform"

export interface UploadedFile {
  id: string
  file: File
  url: string
  duration?: number
  status: "uploading" | "processing" | "ready" | "error"
  error?: string
}

export interface VoiceCloneUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onFilesUpload?: (files: File[]) => void
  onFileRemove?: (fileId: string) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedFormats?: string[]
  uploadedFiles?: UploadedFile[]
  voiceName?: string
  onVoiceNameChange?: (name: string) => void
}

const VoiceCloneUploader = React.forwardRef<HTMLDivElement, VoiceCloneUploaderProps>(
  ({
    onFilesUpload,
    onFileRemove,
    maxFiles = 5,
    maxFileSize = 10,
    acceptedFormats = [".mp3", ".wav", ".m4a", ".ogg"],
    uploadedFiles = [],
    voiceName = "",
    onVoiceNameChange,
    className,
    ...props
  }, ref) => {

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const getStatusIcon = (status: UploadedFile["status"]) => {
      switch (status) {
        case "ready":
          return <CheckCircle2 size={20} className="text-emerald-600" />
        case "error":
          return <AlertCircle size={20} className="text-red-600" />
        case "uploading":
        case "processing":
          return (
            <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          )
      }
    }

    const getStatusProgress = (status: UploadedFile["status"]) => {
      switch (status) {
        case "uploading":
          return 45
        case "processing":
          return 75
        case "ready":
          return 100
        case "error":
          return 0
      }
    }

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {/* Voice Name Input */}
        <Stack gap="xs">
          <Text size="sm" fw={600} c="dark">
            Voice Clone Name
          </Text>
          <Input
            inputSize="lg"
            placeholder="e.g., My Professional Voice"
            value={voiceName}
            onChange={(e) => onVoiceNameChange?.(e.target.value)}
          />
        </Stack>

        {/* Dropzone Upload Area */}
        <Dropzone
          onDrop={(files) => onFilesUpload?.(files)}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={maxFileSize * 1024 * 1024}
          maxFiles={maxFiles - uploadedFiles.length}
          accept={['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg']}
          className={cn(
            "border-2 border-dashed border-black rounded-xl transition-all duration-300",
            "hover:border-yellow-400 hover:bg-yellow-50",
            "cursor-pointer"
          )}
          styles={{
            root: {
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        >
          <Stack align="center" gap="md" p="xl">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-yellow-400 border-4 border-black shadow-lg">
                <Music className="w-10 h-10 text-black" />
              </div>
            </div>

            <div className="text-center">
              <Text size="xl" fw={700} c="dark" mb={4}>
                Upload Audio Samples
              </Text>
              <Text size="sm" c="dimmed" mb="xs">
                Drag and drop audio files or click to browse
              </Text>
              <Group justify="center" gap={4}>
                <Badge variant="filled" color="yellow" size="sm" className="bg-yellow-400 text-black border-2 border-black font-bold uppercase">
                  {acceptedFormats.join(", ")}
                </Badge>
                <Badge variant="filled" color="dark" size="sm" className="bg-white text-black border-2 border-black font-bold uppercase">
                  Max {maxFileSize}MB
                </Badge>
                <Badge variant="filled" color="yellow" size="sm" className="bg-yellow-400 text-black border-2 border-black font-bold uppercase">
                  Up to {maxFiles} files
                </Badge>
              </Group>
            </div>
          </Stack>
        </Dropzone>

        {/* Guidelines */}
        <Card
          variant="ghost"
          padding="md"
          className="border-2 border-blue-200 bg-blue-50"
        >
          <Stack gap="xs">
            <Text size="sm" fw={700} c="blue.9">
              Best Practices for Voice Cloning
            </Text>
            <Stack gap={4}>
              {[
                "Upload 3-5 clear audio samples for best results",
                "Each sample should be 5-30 seconds long",
                "Use high-quality recordings with minimal background noise",
                "Include varied speech patterns and emotions",
              ].map((tip, i) => (
                <Text key={i} size="sm" c="blue.8">
                  • {tip}
                </Text>
              ))}
            </Stack>
          </Stack>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text size="sm" fw={700} c="dark">
                Uploaded Samples
              </Text>
              <Badge variant="filled" size="lg" radius="sm" className="bg-yellow-400 text-black border-2 border-black font-bold uppercase">
                {uploadedFiles.length}/{maxFiles}
              </Badge>
            </Group>

            <Stack gap="sm">
              {uploadedFiles.map((uploadedFile, index) => (
                <Transition
                  key={uploadedFile.id}
                  mounted={true}
                  transition="slide-left"
                  duration={300}
                  timingFunction="ease"
                  keepMounted
                  exitDuration={200}
                >
                  {(styles) => (
                    <Card
                      variant="elevated"
                      padding="md"
                      hover="lift"
                      className="relative"
                      style={styles}
                    >
                      <Group gap="md" wrap="nowrap">
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {getStatusIcon(uploadedFile.status)}
                        </div>

                        {/* File Info */}
                        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                          <Group justify="space-between" gap="xs" wrap="nowrap">
                            <Text fw={600} size="sm" truncate c="dark" style={{ flex: 1 }}>
                              {uploadedFile.file.name}
                            </Text>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              size="sm"
                              onClick={() => onFileRemove?.(uploadedFile.id)}
                              className="flex-shrink-0"
                            >
                              <X size={16} />
                            </ActionIcon>
                          </Group>

                          <Text size="xs" c="dimmed">
                            {formatFileSize(uploadedFile.file.size)}
                            {uploadedFile.duration && ` • ${Math.round(uploadedFile.duration)}s`}
                          </Text>

                          {/* Waveform for ready files */}
                          {uploadedFile.status === "ready" && (
                            <div className="mt-2">
                              <Waveform bars={40} size="sm" color="primary" animated={false} />
                            </div>
                          )}

                          {/* Progress bar for uploading/processing */}
                          {(uploadedFile.status === "uploading" || uploadedFile.status === "processing") && (
                            <div className="mt-2 space-y-1">
                              <Progress
                                value={getStatusProgress(uploadedFile.status)}
                                size="sm"
                                radius="xl"
                                animated
                                color="yellow"
                                styles={{
                                  root: {
                                    background: 'linear-gradient(90deg, #fef3c7, #fde68a)',
                                  },
                                }}
                              />
                              <Text size="xs" c="dimmed">
                                {uploadedFile.status === "uploading" ? "Uploading..." : "Processing..."}
                              </Text>
                            </div>
                          )}

                          {/* Error message */}
                          {uploadedFile.status === "error" && uploadedFile.error && (
                            <Text size="xs" c="red.6" mt={4}>
                              {uploadedFile.error}
                            </Text>
                          )}
                        </Stack>
                      </Group>
                    </Card>
                  )}
                </Transition>
              ))}
            </Stack>
          </Stack>
        )}
      </div>
    )
  }
)
VoiceCloneUploader.displayName = "VoiceCloneUploader"

export { VoiceCloneUploader }
