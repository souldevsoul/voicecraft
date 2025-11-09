"use client"

import { RiUserLine, RiTimeLine, RiMoneyDollarCircleLine, RiArrowRightLine } from "react-icons/ri"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Text, Heading } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { ProjectStatusBadge, type ProjectStatus } from "./project-status-badge"

export interface SpecialistProjectCardProps {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  clientName: string
  estimatedDuration?: number // in hours
  estimatedCost?: number // in dollars
  deadline?: string
  audioCount: number
  assignedAt?: string
  onClick?: () => void
}

export function SpecialistProjectCard({
  id,
  name,
  description,
  status,
  clientName,
  estimatedDuration,
  estimatedCost,
  deadline,
  audioCount,
  assignedAt,
  onClick,
}: SpecialistProjectCardProps) {
  const getActionButton = () => {
    switch (status) {
      case "assigned":
        return (
          <Button variant="primary" size="sm" className="w-full" onClick={onClick}>
            <RiArrowRightLine className="mr-2 h-4 w-4" />
            START WORK
          </Button>
        )
      case "in_review":
        return (
          <Button variant="outline" size="sm" className="w-full border-2" onClick={onClick}>
            <RiArrowRightLine className="mr-2 h-4 w-4" />
            VIEW REVIEW
          </Button>
        )
      case "completed":
        return (
          <Button variant="ghost" size="sm" className="w-full" onClick={onClick}>
            <RiArrowRightLine className="mr-2 h-4 w-4" />
            VIEW DETAILS
          </Button>
        )
      default:
        return (
          <Button variant="outline" size="sm" className="w-full border-2" onClick={onClick}>
            <RiArrowRightLine className="mr-2 h-4 w-4" />
            VIEW
          </Button>
        )
    }
  }

  const isUrgent = deadline && new Date(deadline) < new Date(Date.now() + 24 * 60 * 60 * 1000)

  return (
    <Card
      variant="outlined"
      className={`cursor-pointer border-4 border-black bg-white p-4 transition-all hover:shadow-[4px_4px_0_0_#000] ${
        isUrgent ? "border-red-500 bg-red-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Heading variant="h3" className="font-bold uppercase text-sm line-clamp-1">
              {name}
            </Heading>
            {description && (
              <Text variant="caption" className="mt-1 text-xs text-slate-600 line-clamp-2">
                {description}
              </Text>
            )}
          </div>
          <ProjectStatusBadge status={status} showTooltip={false} className="ml-2 text-xs" />
        </div>

        {/* Client Info */}
        <div className="flex items-center gap-2 rounded-md border-2 border-black bg-slate-50 p-2">
          <RiUserLine className="h-4 w-4 text-slate-600" />
          <Text variant="body" className="text-xs font-bold">
            CLIENT: {clientName}
          </Text>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Estimated Duration */}
          {estimatedDuration && (
            <div className="rounded-md border-2 border-black bg-white p-2">
              <div className="flex items-center gap-1">
                <RiTimeLine className="h-3 w-3 text-slate-600" />
                <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                  DURATION
                </Text>
              </div>
              <Text variant="body" className="mt-1 text-sm font-bold">
                {estimatedDuration}h
              </Text>
            </div>
          )}

          {/* Estimated Cost */}
          {estimatedCost && (
            <div className="rounded-md border-2 border-black bg-white p-2">
              <div className="flex items-center gap-1">
                <RiMoneyDollarCircleLine className="h-3 w-3 text-slate-600" />
                <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                  PAYMENT
                </Text>
              </div>
              <Text variant="body" className="mt-1 text-sm font-bold">
                ${estimatedCost.toFixed(2)}
              </Text>
            </div>
          )}

          {/* Audio Count */}
          <div className="rounded-md border-2 border-black bg-white p-2">
            <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
              AUDIOS
            </Text>
            <Text variant="body" className="mt-1 text-sm font-bold">
              {audioCount} {audioCount === 1 ? "file" : "files"}
            </Text>
          </div>

          {/* Deadline or Assigned Date */}
          {deadline ? (
            <div
              className={`rounded-md border-2 p-2 ${
                isUrgent
                  ? "border-red-500 bg-red-100"
                  : "border-black bg-white"
              }`}
            >
              <Text
                variant="caption"
                className={`text-xs font-bold uppercase ${
                  isUrgent ? "text-red-900" : "text-slate-600"
                }`}
              >
                DEADLINE
              </Text>
              <Text
                variant="body"
                className={`mt-1 text-xs font-bold ${
                  isUrgent ? "text-red-900" : ""
                }`}
              >
                {new Date(deadline).toLocaleDateString()}
              </Text>
              {isUrgent && (
                <Badge variant="danger" className="mt-1 text-xs">
                  URGENT
                </Badge>
              )}
            </div>
          ) : assignedAt ? (
            <div className="rounded-md border-2 border-black bg-white p-2">
              <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                ASSIGNED
              </Text>
              <Text variant="body" className="mt-1 text-xs font-bold">
                {new Date(assignedAt).toLocaleDateString()}
              </Text>
            </div>
          ) : null}
        </div>

        {/* Action Button */}
        {getActionButton()}
      </div>
    </Card>
  )
}
