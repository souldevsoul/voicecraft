"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Text, Heading } from "@/components/ui/typography"
import { Textarea } from "@/components/ui/textarea"
import { RiUserStarLine, RiCheckLine, RiStarFill } from "react-icons/ri"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Expert {
  id: string
  specialization: string[]
  bio?: string | null
  hourlyRate?: number | null
  isAvailable: boolean
  rating?: number | null
  completedJobs: number
  user: {
    id: string
    name: string | null
    email: string | null
  }
}

interface AssignExpertCardProps {
  projectId: string
  onAssign: (expertId: string, instructions: string) => void
  loading?: boolean
}

export function AssignExpertCard({ projectId, onAssign, loading }: AssignExpertCardProps) {
  const [experts, setExperts] = useState<Expert[]>([])
  const [selectedExpertId, setSelectedExpertId] = useState<string>("")
  const [instructions, setInstructions] = useState("")
  const [loadingExperts, setLoadingExperts] = useState(true)

  useEffect(() => {
    fetchExperts()
  }, [])

  const fetchExperts = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/experts`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        console.error('Failed to fetch experts')
        setExperts([])
        return
      }

      const data = await response.json()
      if (data.success && data.experts) {
        setExperts(data.experts)
      }
    } catch (error) {
      console.error('Error fetching experts:', error)
      setExperts([])
    } finally {
      setLoadingExperts(false)
    }
  }

  const selectedExpert = experts.find(e => e.id === selectedExpertId)

  const handleAssign = () => {
    if (!selectedExpertId || !instructions.trim()) {
      alert('Please select an expert and provide instructions')
      return
    }

    if (instructions.trim().length < 10) {
      alert('Instructions must be at least 10 characters')
      return
    }

    onAssign(selectedExpertId, instructions.trim())
  }

  return (
    <Card variant="elevated" padding="lg" className="border-4 border-yellow-400">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <RiUserStarLine className="h-6 w-6 text-yellow-600" />
          <Heading as="h3" className="text-lg font-bold uppercase">
            Assign Expert
          </Heading>
        </div>

        <Text variant="caption" className="text-sm text-slate-600">
          Select an expert to work on your project and provide detailed instructions.
        </Text>

        {loadingExperts ? (
          <Text variant="body" className="text-slate-600">Loading experts...</Text>
        ) : experts.length === 0 ? (
          <div className="rounded-md border-2 border-dashed border-black bg-slate-50 p-6 text-center">
            <Text variant="caption" className="text-xs text-slate-400">
              No experts available at this time
            </Text>
          </div>
        ) : (
          <>
            {/* Expert Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase">
                Select Expert
              </label>
              <Select value={selectedExpertId} onValueChange={setSelectedExpertId}>
                <SelectTrigger className="w-full border-2 border-black">
                  <SelectValue placeholder="Choose an expert..." />
                </SelectTrigger>
                <SelectContent className="border-2 border-black">
                  {experts.map((expert) => (
                    <SelectItem key={expert.id} value={expert.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{expert.user.name}</span>
                          {expert.rating && expert.rating > 0 && (
                            <div className="flex items-center space-x-1 text-yellow-600">
                              <RiStarFill className="h-3 w-3" />
                              <span className="text-xs font-bold">{expert.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {expert.completedJobs} jobs completed
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Expert Details */}
            {selectedExpert && (
              <div className="rounded-md border-2 border-black bg-slate-50 p-4 space-y-2">
                <div>
                  <Text variant="caption" className="text-xs font-bold uppercase text-slate-500">
                    Specialization
                  </Text>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedExpert.specialization.map((spec, idx) => (
                      <span
                        key={idx}
                        className="inline-block rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold uppercase"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedExpert.bio && (
                  <div>
                    <Text variant="caption" className="text-xs font-bold uppercase text-slate-500">
                      Bio
                    </Text>
                    <Text variant="body" className="text-sm mt-1">
                      {selectedExpert.bio}
                    </Text>
                  </div>
                )}

                {selectedExpert.hourlyRate && (
                  <div>
                    <Text variant="caption" className="text-xs font-bold uppercase text-slate-500">
                      Hourly Rate
                    </Text>
                    <Text variant="body" className="text-sm font-bold mt-1">
                      ${selectedExpert.hourlyRate}/hour
                    </Text>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase">
                Instructions for Expert
              </label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Describe what you need the expert to do with your audio files..."
                rows={6}
                className="border-2 border-black resize-none"
              />
              <Text variant="caption" className="text-xs text-slate-500">
                Minimum 10 characters. Be as detailed as possible.
              </Text>
            </div>

            {/* Assign Button */}
            <Button
              onClick={handleAssign}
              disabled={loading || !selectedExpertId || !instructions.trim() || instructions.trim().length < 10}
              className="w-full border-2 border-yellow-600 bg-yellow-400 hover:bg-yellow-500"
            >
              <RiCheckLine className="mr-2 h-4 w-4" />
              {loading ? 'Assigning...' : 'Assign Expert'}
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
