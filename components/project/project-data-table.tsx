"use client"

import { useState } from "react"
import { RiSearchLine, RiFilterLine, RiEyeLine, RiMore2Line } from "react-icons/ri"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/typography"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProjectStatusBadge, type ProjectStatus } from "./project-status-badge"
import { RefundDialog } from "./refund-dialog"
import { ReEstimateDialog } from "./re-estimate-dialog"
import { Badge } from "@/components/ui/badge"

export interface ProjectTableRow {
  id: string
  name: string
  status: ProjectStatus
  clientName: string
  clientEmail: string
  expertName?: string
  estimatedCost?: number
  actualCost?: number
  createdAt: string
  assignedAt?: string
  completedAt?: string
  priority: "low" | "medium" | "high" | "urgent"
}

export interface ProjectDataTableProps {
  projects: ProjectTableRow[]
  onViewProject: (projectId: string) => void
  onAssignExpert?: (projectId: string) => void
  onRefund: (projectId: string, reason: string) => Promise<void>
  onReEstimate: (projectId: string, reason: string) => Promise<void>
  loading?: boolean
}

export function ProjectDataTable({
  projects,
  onViewProject,
  onAssignExpert,
  onRefund,
  onReEstimate,
  loading = false,
}: ProjectDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = !searchQuery ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.expertName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="danger" className="text-xs">URGENT</Badge>
      case "high":
        return <Badge variant="warning" className="text-xs">HIGH</Badge>
      case "medium":
        return <Badge variant="primary" className="text-xs">MEDIUM</Badge>
      case "low":
        return <Badge variant="outline" className="text-xs">LOW</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <RiSearchLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search by project name, client, or expert..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-2 border-black pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] border-2 border-black">
            <RiFilterLine className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-2 border-black">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="estimating">Estimating</SelectItem>
            <SelectItem value="waiting_for_estimate_accept">Estimate Ready</SelectItem>
            <SelectItem value="waiting_for_assignment">Awaiting Expert</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px] border-2 border-black">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="border-2 border-black">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border-4 border-black bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-black bg-slate-100">
              <TableHead className="font-bold uppercase">Project</TableHead>
              <TableHead className="font-bold uppercase">Status</TableHead>
              <TableHead className="font-bold uppercase">Client</TableHead>
              <TableHead className="font-bold uppercase">Expert</TableHead>
              <TableHead className="font-bold uppercase">Cost</TableHead>
              <TableHead className="font-bold uppercase">Priority</TableHead>
              <TableHead className="font-bold uppercase">Created</TableHead>
              <TableHead className="font-bold uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className="border-b border-slate-200 hover:bg-slate-50 cursor-pointer"
                  onClick={() => onViewProject(project.id)}
                >
                  <TableCell>
                    <Text variant="body" className="font-bold text-sm">
                      {project.name}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <ProjectStatusBadge status={project.status} showTooltip={false} className="text-xs" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <Text variant="body" className="text-sm font-bold">
                        {project.clientName}
                      </Text>
                      <Text variant="caption" className="text-xs text-slate-600">
                        {project.clientEmail}
                      </Text>
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.expertName ? (
                      <Text variant="body" className="text-sm">
                        {project.expertName}
                      </Text>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        UNASSIGNED
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {project.estimatedCost ? (
                      <div>
                        <Text variant="body" className="text-sm font-bold">
                          ${project.estimatedCost.toFixed(2)}
                        </Text>
                        {project.actualCost && (
                          <Text variant="caption" className="text-xs text-slate-600">
                            Actual: ${project.actualCost.toFixed(2)}
                          </Text>
                        )}
                      </div>
                    ) : (
                      <Text variant="caption" className="text-xs text-slate-400">
                        Not estimated
                      </Text>
                    )}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(project.priority)}
                  </TableCell>
                  <TableCell>
                    <Text variant="caption" className="text-xs text-slate-600">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </Text>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <RiMore2Line className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-2 border-black">
                        <DropdownMenuItem onClick={() => onViewProject(project.id)}>
                          <RiEyeLine className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        {project.status === "waiting_for_assignment" && onAssignExpert && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onAssignExpert(project.id)}>
                              Assign Expert
                            </DropdownMenuItem>
                          </>
                        )}

                        {(project.status === "waiting_for_estimate_accept" ||
                          project.status === "waiting_for_assignment" ||
                          project.status === "assigned") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <div>
                                <ReEstimateDialog
                                  projectId={project.id}
                                  projectName={project.name}
                                  clientName={project.clientName}
                                  currentEstimate={
                                    project.estimatedCost
                                      ? {
                                          cost: project.estimatedCost,
                                          duration: 0, // TODO: Add duration to table
                                        }
                                      : undefined
                                  }
                                  onReEstimate={(reason) => onReEstimate(project.id, reason)}
                                  loading={loading}
                                  trigger={
                                    <button className="w-full text-left text-sm">
                                      Re-Estimate Project
                                    </button>
                                  }
                                />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <div>
                                <RefundDialog
                                  projectId={project.id}
                                  projectName={project.name}
                                  clientName={project.clientName}
                                  reservedCredits={(project.estimatedCost || 0) * 100}
                                  onRefund={(reason) => onRefund(project.id, reason)}
                                  loading={loading}
                                  trigger={
                                    <button className="w-full text-left text-sm text-red-600">
                                      Refund Project
                                    </button>
                                  }
                                />
                              </div>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <Text variant="body" className="text-slate-600">
                    {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                      ? "No projects match your filters"
                      : "No projects found"}
                  </Text>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <Text variant="caption" className="text-xs text-slate-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </Text>
        {(searchQuery || statusFilter !== "all" || priorityFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("all")
              setPriorityFilter("all")
            }}
          >
            CLEAR FILTERS
          </Button>
        )}
      </div>
    </div>
  )
}
