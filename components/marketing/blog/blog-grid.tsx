import * as React from "react"
import { Container } from "@/components/ui/container"
import { Heading, Text } from "@/components/ui/typography"
import { BlogCard, type BlogCardProps } from "../cards/blog-card"
import { cn } from "@/lib/utils"

export interface BlogGridProps extends React.HTMLAttributes<HTMLElement> {
  headline?: string
  subheadline?: string
  posts: Omit<BlogCardProps, "ref">[]
  columns?: 2 | 3
}

const BlogGrid = React.forwardRef<HTMLElement, BlogGridProps>(
  ({ headline, subheadline, posts, columns = 3, className, ...props }, ref) => {
    const gridCols = {
      2: "md:grid-cols-2",
      3: "md:grid-cols-2 lg:grid-cols-3",
    }

    return (
      <section
        ref={ref}
        className={cn("py-20 md:py-32 bg-white", className)}
        {...props}
      >
        <Container maxWidth="xl">
          {/* Header (Optional) */}
          {(headline || subheadline) && (
            <div className="text-center mb-16">
              {headline && (
                <Heading variant="h2" gradient="primary" className="mb-4">
                  {headline}
                </Heading>
              )}
              {subheadline && (
                <Text variant="lead" className="max-w-3xl mx-auto">
                  {subheadline}
                </Text>
              )}
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className={cn(
            "grid gap-8",
            gridCols[columns]
          )}>
            {posts.map((post, index) => (
              <BlogCard key={index} {...post} />
            ))}
          </div>
        </Container>
      </section>
    )
  }
)
BlogGrid.displayName = "BlogGrid"

export { BlogGrid }
