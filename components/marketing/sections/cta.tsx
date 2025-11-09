import * as React from "react"
import { Container } from "@/components/ui/container"
import { Heading, Text } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CTAProps extends React.HTMLAttributes<HTMLElement> {
  headline: string
  description: string
  primaryCta?: {
    text: string
    href?: string
    onClick?: () => void
  }
  secondaryCta?: {
    text: string
    href?: string
    onClick?: () => void
  }
  variant?: "default" | "gradient" | "minimal"
}

const CTA = React.forwardRef<HTMLElement, CTAProps>(
  ({
    headline,
    description,
    primaryCta,
    secondaryCta,
    variant = "gradient",
    className,
    ...props
  }, ref) => {
    const bgClasses = {
      default: "bg-white",
      gradient: "bg-gradient-primary",
      minimal: "bg-slate-50",
    }

    const textClasses = {
      default: "text-slate-900",
      gradient: "text-white",
      minimal: "text-slate-900",
    }

    const descriptionClasses = {
      default: "text-slate-600",
      gradient: "text-white/90",
      minimal: "text-slate-600",
    }

    return (
      <section
        ref={ref}
        className={cn(
          "py-20 md:py-32",
          bgClasses[variant],
          className
        )}
        {...props}
      >
        <Container maxWidth="lg">
          <div className="text-center">
            {/* Headline */}
            <Heading
              variant="h2"
              className={cn("mb-6", textClasses[variant])}
            >
              {headline}
            </Heading>

            {/* Description */}
            <Text
              variant="lead"
              className={cn("mb-10 max-w-2xl mx-auto", descriptionClasses[variant])}
            >
              {description}
            </Text>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryCta && (
                <Button
                  variant={variant === "gradient" ? "secondary" : "primary"}
                  size="xl"
                  onClick={primaryCta.onClick}
                  asChild={!!primaryCta.href}
                >
                  {primaryCta.href ? (
                    <a href={primaryCta.href}>{primaryCta.text}</a>
                  ) : (
                    primaryCta.text
                  )}
                </Button>
              )}
              {secondaryCta && (
                <Button
                  variant="outline"
                  size="xl"
                  onClick={secondaryCta.onClick}
                  asChild={!!secondaryCta.href}
                  className={variant === "gradient" ? "border-white text-white hover:bg-white/10" : ""}
                >
                  {secondaryCta.href ? (
                    <a href={secondaryCta.href}>{secondaryCta.text}</a>
                  ) : (
                    secondaryCta.text
                  )}
                </Button>
              )}
            </div>
          </div>
        </Container>
      </section>
    )
  }
)
CTA.displayName = "CTA"

export { CTA }
