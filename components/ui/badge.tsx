import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border-2 border-black px-2.5 py-0.5 text-xs font-bold uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black hover:bg-slate-50",
        primary:
          "bg-yellow-400 text-black hover:bg-yellow-500",
        success:
          "bg-green-400 text-black hover:bg-green-500",
        warning:
          "bg-orange-400 text-black hover:bg-orange-500",
        danger:
          "bg-red-400 text-black hover:bg-red-500",
        outline:
          "bg-transparent text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
