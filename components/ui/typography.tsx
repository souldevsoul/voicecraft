import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva("font-bold tracking-tight", {
  variants: {
    variant: {
      h1: "text-2xl leading-tight",
      h2: "text-xl leading-tight",
      h3: "text-lg leading-snug",
      h4: "text-base leading-snug",
      h5: "text-sm leading-normal",
      h6: "text-sm leading-normal",
    },
    gradient: {
      none: "text-slate-900",
      primary: "text-gradient",
      hero: "text-gradient-hero",
    },
  },
  defaultVariants: {
    variant: "h1",
    gradient: "none",
  },
})

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant = "h1", gradient, as, children, ...props }, ref) => {
    const Comp = as || variant || "h1"
    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ variant, gradient, className }))}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Heading.displayName = "Heading"

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-base leading-relaxed",
      "body-lg": "text-lg leading-relaxed",
      "body-sm": "text-sm leading-normal",
      caption: "text-xs leading-normal",
      lead: "text-xl md:text-2xl leading-relaxed text-slate-600",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body",
    weight: "normal",
  },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div"
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, weight, as = "p", children, ...props }, ref) => {
    const Comp = as
    return (
      <Comp
        ref={ref}
        className={cn(textVariants({ variant, weight, className }))}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Text.displayName = "Text"

export { Heading, Text, headingVariants, textVariants }
