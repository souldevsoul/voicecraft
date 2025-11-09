import * as React from "react"
import { Container } from "@/components/ui/container"
import { Heading, Text } from "@/components/ui/typography"
import { FeatureCard, type FeatureCardProps } from "../cards/feature-card"
import { cn } from "@/lib/utils"

export interface FeaturesProps extends React.HTMLAttributes<HTMLElement> {
  headline: string
  subheadline?: string
  features: Omit<FeatureCardProps, "ref">[]
  columns?: 2 | 3 | 4
}

const Features = React.forwardRef<HTMLElement, FeaturesProps>(
  ({ headline, subheadline, features, columns = 3, className, ...props }, ref) => {
    const gridCols = {
      2: "md:grid-cols-2",
      3: "md:grid-cols-2 lg:grid-cols-3",
      4: "md:grid-cols-2 lg:grid-cols-4",
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

          {/* Features Grid */}
          <div className={cn(
            "grid gap-8",
            gridCols[columns]
          )}>
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </Container>
      </section>
    )
  }
)
Features.displayName = "Features"

export { Features }
