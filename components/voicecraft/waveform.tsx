"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface WaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  bars?: number
  animated?: boolean
  color?: "primary" | "secondary" | "success"
  size?: "sm" | "md" | "lg"
}

const Waveform = React.forwardRef<HTMLDivElement, WaveformProps>(
  ({ bars = 40, animated = true, color = "primary", size = "md", className, ...props }, ref) => {
    const heights = React.useMemo(() => {
      return Array.from({ length: bars }, () => Math.random() * 100 + 20)
    }, [bars])

    const colorClasses = {
      primary: "bg-yellow-400",
      secondary: "bg-black",
      success: "bg-emerald-500",
    }

    const sizeClasses = {
      sm: "h-16",
      md: "h-32",
      lg: "h-48",
    }

    const barWidths = {
      sm: "w-0.5",
      md: "w-1",
      lg: "w-1.5",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-0.5 md:gap-1",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {heights.map((height, index) => (
          <div
            key={index}
            className={cn(
              "rounded-full transition-all",
              colorClasses[color],
              barWidths[size],
              animated && "animate-wave"
            )}
            style={{
              height: `${height}%`,
              animationDelay: `${index * 0.05}s`,
            }}
          />
        ))}
      </div>
    )
  }
)
Waveform.displayName = "Waveform"

export { Waveform }
