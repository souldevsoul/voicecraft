"use client"

import { useState, useEffect, use } from "react"
import { RiArrowLeftLine, RiUserLine, RiTimeLine, RiMoneyDollarCircleLine } from "react-icons/ri"
import { Text, Heading } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ProjectStatusBadge,
  WorkSubmissionCard,
  type ProjectStatus,
  type ProjectAudio,
} from "@/components/project"
import { AudioPlayer } from "@/components/voicecraft/audio-player"

type ProjectDetail = {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  request: string | null
  estimatedCost: number | null
  estimatedDuration: number | null
  estimationData: any
  deadline: string | null
  assignedAt: string | null
  submittedAt: string | null
  clientName: string
  clientEmail: string
  projectAudios?: {
    id: string
    audio: {
      id: string
      filename: string
      audioUrl: string
      duration: number | null
    }
  }[]
}

export default function SpecialistProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      // TODO: Replace with real API call
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/projects/${id}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        console.error('Failed to fetch project:', response.statusText)
        return
      }

      const data = await response.json()

      if (!data.success || !data.project) {
        console.error('Invalid API response:', data)
        return
      }

      setProject({
        ...data.project,
        clientName: data.project.user?.name || "Client",
        clientEmail: data.project.user?.email || "",
      })
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitWork = async (audioIds: string[], notes?: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioIds, notes }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to submit work')
        return
      }

      await fetchProject()
      alert('Work submitted successfully!')
    } catch (error) {
      console.error('Error submitting work:', error)
      alert('Failed to submit work')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-96">
          <Text variant="body" className="text-slate-600">Loading project...</Text>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col items-center justify-center h-96">
          <Heading variant="h3" className="font-bold uppercase">PROJECT NOT FOUND</Heading>
          <Text variant="body" className="mt-2 text-slate-600">
            This project does not exist or you don't have access to it.
          </Text>
          <Button
            variant="outline"
            className="mt-4 border-2"
            onClick={() => window.location.href = "/specialist/projects"}
          >
            <RiArrowLeftLine className="mr-2 h-4 w-4" />
            BACK TO PROJECTS
          </Button>
        </div>
      </div>
    )
  }

  const existingAudios: ProjectAudio[] = project.projectAudios
    ? project.projectAudios.map(pa => ({
        id: pa.audio.id,
        filename: pa.audio.filename,
        audioUrl: pa.audio.audioUrl,
        duration: pa.audio.duration || undefined,
      }))
    : []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="border-2"
            onClick={() => window.location.href = "/specialist/projects"}
          >
            <RiArrowLeftLine className="mr-2 h-4 w-4" />
            BACK
          </Button>
          <div>
            <Heading variant="h2" className="text-3xl font-bold uppercase tracking-tight">
              {project.name}
            </Heading>
            <Text variant="body" className="text-slate-600">
              {project.description || "No description provided"}
            </Text>
          </div>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Project Info Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Client */}
        <Card variant="outlined" className="border-4 border-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <RiUserLine className="h-5 w-5" />
              CLIENT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="body" className="font-bold">{project.clientName}</Text>
            <Text variant="caption" className="text-xs text-slate-600">{project.clientEmail}</Text>
          </CardContent>
        </Card>

        {/* Duration */}
        {project.estimatedDuration && (
          <Card variant="outlined" className="border-4 border-black">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <RiTimeLine className="h-5 w-5" />
                ESTIMATED DURATION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text variant="body" className="text-2xl font-bold">{project.estimatedDuration}h</Text>
              <Text variant="caption" className="text-xs text-slate-600">
                Est. completion time
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Payment */}
        {project.estimatedCost && (
          <Card variant="outlined" className="border-4 border-black">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <RiMoneyDollarCircleLine className="h-5 w-5" />
                PAYMENT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text variant="body" className="text-2xl font-bold">
                ${project.estimatedCost.toFixed(2)}
              </Text>
              <Text variant="caption" className="text-xs text-slate-600">
                Upon completion
              </Text>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Client Request */}
      {project.request && (
        <Card variant="outlined" className="border-4 border-black">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase">CLIENT REQUEST</CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="body" className="whitespace-pre-wrap">
              {project.request}
            </Text>
          </CardContent>
        </Card>
      )}

      <Separator className="bg-black" />

      {/* Work Submission Card */}
      {project.status === "assigned" && (
        <WorkSubmissionCard
          projectId={project.id}
          projectName={project.name}
          projectDescription={project.description || undefined}
          existingAudios={existingAudios}
          onSubmit={handleSubmitWork}
          loading={actionLoading}
        />
      )}

      {/* Submitted Work - For in_review and completed */}
      {(project.status === "in_review" || project.status === "completed") && project.submittedAt && (
        <Card variant="outlined" className="border-4 border-cyan-500 bg-cyan-50">
          <CardHeader>
            <CardTitle className="text-cyan-900">SUBMITTED WORK</CardTitle>
            <Text variant="caption" className="text-xs text-cyan-800">
              Submitted on {new Date(project.submittedAt).toLocaleDateString()}
            </Text>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Submission Notes */}
            {project.estimationData?.submissionNotes && (
              <div className="rounded-md border-2 border-black bg-white p-4">
                <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                  YOUR NOTES
                </Text>
                <Text variant="body" className="mt-2 whitespace-pre-wrap">
                  {project.estimationData.submissionNotes}
                </Text>
              </div>
            )}

            {/* Submitted Audios */}
            <div>
              <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                SUBMITTED FILES
              </Text>
              <div className="mt-2 space-y-3 rounded-md border-2 border-black bg-white p-4">
                {existingAudios.length > 0 ? (
                  existingAudios.map((audio, index) => (
                    <div key={audio.id} className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                      <Text variant="body" className="mb-2 font-bold text-sm">
                        {index + 1}. {audio.filename}
                      </Text>
                      <AudioPlayer audioUrl={audio.audioUrl} />
                    </div>
                  ))
                ) : (
                  <Text variant="caption" className="text-xs text-slate-400">
                    No audio files
                  </Text>
                )}
              </div>
            </div>

            {project.status === "in_review" && (
              <div className="rounded-md border-2 border-cyan-500 bg-cyan-100 p-4">
                <Text variant="body" className="font-bold text-cyan-900">
                  ⏳ Waiting for client review
                </Text>
                <Text variant="caption" className="mt-1 text-xs text-cyan-800">
                  The client will review your work and either approve it or request changes.
                </Text>
              </div>
            )}

            {project.status === "completed" && (
              <div className="rounded-md border-2 border-green-500 bg-green-100 p-4">
                <Text variant="body" className="font-bold text-green-900">
                  ✅ Project completed successfully!
                </Text>
                <Text variant="caption" className="mt-1 text-xs text-green-800">
                  The client has approved your work. Payment has been processed.
                </Text>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Original Project Audios (Reference) */}
      {project.status === "assigned" && existingAudios.length > 0 && (
        <div>
          <Heading variant="h3" className="mb-3 font-bold uppercase">
            REFERENCE AUDIOS ({existingAudios.length})
          </Heading>
          <div className="space-y-3 rounded-md border-4 border-black bg-white p-4">
            {existingAudios.map((audio, index) => (
              <div key={audio.id} className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                <Text variant="body" className="mb-2 font-bold text-sm">
                  {index + 1}. {audio.filename}
                </Text>
                <AudioPlayer audioUrl={audio.audioUrl} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
