import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number
  label: string
  icon?: LucideIcon
  trend?: {
    value: string
    direction: "up" | "down"
  }
  description?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ value, label, icon: Icon, trend, description, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="elevated"
        padding="lg"
        className={cn("text-center", className)}
        {...props}
      >
        <CardContent className="p-0">
          {/* Icon */}
          {Icon && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-50 border-2 border-black">
                <Icon className="w-6 h-6 text-black" />
              </div>
            </div>
          )}

          {/* Value */}
          <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
            {value}
          </div>

          {/* Label */}
          <div className="text-lg font-semibold text-slate-900 mb-2">
            {label}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-slate-600">
              {description}
            </p>
          )}

          {/* Trend */}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 mt-3 text-sm font-semibold",
              trend.direction === "up" ? "text-emerald-600" : "text-rose-600"
            )}>
              <span>{trend.direction === "up" ? "↑" : "↓"}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard }
