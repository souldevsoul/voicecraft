"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Play, Star, Globe } from "lucide-react"

export interface Voice {
  id: string
  name: string
  language: string
  gender?: "male" | "female" | "neutral"
  description?: string
  previewUrl?: string
  isCloned?: boolean
  isFavorite?: boolean
}

export interface VoiceSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  voices?: Voice[]
  selectedVoiceId?: string
  onVoiceSelect?: (voice: Voice) => void
  onPreview?: (voice: Voice) => void
  layout?: "grid" | "list"
  showFilters?: boolean
}

const VoiceSelector = React.forwardRef<HTMLDivElement, VoiceSelectorProps>(
  ({
    voices = [],
    selectedVoiceId,
    onVoiceSelect,
    onPreview,
    layout = "grid",
    showFilters = true,
    className,
    ...props
  }, ref) => {
    const [filter, setFilter] = React.useState<"all" | "cloned" | "favorites">("all")
    const [languageFilter, setLanguageFilter] = React.useState<string>("all")

    const filteredVoices = React.useMemo(() => {
      return voices.filter(voice => {
        if (filter === "cloned" && !voice.isCloned) return false
        if (filter === "favorites" && !voice.isFavorite) return false
        if (languageFilter !== "all" && voice.language !== languageFilter) return false
        return true
      })
    }, [voices, filter, languageFilter])

    const languages = React.useMemo(() => {
      const langs = new Set(voices.map(v => v.language))
      return Array.from(langs)
    }, [voices])

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All Voices
              </Button>
              <Button
                variant={filter === "cloned" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("cloned")}
              >
                My Clones
              </Button>
              <Button
                variant={filter === "favorites" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("favorites")}
              >
                <Star className="w-4 h-4" />
                Favorites
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <Globe className="w-4 h-4 text-slate-500" />
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="px-3 py-2 border-2 border-black text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Voice Grid/List */}
        <div
          className={cn(
            layout === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}
        >
          {filteredVoices.map((voice) => (
            <Card
              key={voice.id}
              variant={selectedVoiceId === voice.id ? "gradient" : "default"}
              hover="lift"
              padding="md"
              className={cn(
                "cursor-pointer transition-all",
                selectedVoiceId === voice.id && "ring-2 ring-yellow-400 ring-offset-2"
              )}
              onClick={() => onVoiceSelect?.(voice)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={cn(
                        "font-semibold truncate",
                        selectedVoiceId === voice.id ? "text-white" : "text-slate-900"
                      )}
                    >
                      {voice.name}
                    </h3>
                    {voice.isCloned && (
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 border-2 border-black font-bold uppercase",
                          selectedVoiceId === voice.id
                            ? "bg-white/20 text-white"
                            : "bg-yellow-400 text-black"
                        )}
                      >
                        Clone
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm mb-2",
                      selectedVoiceId === voice.id ? "text-white/80" : "text-slate-600"
                    )}
                  >
                    {voice.language} • {voice.gender || "Neutral"}
                  </p>
                  {voice.description && (
                    <p
                      className={cn(
                        "text-xs line-clamp-2",
                        selectedVoiceId === voice.id ? "text-white/70" : "text-slate-500"
                      )}
                    >
                      {voice.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {voice.previewUrl && (
                    <Button
                      variant={selectedVoiceId === voice.id ? "secondary" : "ghost"}
                      size="icon"
                      className="w-8 h-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPreview?.(voice)
                      }}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-8 h-8",
                      voice.isFavorite && "text-yellow-500"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle favorite toggle
                    }}
                  >
                    <Star
                      className={cn(
                        "w-4 h-4",
                        voice.isFavorite && "fill-current"
                      )}
                    />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredVoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No voices found matching your filters.</p>
          </div>
        )}
      </div>
    )
  }
)
VoiceSelector.displayName = "VoiceSelector"

export { VoiceSelector }
