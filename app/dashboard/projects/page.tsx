"use client"

import { useState, useEffect } from "react"
import { RiAddLine, RiDraggable } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Text, Heading } from "@/components/ui/typography"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  ProjectStatusBadge,
  EstimateCard,
  CreditBalanceCard,
  WorkReviewCard,
  getStatusColor,
  type ProjectStatus,
  type EstimateData,
  type SubmittedWork,
} from "@/components/project"
import { AudioPlayer } from "@/components/voicecraft/audio-player"

type Project = {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  request: string | null
  estimatedCost: number | null
  estimatedDuration: number | null
  actualCost: number | null
  estimationData: any
  priority: "low" | "medium" | "high" | "urgent"
  audioCount: number
  deadline: string | null
  assignedAt: string | null
  submittedAt: string | null
  reviewedAt: string | null
  rating: number | null
  feedback: string | null
  expertName: string | null
  expertRating: number | null
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

type UserData = {
  id: string
  credits: number
}

const KANBAN_COLUMNS: { status: ProjectStatus; label: string }[] = [
  { status: "draft", label: "Draft" },
  { status: "estimating", label: "Estimating" },
  { status: "waiting_for_estimate_accept", label: "Estimate Ready" },
  { status: "waiting_for_assignment", label: "Awaiting Expert" },
  { status: "assigned", label: "In Progress" },
  { status: "in_review", label: "In Review" },
  { status: "completed", label: "Completed" },
]

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [userData, setUserData] = useState<UserData>({ id: "temp-user-id", credits: 100000 })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'
      const response = await fetch(`${baseUrl}/api/users/me`, {
        cache: 'no-store',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUserData({
            id: data.user.id,
            credits: data.user.credits
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchProjects = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'
      const response = await fetch(`${baseUrl}/api/projects`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        console.error('Failed to fetch projects:', response.statusText)
        setProjects([])
        return
      }

      const data = await response.json()

      if (!data.success || !data.projects) {
        console.error('Invalid API response:', data)
        setProjects([])
        return
      }

      // Map API response to Project type
      const mappedProjects: Project[] = data.projects.map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        request: project.request,
        estimatedCost: project.estimatedCost,
        estimatedDuration: project.estimatedDuration,
        actualCost: project.actualCost,
        estimationData: project.estimationData,
        priority: project.priority,
        audioCount: project._count?.projectAudios || 0,
        deadline: project.deadline,
        assignedAt: project.assignedAt,
        submittedAt: project.submittedAt,
        reviewedAt: project.reviewedAt,
        rating: project.rating,
        feedback: project.feedback,
        expertName: project.expert?.user?.name || null,
        expertRating: project.expert?.rating || null,
        projectAudios: project.projectAudios,
      }))

      setProjects(mappedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter((project) => project.status === status)
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
      case "urgent":
        return "danger"
      case "medium":
        return "warning"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  // Estimate handlers
  const handleGetEstimate = async (projectId: string, request: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to get estimate')
        return
      }

      await fetchProjects()
      setSelectedProject(null)
      alert('Estimate generated successfully!')
    } catch (error) {
      console.error('Error getting estimate:', error)
      alert('Failed to get estimate')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAcceptEstimate = async (projectId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/estimate/accept`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 402) {
          alert(`Insufficient credits!\n\nNeeded: ${data.creditsNeeded} credits\nAvailable: ${data.creditsAvailable} credits\nShortfall: ${data.shortfall} credits ($${(data.shortfall / 100).toFixed(2)})`)
        } else {
          alert(data.error || 'Failed to accept estimate')
        }
        return
      }

      await fetchProjects()
      setSelectedProject(null)
      alert('Estimate accepted and credits reserved!')
    } catch (error) {
      console.error('Error accepting estimate:', error)
      alert('Failed to accept estimate')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectEstimate = async (projectId: string, reason?: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/estimate/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to reject estimate')
        return
      }

      await fetchProjects()
      setSelectedProject(null)
      alert('Estimate rejected')
    } catch (error) {
      console.error('Error rejecting estimate:', error)
      alert('Failed to reject estimate')
    } finally {
      setActionLoading(false)
    }
  }

  // Work review handlers
  const handleApproveWork = async (projectId: string, rating: number, feedback?: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedback }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to approve work')
        return
      }

      await fetchProjects()
      setSelectedProject(null)
      alert('Work approved and project completed!')
    } catch (error) {
      console.error('Error approving work:', error)
      alert('Failed to approve work')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRequestChanges = async (projectId: string, feedback: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/request-changes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to request changes')
        return
      }

      await fetchProjects()
      setSelectedProject(null)
      alert('Changes requested. Expert will be notified.')
    } catch (error) {
      console.error('Error requesting changes:', error)
      alert('Failed to request changes')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-96">
          <Text variant="body" className="text-slate-600">Loading projects...</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Heading as="h1" className="text-2xl font-bold uppercase tracking-tight">
            Projects
          </Heading>
          <Text variant="body" className="text-slate-600">
            Manage your audio projects with Kanban board
          </Text>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.location.href = '/credits'}>
            💳 {userData.credits.toLocaleString()} Credits
          </Button>
          <Button variant="primary">
            <RiAddLine className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((column) => {
          const columnProjects = getProjectsByStatus(column.status)
          const colorClass = getStatusColor(column.status)

          return (
            <div key={column.status} className="flex flex-col space-y-4 min-w-[320px] w-[320px] flex-shrink-0">
              <div className="flex items-center justify-between rounded-md border-2 border-black bg-white p-3">
                <div className="flex items-center space-x-2">
                  <RiDraggable className="h-4 w-4 text-slate-600" />
                  <Heading as="h3" className="text-xs font-bold uppercase">
                    {column.label}
                  </Heading>
                </div>
                <ProjectStatusBadge status={column.status} showTooltip={false} className="text-xs" />
              </div>

              <div className={`space-y-3 rounded-md ${colorClass} p-3 min-h-[calc(100vh-300px)]`}>
                {columnProjects.map((project) => (
                  <Card
                    key={project.id}
                    variant="outlined"
                    className="cursor-pointer border-4 border-black bg-white p-4 transition-all hover:shadow-[4px_4px_0_0_#000]"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <Heading as="h3" className="font-bold uppercase text-sm flex-1">
                          {project.name}
                        </Heading>
                        <ProjectStatusBadge status={project.status} showTooltip={false} className="text-xs ml-2" />
                      </div>

                      {project.description && (
                        <Text variant="caption" className="text-xs text-slate-600 line-clamp-2">
                          {project.description}
                        </Text>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <Text variant="caption" className="text-slate-600">
                          {project.audioCount} audios
                        </Text>
                        {project.estimatedCost && (
                          <Text variant="caption" className="font-bold text-slate-900">
                            ${project.estimatedCost}
                          </Text>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {columnProjects.length === 0 && (
                  <div className="flex items-center justify-center rounded-md border-2 border-dashed border-black bg-white/50 p-8 text-center">
                    <Text variant="caption" className="text-xs text-slate-400">
                      No projects
                    </Text>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Project Details Sheet */}
      <Sheet open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <SheetContent className="w-[700px] sm:w-[700px] overflow-y-auto">
          {selectedProject && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <SheetTitle className="text-2xl">{selectedProject.name}</SheetTitle>
                    <SheetDescription>
                      {selectedProject.description || "No description provided"}
                    </SheetDescription>
                  </div>
                  <ProjectStatusBadge status={selectedProject.status} />
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Estimate Card */}
                {(selectedProject.status === "draft" ||
                  selectedProject.status === "waiting_for_estimate_accept" ||
                  selectedProject.status === "waiting_for_assignment") && (
                  <EstimateCard
                    projectId={selectedProject.id}
                    status={
                      selectedProject.status === "draft" ? "pending" :
                      selectedProject.status === "waiting_for_estimate_accept" ? "waiting" :
                      "accepted"
                    }
                    estimate={selectedProject.estimationData as EstimateData}
                    userCredits={userData.credits}
                    onGetEstimate={(request) => handleGetEstimate(selectedProject.id, request)}
                    onAcceptEstimate={() => handleAcceptEstimate(selectedProject.id)}
                    onRejectEstimate={(reason) => handleRejectEstimate(selectedProject.id, reason)}
                    loading={actionLoading}
                  />
                )}

                {/* Work Review Card */}
                {selectedProject.status === "in_review" && selectedProject.submittedAt && (
                  <WorkReviewCard
                    projectId={selectedProject.id}
                    submittedWork={{
                      audioIds: selectedProject.estimationData?.submittedAudioIds || [],
                      audios: selectedProject.projectAudios?.map(pa => pa.audio),
                      notes: selectedProject.estimationData?.submissionNotes,
                      submittedAt: selectedProject.submittedAt,
                    } as SubmittedWork}
                    expertName={selectedProject.expertName || "Expert"}
                    expertRating={selectedProject.expertRating || undefined}
                    onApprove={(rating, feedback) => handleApproveWork(selectedProject.id, rating, feedback)}
                    onRequestChanges={(feedback) => handleRequestChanges(selectedProject.id, feedback)}
                    loading={actionLoading}
                  />
                )}

                <Separator />

                {/* Audios Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Heading as="h3" className="text-lg font-bold uppercase">
                      Project Audios ({selectedProject.audioCount})
                    </Heading>
                  </div>
                  <div className="space-y-3 rounded-md border-4 border-black bg-white p-4">
                    {selectedProject.projectAudios && selectedProject.projectAudios.length > 0 ? (
                      selectedProject.projectAudios.map((pa, index) => (
                        <div key={pa.id} className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                          <div className="mb-2 flex items-center justify-between">
                            <Text variant="body" className="font-bold text-sm">
                              {index + 1}. {pa.audio.filename}
                            </Text>
                          </div>
                          <AudioPlayer audioUrl={pa.audio.audioUrl} />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-md border-2 border-dashed border-black bg-slate-50 p-6 text-center">
                        <Text variant="caption" className="text-xs text-slate-400">
                          No audios in this project yet
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
