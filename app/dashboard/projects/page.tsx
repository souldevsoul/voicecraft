"use client"

import { useState, useEffect } from "react"
import { RiAddLine, RiDraggable, RiDeleteBinLine, RiEditLine, RiCloseLine } from "react-icons/ri"
import { notifications } from '@mantine/notifications'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Text, Heading } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ProjectStatusBadge,
  EstimateCard,
  WorkReviewCard,
  AssignExpertCard,
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

type Audio = {
  id: string
  filename: string
  audioUrl: string
  duration: number | null
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
  const [audios, setAudios] = useState<Audio[]>([])
  const [userData, setUserData] = useState<UserData>({ id: "temp-user-id", credits: 100000 })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Create Project Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [newProjectPriority, setNewProjectPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [selectedAudioIds, setSelectedAudioIds] = useState<string[]>([])

  // Drag and Drop State
  const [draggedAudio, setDraggedAudio] = useState<Audio | null>(null)
  const [draggedProject, setDraggedProject] = useState<Project | null>(null)
  const [dragOverProject, setDragOverProject] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<ProjectStatus | null>(null)

  // Sheet State (separate to avoid hydration issues)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
    fetchUserData()
    fetchAudios()
  }, [])

  const fetchUserData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
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

  const fetchAudios = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/audios`, {
        cache: 'no-store',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.audios) {
          setAudios(data.audios)
        }
      }
    } catch (error) {
      console.error('Error fetching audios:', error)
    }
  }

  const fetchProjects = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
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

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please enter a project name',
        color: 'red',
      })
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription || undefined,
          priority: newProjectPriority,
          audioIds: selectedAudioIds.length > 0 ? selectedAudioIds : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        notifications.show({
          title: 'Error',
          message: data.error || 'Failed to create project',
          color: 'red',
        })
        return
      }

      await fetchProjects()
      setCreateDialogOpen(false)
      // Reset form
      setNewProjectName("")
      setNewProjectDescription("")
      setNewProjectPriority("medium")
      setSelectedAudioIds([])
      notifications.show({
        title: 'Success',
        message: 'Project created successfully!',
        color: 'green',
      })
    } catch (error) {
      console.error('Error creating project:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to create project',
        color: 'red',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return

    setActionLoading(true)
    setDeleteConfirmOpen(false)
    try {
      const response = await fetch(`/api/projects/${projectToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to delete project',
          color: 'red',
        })
        return
      }

      await fetchProjects()
      setSelectedProject(null)
      setSheetOpen(false)
      notifications.show({
        title: 'Success',
        message: 'Project deleted successfully!',
        color: 'green',
      })
    } catch (error) {
      console.error('Error deleting project:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete project',
        color: 'red',
      })
    } finally {
      setActionLoading(false)
      setProjectToDelete(null)
    }
  }

  const handleAddAudioToProject = async (projectId: string, audioId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/audios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioIds: [audioId] }),
      })

      if (!response.ok) {
        const error = await response.json()
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to add audio to project',
          color: 'red',
        })
        return
      }

      await fetchProjects()
      // Update selected project if it's open
      if (selectedProject && selectedProject.id === projectId) {
        const updatedProjects = projects.map(p => p.id === projectId ? { ...p, audioCount: p.audioCount + 1 } : p)
        const updatedProject = updatedProjects.find(p => p.id === projectId)
        if (updatedProject) {
          setSelectedProject(updatedProject)
        }
      }

      // Show success notification
      const project = projects.find(p => p.id === projectId)
      const audio = audios.find(a => a.id === audioId)
      if (project && audio) {
        notifications.show({
          title: 'Audio Added',
          message: `"${audio.filename}" added to "${project.name}"`,
          color: 'green',
        })
      }
    } catch (error) {
      console.error('Error adding audio to project:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to add audio to project',
        color: 'red',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter((project) => project.status === status)
  }

  // Drag and Drop Handlers for Audios
  const handleDragStart = (audio: Audio) => {
    setDraggedAudio(audio)
  }

  const handleDragOver = (e: React.DragEvent, projectId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverProject(projectId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation()
    setDragOverProject(null)
  }

  const handleDrop = async (e: React.DragEvent, projectId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverProject(null)

    if (draggedAudio) {
      await handleAddAudioToProject(projectId, draggedAudio.id)
      setDraggedAudio(null)
    }
  }

  // Drag and Drop Handlers for Projects
  const handleProjectDragStart = (project: Project) => {
    setDraggedProject(project)
  }

  const handleColumnDragOver = (e: React.DragEvent, status: ProjectStatus) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverColumn(status)
  }

  const handleColumnDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleColumnDrop = async (e: React.DragEvent, newStatus: ProjectStatus) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverColumn(null)

    if (draggedProject && draggedProject.status !== newStatus) {
      await handleUpdateProjectStatus(draggedProject.id, newStatus)
      setDraggedProject(null)
    }
  }

  const handleUpdateProjectStatus = async (projectId: string, newStatus: ProjectStatus) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to update project status',
          color: 'red',
        })
        return
      }

      await fetchProjects()
    } catch (error) {
      console.error('Error updating project status:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to update project status',
        color: 'red',
      })
    } finally {
      setActionLoading(false)
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
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to get estimate',
          color: 'red',
        })
        return
      }

      await fetchProjects()
      setSelectedProject(null)
      setSheetOpen(false)
      notifications.show({
        title: 'Success',
        message: 'Estimate generated successfully!',
        color: 'green',
      })
    } catch (error) {
      console.error('Error getting estimate:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to get estimate',
        color: 'red',
      })
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
          notifications.show({
            title: 'Insufficient Credits',
            message: `Needed: ${data.creditsNeeded} credits\nAvailable: ${data.creditsAvailable} credits\nShortfall: ${data.shortfall} credits ($${(data.shortfall / 100).toFixed(2)})`,
            color: 'orange',
            autoClose: 8000,
          })
        } else {
          notifications.show({
            title: 'Error',
            message: data.error || 'Failed to accept estimate',
            color: 'red',
          })
        }
        return
      }

      await fetchProjects()
      await fetchUserData() // Update credits
      setSelectedProject(null)
      setSheetOpen(false)
      notifications.show({
        title: 'Success',
        message: 'Estimate accepted and credits reserved!',
        color: 'green',
      })
    } catch (error) {
      console.error('Error accepting estimate:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to accept estimate',
        color: 'red',
      })
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
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to reject estimate',
          color: 'red',
        })
        return
      }

      await fetchProjects()
      setSelectedProject(null)
      setSheetOpen(false)
      notifications.show({
        title: 'Success',
        message: 'Estimate rejected',
        color: 'blue',
      })
    } catch (error) {
      console.error('Error rejecting estimate:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to reject estimate',
        color: 'red',
      })
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
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to approve work',
          color: 'red',
        })
        return
      }

      await fetchProjects()
      await fetchUserData() // Update credits
      setSelectedProject(null)
      setSheetOpen(false)
      notifications.show({
        title: 'Success',
        message: 'Work approved and project completed!',
        color: 'green',
      })
    } catch (error) {
      console.error('Error approving work:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to approve work',
        color: 'red',
      })
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
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to request changes',
          color: 'red',
        })
        return
      }

      await fetchProjects()
      setSelectedProject(null)
      setSheetOpen(false)
      notifications.show({
        title: 'Success',
        message: 'Changes requested. Expert will be notified.',
        color: 'blue',
      })
    } catch (error) {
      console.error('Error requesting changes:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to request changes',
        color: 'red',
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Expert assignment handler
  const handleAssignExpert = async (projectId: string, expertId: string, instructions: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId, instructions }),
      })

      if (!response.ok) {
        const error = await response.json()
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to assign expert',
          color: 'red',
        })
        return
      }

      const data = await response.json()
      await fetchProjects()
      setSelectedProject(null)
      setSheetOpen(false)
      notifications.show({
        title: 'Success',
        message: data.message || 'Expert assigned successfully!',
        color: 'green',
      })
    } catch (error) {
      console.error('Error assigning expert:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to assign expert',
        color: 'red',
      })
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
          <Card variant="outlined" className="px-4 py-2 border-4 border-black">
            <Text variant="body" className="font-bold">
              💳 {userData.credits.toLocaleString()} Credits
            </Text>
          </Card>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow">
                <RiAddLine className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] border-4 border-black">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold uppercase">Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new audio project. You can add audios now or later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Text variant="body" className="font-bold">Project Name *</Text>
                  <Input
                    placeholder="My Audio Project"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="border-2 border-black"
                  />
                </div>
                <div className="grid gap-2">
                  <Text variant="body" className="font-bold">Description</Text>
                  <Textarea
                    placeholder="Describe your project..."
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="border-2 border-black min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Text variant="body" className="font-bold">Priority</Text>
                  <Select value={newProjectPriority} onValueChange={(value: any) => setNewProjectPriority(value)}>
                    <SelectTrigger className="border-2 border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-black">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Text variant="body" className="font-bold">Add Audios (Optional)</Text>
                  <div className="border-2 border-black p-4 max-h-[200px] overflow-y-auto space-y-2">
                    {audios.length > 0 ? (
                      audios.map((audio) => (
                        <label key={audio.id} className="flex items-center gap-2 p-2 hover:bg-yellow-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAudioIds.includes(audio.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAudioIds([...selectedAudioIds, audio.id])
                              } else {
                                setSelectedAudioIds(selectedAudioIds.filter(id => id !== audio.id))
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <Text variant="body-sm">{audio.filename}</Text>
                        </label>
                      ))
                    ) : (
                      <Text variant="caption" className="text-slate-400 text-center">No audios available</Text>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  className="border-2 border-black"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={actionLoading}
                  className="bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold"
                >
                  {actionLoading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Available Audios for Drag & Drop */}
      {audios.length > 0 && (
        <Card variant="outlined" className="p-4 border-4 border-black bg-white">
          <div className="flex items-center justify-between mb-3">
            <Heading as="h3" className="text-sm font-bold uppercase">
              Available Audios (Drag to Projects)
            </Heading>
            <Text variant="caption" className="text-xs text-slate-600">
              {audios.length} audios
            </Text>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {audios.map((audio) => (
              <div
                key={audio.id}
                draggable
                onDragStart={() => handleDragStart(audio)}
                onDragEnd={() => setDraggedAudio(null)}
                className={`flex-shrink-0 w-48 p-3 border-2 border-black bg-white hover:bg-yellow-50 cursor-move transition-all ${
                  draggedAudio?.id === audio.id ? 'opacity-50 scale-95' : ''
                }`}
              >
                <Text variant="body-sm" className="font-bold truncate mb-1">
                  {audio.filename}
                </Text>
                <Text variant="caption" className="text-xs text-slate-600">
                  {audio.duration ? `${Math.round(audio.duration)}s` : 'Unknown duration'}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      )}

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

              <div
                className={`space-y-3 rounded-md ${colorClass} p-3 min-h-[calc(100vh-400px)] transition-all ${
                  dragOverColumn === column.status ? 'ring-4 ring-yellow-400 ring-offset-2' : ''
                }`}
                onDragOver={(e) => handleColumnDragOver(e, column.status)}
                onDragLeave={handleColumnDragLeave}
                onDrop={(e) => handleColumnDrop(e, column.status)}
              >
                {columnProjects.map((project) => (
                  <Card
                    key={project.id}
                    variant="outlined"
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation()
                      handleProjectDragStart(project)
                    }}
                    onDragEnd={(e) => {
                      e.stopPropagation()
                      setDraggedProject(null)
                    }}
                    className={`cursor-move border-4 border-black bg-white p-4 transition-all hover:shadow-[4px_4px_0_0_#000] ${
                      dragOverProject === project.id ? 'ring-4 ring-green-400 ring-offset-2 bg-green-50' : ''
                    } ${draggedProject?.id === project.id ? 'opacity-50' : ''}`}
                    onClick={(e) => {
                      // Don't open sheet if we're dragging
                      if (draggedAudio || draggedProject) return
                      setSelectedProject(project)
                      setSheetOpen(true)
                    }}
                    onDragOver={(e) => handleDragOver(e, project.id)}
                    onDragLeave={(e) => handleDragLeave(e)}
                    onDrop={(e) => handleDrop(e, project.id)}
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
                      {column.status === 'draft' ? 'Drop audios here or click + to create project' : 'No projects'}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Project Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => {
        setSheetOpen(open)
        if (!open) setSelectedProject(null)
      }}>
        <SheetContent className="w-full sm:w-[900px] sm:max-w-[900px] overflow-y-auto border-l-4 border-black">
          {selectedProject && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between pr-8">
                  <div className="flex-1">
                    <SheetTitle className="text-2xl uppercase">{selectedProject.name}</SheetTitle>
                    <SheetDescription>
                      {selectedProject.description || "No description provided"}
                    </SheetDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <ProjectStatusBadge status={selectedProject.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProject(selectedProject.id)
                      }}
                      disabled={actionLoading}
                      className="border-2 border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <RiDeleteBinLine className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6 px-2">
                {/* Estimate Card */}
                {(selectedProject.status === "draft" ||
                  selectedProject.status === "waiting_for_estimate_accept") && (
                  <EstimateCard
                    projectId={selectedProject.id}
                    status={
                      selectedProject.status === "draft" ? "pending" :
                      "waiting"
                    }
                    estimate={selectedProject.estimationData as EstimateData}
                    userCredits={userData.credits}
                    onGetEstimate={(request) => handleGetEstimate(selectedProject.id, request)}
                    onAcceptEstimate={() => handleAcceptEstimate(selectedProject.id)}
                    onRejectEstimate={(reason) => handleRejectEstimate(selectedProject.id, reason)}
                    loading={actionLoading}
                  />
                )}

                {/* Assign Expert Card */}
                {selectedProject.status === "waiting_for_assignment" && (
                  <AssignExpertCard
                    projectId={selectedProject.id}
                    onAssign={(expertId, instructions) => handleAssignExpert(selectedProject.id, expertId, instructions)}
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
                      selectedProject.projectAudios.map((pa, index) => {
                        if (!pa.audio) return null
                        return (
                          <div key={pa.id} className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                            <div className="mb-2 flex items-center justify-between">
                              <Text variant="body" className="font-bold text-sm">
                                {index + 1}. {pa.audio.filename}
                              </Text>
                            </div>
                            <AudioPlayer audioUrl={pa.audio.audioUrl} />
                          </div>
                        )
                      })
                    ) : (
                      <div className="rounded-md border-2 border-dashed border-black bg-slate-50 p-6 text-center">
                        <Text variant="caption" className="text-xs text-slate-400">
                          No audios in this project yet. Drag and drop audios from the list above!
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] border-4 border-black">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase">Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false)
                setProjectToDelete(null)
              }}
              className="border-2 border-black"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteProject}
              disabled={actionLoading}
              className="bg-red-500 text-white hover:bg-red-600 border-2 border-red-500 font-bold"
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
