import * as React from "react"
import { Container } from "@/components/ui/container"
import { Heading, Text } from "@/components/ui/typography"
import { TestimonialCard, type TestimonialCardProps } from "../cards/testimonial-card"
import { cn } from "@/lib/utils"

export interface TestimonialsProps extends React.HTMLAttributes<HTMLElement> {
  headline: string
  subheadline?: string
  testimonials: Omit<TestimonialCardProps, "ref">[]
  columns?: 2 | 3
}

const Testimonials = React.forwardRef<HTMLElement, TestimonialsProps>(
  ({ headline, subheadline, testimonials, columns = 3, className, ...props }, ref) => {
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
          {/* Header */}
          <div className="text-center mb-16">
            <Heading variant="h2" gradient="primary" className="mb-4">
              {headline}
            </Heading>
            {subheadline && (
              <Text variant="lead" className="max-w-3xl mx-auto">
                {subheadline}
              </Text>
            )}
          </div>

          {/* Testimonials Grid */}
          <div className={cn(
            "grid gap-8",
            gridCols[columns]
          )}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </Container>
      </section>
    )
  }
)
Testimonials.displayName = "Testimonials"

export { Testimonials }
