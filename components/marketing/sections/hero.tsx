import * as React from "react"
import { Container } from "@/components/ui/container"
import { Heading, Text } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  headline: string
  subheadline: string
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
  badge?: string
  children?: React.ReactNode
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({
    headline,
    subheadline,
    primaryCta,
    secondaryCta,
    badge,
    children,
    className,
    ...props
  }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-gradient-mesh py-20 md:py-32 lg:py-40",
          className
        )}
        {...props}
      >
        <Container maxWidth="xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              {badge && (
                <div className="mb-6 animate-fade-in">
                  <span className="inline-block px-4 py-2 text-sm font-bold text-black bg-yellow-400 border-2 border-black uppercase">
                    {badge}
                  </span>
                </div>
              )}

              {/* Headline */}
              <Heading
                variant="h1"
                gradient="primary"
                className="mb-6 animate-fade-in"
              >
                {headline}
              </Heading>

              {/* Subheadline */}
              <Text
                variant="lead"
                className="mb-8 text-slate-700 animate-fade-in"
              >
                {subheadline}
              </Text>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
                {primaryCta && (
                  <Button
                    variant="primary"
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
                    variant="secondary"
                    size="xl"
                    onClick={secondaryCta.onClick}
                    asChild={!!secondaryCta.href}
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

            {/* Right Column - Visual/Interactive Element */}
            {children && (
              <div className="relative animate-fade-in">
                {children}
              </div>
            )}
          </div>
        </Container>

        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-black rounded-full filter blur-3xl" />
        </div>
      </section>
    )
  }
)
Hero.displayName = "Hero"

export { Hero }
