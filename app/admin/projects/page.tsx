"use client"

import { useState, useEffect } from "react"
import { Text, Heading } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { RiRefreshLine, RiDownload2Line } from "react-icons/ri"
import { ProjectDataTable, type ProjectTableRow } from "@/components/project"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectTableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

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

      // Map API response to table format
      const mappedProjects: ProjectTableRow[] = data.projects.map((project: any) => ({
        id: project.id,
        name: project.name,
        status: project.status,
        clientName: project.user?.name || "Unknown",
        clientEmail: project.user?.email || "",
        expertName: project.expert?.user?.name,
        estimatedCost: project.estimatedCost,
        actualCost: project.actualCost,
        createdAt: project.createdAt,
        assignedAt: project.assignedAt,
        completedAt: project.completedAt,
        priority: project.priority || "medium",
      }))

      setProjects(mappedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewProject = (projectId: string) => {
    window.location.href = `/dashboard/projects` // Or create /admin/projects/[id]
  }

  const handleAssignExpert = (projectId: string) => {
    // TODO: Implement assign expert dialog
    alert(`Assign expert to project ${projectId}`)
  }

  const handleRefund = async (projectId: string, reason: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to refund project')
        return
      }

      await fetchProjects()
      alert('Project refunded successfully!')
    } catch (error) {
      console.error('Error refunding project:', error)
      alert('Failed to refund project')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReEstimate = async (projectId: string, reason: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/re-estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to re-estimate project')
        return
      }

      await fetchProjects()
      alert('Re-estimation completed successfully!')
    } catch (error) {
      console.error('Error re-estimating project:', error)
      alert('Failed to re-estimate project')
    } finally {
      setActionLoading(false)
    }
  }

  const handleExportData = () => {
    // TODO: Implement CSV export
    alert('Export functionality coming soon!')
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
            PROJECT MANAGEMENT
          </Heading>
          <Text variant="body" className="text-slate-600">
            View and manage all platform projects
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-2"
            onClick={fetchProjects}
            disabled={loading}
          >
            <RiRefreshLine className="mr-2 h-4 w-4" />
            REFRESH
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-2"
            onClick={handleExportData}
          >
            <RiDownload2Line className="mr-2 h-4 w-4" />
            EXPORT CSV
          </Button>
        </div>
      </div>

      {/* Projects Table */}
      <ProjectDataTable
        projects={projects}
        onViewProject={handleViewProject}
        onAssignExpert={handleAssignExpert}
        onRefund={handleRefund}
        onReEstimate={handleReEstimate}
        loading={actionLoading}
      />
    </div>
  )
}
