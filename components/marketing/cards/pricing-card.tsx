import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface PricingFeature {
  text: string
  included: boolean
}

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  description: string
  price: string | number
  period?: string
  features: PricingFeature[]
  ctaText?: string
  ctaHref?: string
  onCtaClick?: () => void
  popular?: boolean
  variant?: "default" | "premium"
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({
    name,
    description,
    price,
    period = "month",
    features,
    ctaText = "Get Started",
    ctaHref,
    onCtaClick,
    popular = false,
    variant = "default",
    className,
    ...props
  }, ref) => {
    const isPremium = variant === "premium"

    return (
      <div className="relative">
        {popular && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
            <span className="bg-yellow-400 text-black text-sm font-bold px-4 py-1 border-2 border-black uppercase">
              Most Popular
            </span>
          </div>
        )}
        <Card
          ref={ref}
          variant={isPremium ? "gradient" : "elevated"}
          padding="lg"
          hover="glow"
          className={cn(
            "h-full relative",
            popular && "border-2 border-yellow-400",
            className
          )}
          {...props}
        >
          <CardHeader className="p-0 mb-6">
            <CardTitle className={cn("text-2xl mb-2", isPremium && "text-white")}>
              {name}
            </CardTitle>
            <CardDescription className={cn("text-base", isPremium && "text-white/90")}>
              {description}
            </CardDescription>
          </CardHeader>

          <div className="mb-8">
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-5xl font-bold",
                isPremium ? "text-white" : "text-slate-900"
              )}>
                {typeof price === 'number' ? `$${price}` : price}
              </span>
              {period && (
                <span className={cn(
                  "text-slate-600",
                  isPremium && "text-white/90"
                )}>
                  /{period}
                </span>
              )}
            </div>
          </div>

          <CardContent className="p-0 mb-8">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className={cn(
                    "w-5 h-5 mt-0.5 flex-shrink-0",
                    feature.included
                      ? isPremium ? "text-white" : "text-emerald-500"
                      : "text-slate-300"
                  )} />
                  <span className={cn(
                    "text-sm",
                    feature.included
                      ? isPremium ? "text-white" : "text-slate-700"
                      : "text-slate-400 line-through"
                  )}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="p-0">
            <Button
              variant={isPremium ? "secondary" : "primary"}
              size="lg"
              className="w-full"
              onClick={onCtaClick}
              asChild={!!ctaHref}
            >
              {ctaHref ? (
                <a href={ctaHref}>{ctaText}</a>
              ) : (
                ctaText
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
)
PricingCard.displayName = "PricingCard"

export { PricingCard }
