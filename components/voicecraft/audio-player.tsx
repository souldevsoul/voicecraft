"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { ActionIcon, Slider, Group, Stack, Text, Transition } from "@mantine/core"
import { cn } from "@/lib/utils"
import { Play, Pause, Download, Volume2, VolumeX } from "lucide-react"

export interface AudioPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  audioUrl?: string
  waveformColor?: "primary" | "secondary" | "success"
  showDownload?: boolean
}

const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(
  ({ title, subtitle, audioUrl, waveformColor = "primary", showDownload = true, className, ...props }, ref) => {
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [duration, setDuration] = React.useState(0)
    const [volume, setVolume] = React.useState(80)
    const [isMuted, setIsMuted] = React.useState(false)
    const [isHovering, setIsHovering] = React.useState(false)
    const audioRef = React.useRef<HTMLAudioElement>(null)

    // Update audio volume
    React.useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume / 100
      }
    }, [volume, isMuted])

    const togglePlay = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }

    const toggleMute = () => {
      setIsMuted(!isMuted)
    }

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration)
      }
    }

    const handleSeek = (value: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = value
        setCurrentTime(value)
      }
    }

    const formatTime = (time: number) => {
      if (!isFinite(time)) return "0:00"
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const colorMap = {
      primary: 'yellow',
      secondary: 'gray',
      success: 'emerald',
    }

    const gradientMap = {
      primary: { from: 'yellow.6', to: 'yellow.4', deg: 135 },
      secondary: { from: 'gray.6', to: 'gray.4', deg: 135 },
      success: { from: 'emerald.6', to: 'teal.5', deg: 135 },
    }

    return (
      <Card
        ref={ref}
        variant="elevated"
        padding="lg"
        hover="glow"
        className={cn("w-full", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...props}
      >
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        <Group gap="lg" wrap="nowrap">
          {/* Play/Pause Button */}
          <ActionIcon
            variant="gradient"
            gradient={gradientMap[waveformColor]}
            size={64}
            radius="xl"
            onClick={togglePlay}
            className="flex-shrink-0 shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
          >
            <Transition mounted={isPlaying} transition="rotate-right" duration={200}>
              {(styles) => (
                <Pause style={styles} size={28} />
              )}
            </Transition>
            <Transition mounted={!isPlaying} transition="rotate-right" duration={200}>
              {(styles) => (
                <Play style={{ ...styles, marginLeft: 2 }} size={28} />
              )}
            </Transition>
          </ActionIcon>

          {/* Info & Progress */}
          <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
            {(title || subtitle) && (
              <div>
                {title && (
                  <Text fw={600} size="md" truncate c="dark">
                    {title}
                  </Text>
                )}
                {subtitle && (
                  <Text size="sm" c="dimmed" truncate>
                    {subtitle}
                  </Text>
                )}
              </div>
            )}

            {/* Progress Slider */}
            <Stack gap={4}>
              <Slider
                value={currentTime}
                max={duration || 100}
                onChange={handleSeek}
                color={colorMap[waveformColor]}
                size="sm"
                radius="xl"
                marks={[]}
                label={(value) => formatTime(value)}
                className="transition-all duration-200"
                styles={{
                  thumb: {
                    transition: 'all 200ms ease',
                    transform: isHovering ? 'scale(1.2)' : 'scale(1)',
                  },
                  bar: {
                    background: `linear-gradient(135deg, var(--mantine-color-${colorMap[waveformColor]}-6), var(--mantine-color-${colorMap[waveformColor]}-4))`,
                  },
                }}
              />

              {/* Time Display */}
              <Group justify="space-between">
                <Text size="xs" c="dimmed" fw={500}>
                  {formatTime(currentTime)}
                </Text>
                <Text size="xs" c="dimmed" fw={500}>
                  {formatTime(duration)}
                </Text>
              </Group>
            </Stack>
          </Stack>

          {/* Volume & Download Controls */}
          <Group gap="xs" className="flex-shrink-0">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              radius="md"
              onClick={toggleMute}
              className="hover:bg-gray-100 transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </ActionIcon>

            {/* Volume Slider - Only show on hover */}
            <Transition mounted={isHovering} transition="fade" duration={200}>
              {(styles) => (
                <div style={{ ...styles, width: 80 }}>
                  <Slider
                    value={volume}
                    onChange={setVolume}
                    size="xs"
                    color={colorMap[waveformColor]}
                    min={0}
                    max={100}
                  />
                </div>
              )}
            </Transition>

            {showDownload && audioUrl && (
              <ActionIcon
                component="a"
                href={audioUrl}
                download
                variant="subtle"
                color="gray"
                size="lg"
                radius="md"
                className="hover:bg-gray-100 transition-colors"
              >
                <Download size={20} />
              </ActionIcon>
            )}
          </Group>
        </Group>
      </Card>
    )
  }
)
AudioPlayer.displayName = "AudioPlayer"

export { AudioPlayer }
