import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description: string
  iconColor?: string
  hover?: boolean
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon: Icon, title, description, iconColor = "text-black", hover = true, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="default"
        padding="lg"
        hover={hover ? "lift" : "none"}
        className={cn("h-full", className)}
        {...props}
      >
        {Icon && (
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-50 border-2 border-black">
              <Icon className={cn("w-6 h-6", iconColor)} />
            </div>
          </div>
        )}
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CardDescription className="text-base leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    )
  }
)
FeatureCard.displayName = "FeatureCard"

export { FeatureCard }
