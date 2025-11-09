import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface IllustrationProps {
  src: string
  alt: string
  className?: string
  animated?: boolean
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeMap = {
  sm: "max-w-xs",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
}

export function Illustration({
  src,
  alt,
  className,
  animated = true,
  size = "md",
}: IllustrationProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full drop-shadow-2xl",
          sizeMap[size],
          animated && "animate-float"
        )}
      />
    </div>
  )
}
