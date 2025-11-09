"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react"

export type GenerationStatus = "queued" | "processing" | "completed" | "failed"

export interface GenerationStep {
  id: string
  label: string
  status: GenerationStatus
  progress?: number
}

export interface GenerationProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  status: GenerationStatus
  progress?: number
  steps?: GenerationStep[]
  message?: string
  estimatedTime?: number
  showSteps?: boolean
}

const GenerationProgress = React.forwardRef<HTMLDivElement, GenerationProgressProps>(
  ({
    status,
    progress = 0,
    steps = [],
    message,
    estimatedTime,
    showSteps = true,
    className,
    ...props
  }, ref) => {
    const getStatusConfig = (status: GenerationStatus) => {
      switch (status) {
        case "queued":
          return {
            icon: Clock,
            color: "text-slate-500",
            bgColor: "bg-slate-100",
            label: "Queued",
          }
        case "processing":
          return {
            icon: Loader2,
            color: "text-yellow-400",
            bgColor: "bg-yellow-400",
            label: "Processing",
            animate: true,
          }
        case "completed":
          return {
            icon: CheckCircle2,
            color: "text-black",
            bgColor: "bg-black",
            label: "Completed",
          }
        case "failed":
          return {
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-100",
            label: "Failed",
          }
        default:
          return {
            icon: Clock,
            color: "text-slate-500",
            bgColor: "bg-slate-100",
            label: "Queued",
          }
      }
    }

    const config = getStatusConfig(status)
    const Icon = config.icon

    return (
      <Card
        ref={ref}
        variant="elevated"
        padding="lg"
        className={cn("w-full", className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("p-2 rounded-full", config.bgColor)}>
            <Icon
              className={cn(
                "w-5 h-5",
                config.color,
                config.animate && "animate-spin"
              )}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{config.label}</h3>
            {message && (
              <p className="text-sm text-slate-600">{message}</p>
            )}
          </div>
          {estimatedTime && status === "processing" && (
            <div className="text-sm text-slate-500">
              ~{estimatedTime}s
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {(status === "processing" || status === "queued") && (
          <div className="mb-4">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  status === "processing"
                    ? "bg-gradient-primary"
                    : "bg-slate-400"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-500">Progress</span>
              <span className="text-xs font-semibold text-slate-700">
                {progress}%
              </span>
            </div>
          </div>
        )}

        {/* Steps */}
        {showSteps && steps.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-700 mb-2">
              Processing Steps
            </div>
            {steps.map((step, index) => {
              const stepConfig = getStatusConfig(step.status)
              const StepIcon = stepConfig.icon

              return (
                <div
                  key={step.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                >
                  <div className={cn("flex-shrink-0", stepConfig.color)}>
                    <StepIcon
                      className={cn(
                        "w-4 h-4",
                        stepConfig.animate && "animate-spin"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {step.label}
                    </div>
                    {step.progress !== undefined && step.status === "processing" && (
                      <div className="mt-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all duration-300"
                          style={{ width: `${step.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {step.status === "completed" && (
                    <div className="text-xs text-emerald-600 font-medium">
                      Done
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    )
  }
)
GenerationProgress.displayName = "GenerationProgress"

export { GenerationProgress }
