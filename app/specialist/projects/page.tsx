"use client"

import { useState, useEffect } from "react"
import { RiFilterLine, RiSearchLine } from "react-icons/ri"
import { Text, Heading } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { SpecialistProjectCard, ProjectStatusBadge, type ProjectStatus } from "@/components/project"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SpecialistProject = {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  estimatedCost: number | null
  estimatedDuration: number | null
  deadline: string | null
  assignedAt: string | null
  audioCount: number
  clientName: string
}

export default function SpecialistProjectsPage() {
  const [projects, setProjects] = useState<SpecialistProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      // TODO: Replace with real API call to GET /api/specialist/projects
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      // const response = await fetch(`${baseUrl}/api/specialist/projects`, {
      //   cache: 'no-store',
      // })

      // For now, using empty array until API is implemented
      setProjects([])
    } catch (error) {
      console.error('Error fetching specialist projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = !searchQuery ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || project.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const projectsByStatus = {
    assigned: filteredProjects.filter(p => p.status === "assigned"),
    in_review: filteredProjects.filter(p => p.status === "in_review"),
    completed: filteredProjects.filter(p => p.status === "completed"),
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
          <Heading variant="h2" className="text-3xl font-bold uppercase tracking-tight">
            MY PROJECTS
          </Heading>
          <Text variant="body" className="text-slate-600">
            View and manage your assigned projects
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <ProjectStatusBadge status="assigned" showTooltip={false} />
          <Text variant="body" className="font-bold">
            {projectsByStatus.assigned.length} Active
          </Text>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <RiSearchLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search projects, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-2 border-black pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] border-2 border-black">
            <RiFilterLine className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="border-2 border-black">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Sections */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-8">
          {/* Active Projects */}
          {projectsByStatus.assigned.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Heading variant="h3" className="text-xl font-bold uppercase">
                  ACTIVE PROJECTS
                </Heading>
                <ProjectStatusBadge status="assigned" showTooltip={false} />
                <Text variant="body" className="text-slate-600">
                  ({projectsByStatus.assigned.length})
                </Text>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projectsByStatus.assigned.map((project) => (
                  <SpecialistProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    description={project.description || undefined}
                    status={project.status}
                    clientName={project.clientName}
                    estimatedDuration={project.estimatedDuration || undefined}
                    estimatedCost={project.estimatedCost || undefined}
                    deadline={project.deadline || undefined}
                    audioCount={project.audioCount}
                    assignedAt={project.assignedAt || undefined}
                    onClick={() => window.location.href = `/specialist/projects/${project.id}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* In Review */}
          {projectsByStatus.in_review.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Heading variant="h3" className="text-xl font-bold uppercase">
                  IN REVIEW
                </Heading>
                <ProjectStatusBadge status="in_review" showTooltip={false} />
                <Text variant="body" className="text-slate-600">
                  ({projectsByStatus.in_review.length})
                </Text>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projectsByStatus.in_review.map((project) => (
                  <SpecialistProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    description={project.description || undefined}
                    status={project.status}
                    clientName={project.clientName}
                    estimatedDuration={project.estimatedDuration || undefined}
                    estimatedCost={project.estimatedCost || undefined}
                    deadline={project.deadline || undefined}
                    audioCount={project.audioCount}
                    assignedAt={project.assignedAt || undefined}
                    onClick={() => window.location.href = `/specialist/projects/${project.id}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {projectsByStatus.completed.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Heading variant="h3" className="text-xl font-bold uppercase">
                  COMPLETED
                </Heading>
                <ProjectStatusBadge status="completed" showTooltip={false} />
                <Text variant="body" className="text-slate-600">
                  ({projectsByStatus.completed.length})
                </Text>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projectsByStatus.completed.map((project) => (
                  <SpecialistProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    description={project.description || undefined}
                    status={project.status}
                    clientName={project.clientName}
                    estimatedDuration={project.estimatedDuration || undefined}
                    estimatedCost={project.estimatedCost || undefined}
                    deadline={project.deadline || undefined}
                    audioCount={project.audioCount}
                    assignedAt={project.assignedAt || undefined}
                    onClick={() => window.location.href = `/specialist/projects/${project.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md border-4 border-dashed border-black bg-slate-50 p-12 text-center">
          <Text variant="body" className="text-slate-600">
            {searchQuery || statusFilter !== "all"
              ? "No projects match your filters"
              : "No projects assigned yet"}
          </Text>
          {(searchQuery || statusFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-2"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
              }}
            >
              CLEAR FILTERS
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
