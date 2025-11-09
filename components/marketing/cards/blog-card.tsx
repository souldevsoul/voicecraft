import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  excerpt: string
  image?: string
  date?: string
  readTime?: string
  category?: string
  href: string
}

const BlogCard = React.forwardRef<HTMLDivElement, BlogCardProps>(
  ({ title, excerpt, image, date, readTime, category, href, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="default"
        padding="none"
        hover="lift"
        className={cn("h-full overflow-hidden cursor-pointer group", className)}
        onClick={() => window.location.href = href}
        {...props}
      >
        {/* Image */}
        {image && (
          <div className="aspect-[16/9] overflow-hidden bg-slate-200">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <CardContent className="p-6">
          {/* Category */}
          {category && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-bold text-black bg-yellow-400 border-2 border-black uppercase">
                {category}
              </span>
            </div>
          )}

          {/* Title */}
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-xl line-clamp-2 group-hover:text-yellow-500 transition-colors">
              {title}
            </CardTitle>
          </CardHeader>

          {/* Excerpt */}
          <CardDescription className="text-base line-clamp-3 mb-4">
            {excerpt}
          </CardDescription>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
            )}
            {readTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
            )}
          </div>

          {/* Read More Link */}
          <div className="mt-4 flex items-center gap-2 text-black font-bold uppercase group-hover:gap-3 transition-all">
            <span>Read More</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    )
  }
)
BlogCard.displayName = "BlogCard"

export { BlogCard }
