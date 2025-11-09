"use client"

import {
  RiDraftLine,
  RiLoader4Line,
  RiTimeLine,
  RiUserAddLine,
  RiUserFollowLine,
  RiEyeLine,
  RiCheckboxCircleLine,
  RiRefund2Line,
  RiCloseCircleLine,
} from "react-icons/ri"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type ProjectStatus =
  | "draft"
  | "estimating"
  | "waiting_for_estimate_accept"
  | "waiting_for_assignment"
  | "assigned"
  | "in_review"
  | "completed"
  | "refunded"
  | "cancelled"

export interface ProjectStatusBadgeProps {
  status: ProjectStatus
  showTooltip?: boolean
  className?: string
}

interface StatusConfig {
  label: string
  variant: "default" | "primary" | "success" | "warning" | "danger" | "outline"
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
}

const STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  draft: {
    label: "DRAFT",
    variant: "default",
    icon: RiDraftLine,
    description: "Project is in draft status. Get an estimate to proceed.",
    color: "bg-slate-100 text-slate-900 border-slate-400",
  },
  estimating: {
    label: "ESTIMATING",
    variant: "primary",
    icon: RiLoader4Line,
    description: "AI is generating cost and time estimates for your project.",
    color: "bg-purple-100 text-purple-900 border-purple-500",
  },
  waiting_for_estimate_accept: {
    label: "ESTIMATE READY",
    variant: "warning",
    icon: RiTimeLine,
    description: "Estimate is ready. Review and accept to proceed.",
    color: "bg-yellow-100 text-yellow-900 border-yellow-500",
  },
  waiting_for_assignment: {
    label: "AWAITING EXPERT",
    variant: "warning",
    icon: RiUserAddLine,
    description: "Estimate accepted. Waiting for admin to assign an expert.",
    color: "bg-orange-100 text-orange-900 border-orange-500",
  },
  assigned: {
    label: "IN PROGRESS",
    variant: "primary",
    icon: RiUserFollowLine,
    description: "Expert is working on your project.",
    color: "bg-blue-100 text-blue-900 border-blue-500",
  },
  in_review: {
    label: "IN REVIEW",
    variant: "primary",
    icon: RiEyeLine,
    description: "Expert submitted work. Review and approve or request changes.",
    color: "bg-cyan-100 text-cyan-900 border-cyan-500",
  },
  completed: {
    label: "COMPLETED",
    variant: "success",
    icon: RiCheckboxCircleLine,
    description: "Project completed successfully.",
    color: "bg-green-100 text-green-900 border-green-500",
  },
  refunded: {
    label: "REFUNDED",
    variant: "danger",
    icon: RiRefund2Line,
    description: "Project was cancelled and credits were refunded.",
    color: "bg-red-100 text-red-900 border-red-500",
  },
  cancelled: {
    label: "CANCELLED",
    variant: "default",
    icon: RiCloseCircleLine,
    description: "Project was cancelled.",
    color: "bg-slate-100 text-slate-900 border-slate-400",
  },
}

export function ProjectStatusBadge({
  status,
  showTooltip = true,
  className = "",
}: ProjectStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  const badgeContent = (
    <Badge
      variant={config.variant}
      className={`inline-flex items-center gap-1.5 border-2 ${className}`}
    >
      <Icon className={`h-3 w-3 ${status === "estimating" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )

  if (!showTooltip) {
    return badgeContent
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent className="border-2 border-black bg-white">
          <p className="text-sm">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Export the status config for reuse
export function getStatusConfig(status: ProjectStatus): StatusConfig {
  return STATUS_CONFIG[status]
}

// Helper to get status color for Kanban columns
export function getStatusColor(status: ProjectStatus): string {
  return STATUS_CONFIG[status].color
}
