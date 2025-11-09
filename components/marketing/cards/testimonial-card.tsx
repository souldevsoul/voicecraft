import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Quote, Star } from "lucide-react"

export interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string
  author: string
  role: string
  company?: string
  image?: string
  rating?: number
}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ quote, author, role, company, image, rating = 5, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="elevated"
        padding="lg"
        hover="lift"
        className={cn("h-full", className)}
        {...props}
      >
        <CardContent className="p-0">
          {/* Quote Icon */}
          <Quote className="w-10 h-10 text-yellow-400 mb-4" />

          {/* Rating */}
          {rating > 0 && (
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  )}
                />
              ))}
            </div>
          )}

          {/* Quote Text */}
          <blockquote className="text-slate-700 text-base leading-relaxed mb-6">
            "{quote}"
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center gap-4">
            {image && (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                <img
                  src={image}
                  alt={author}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-semibold text-slate-900">{author}</div>
              <div className="text-sm text-slate-600">
                {role}
                {company && <span> at {company}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)
TestimonialCard.displayName = "TestimonialCard"

export { TestimonialCard }
