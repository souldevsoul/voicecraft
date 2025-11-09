import * as React from "react"
import { Container } from "@/components/ui/container"
import { Heading, Text } from "@/components/ui/typography"
import { StatCard, type StatCardProps } from "../cards/stat-card"
import { cn } from "@/lib/utils"

export interface StatsProps extends React.HTMLAttributes<HTMLElement> {
  headline?: string
  subheadline?: string
  stats: Omit<StatCardProps, "ref">[]
  columns?: 2 | 3 | 4
}

const Stats = React.forwardRef<HTMLElement, StatsProps>(
  ({ headline, subheadline, stats, columns = 4, className, ...props }, ref) => {
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

          {/* Stats Grid */}
          <div className={cn(
            "grid gap-8",
            gridCols[columns]
          )}>
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </Container>
      </section>
    )
  }
)
Stats.displayName = "Stats"

export { Stats }
