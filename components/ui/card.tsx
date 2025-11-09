"use client"

import * as React from "react"
import { Card as MantineCard, CardSection as MantineCardSection, Paper, PaperProps } from "@mantine/core"
import { cn } from "@/lib/utils"

export interface CardProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  variant?: "default" | "elevated" | "outlined" | "ghost" | "gradient"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  hover?: "none" | "lift" | "glow"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = "default",
    padding = "md",
    hover = "none",
    className,
    children,
    ...props
  }, ref) => {

    // Map padding to Mantine values
    const paddingMap = {
      none: 0,
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    } as const

    // Variant styles
    const variantStyles = {
      default: {
        shadow: 'sm',
        withBorder: true,
      },
      elevated: {
        shadow: 'xl',
        withBorder: true,
      },
      outlined: {
        shadow: 'none',
        withBorder: true,
        style: { borderWidth: 2 },
      },
      ghost: {
        shadow: 'none',
        withBorder: true,
        style: { backgroundColor: 'var(--mantine-color-gray-0)' },
      },
      gradient: {
        shadow: 'lg',
        withBorder: true,
        style: {
          background: '#EAB308',
          color: '#000000',
          borderWidth: 4,
          borderColor: '#000000',
        },
      },
    }

    // Hover styles
    const hoverClasses = {
      none: '',
      lift: 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-300',
      glow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:border-yellow-400 transition-all duration-300',
    }

    const config = variantStyles[variant]

    return (
      <Paper
        ref={ref}
        {...config}
        p={paddingMap[padding]}
        radius="lg"
        className={cn(
          "transition-all duration-300",
          hoverClasses[hover],
          className
        )}
        {...props}
      >
        {children}
      </Paper>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-tight tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6 mt-6 border-t border-gray-200", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardSection = MantineCardSection

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardSection
}
