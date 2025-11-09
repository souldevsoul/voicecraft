import * as React from "react"
import { Container } from "@/components/ui/container"
import { Heading, Text } from "@/components/ui/typography"
import { PricingCard, type PricingCardProps } from "../cards/pricing-card"
import { cn } from "@/lib/utils"

export interface PricingProps extends React.HTMLAttributes<HTMLElement> {
  headline: string
  subheadline?: string
  plans: Omit<PricingCardProps, "ref">[]
}

const Pricing = React.forwardRef<HTMLElement, PricingProps>(
  ({ headline, subheadline, plans, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("py-20 md:py-32 bg-slate-50", className)}
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

          {/* Pricing Cards Grid */}
          <div className={cn(
            "grid gap-8 max-w-5xl mx-auto",
            plans.length === 2 && "md:grid-cols-2",
            plans.length === 3 && "md:grid-cols-3",
            plans.length === 4 && "md:grid-cols-2 lg:grid-cols-4"
          )}>
            {plans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>

          {/* Bottom Note */}
          <div className="text-center mt-12">
            <Text variant="body-sm" className="text-slate-600">
              All plans include 14-day free trial. No credit card required.
            </Text>
          </div>
        </Container>
      </section>
    )
  }
)
Pricing.displayName = "Pricing"

export { Pricing }
