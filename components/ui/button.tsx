"use client"

import * as React from "react"
import { Button as MantineButton, ButtonProps as MantineButtonProps } from "@mantine/core"
import { cn } from "@/lib/utils"

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  size?: "sm" | "md" | "lg" | "xl" | "icon"
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = "primary",
    size = "md",
    fullWidth,
    loading,
    leftIcon,
    rightIcon,
    asChild,
    className,
    children,
    ...props
  }, ref) => {

    // Map our custom sizes to Mantine sizes + custom styles
    const sizeMap = {
      sm: { size: 'sm' as const, h: 36, px: 16 },
      md: { size: 'md' as const, h: 44, px: 24 },
      lg: { size: 'lg' as const, h: 56, px: 32 },
      xl: { size: 'xl' as const, h: 64, px: 40 },
      icon: { size: 'md' as const, h: 44, px: 0 },
    }

    const sizeConfig = sizeMap[size]

    // Custom variant styles - Brutalist Black/White/Yellow
    const variantStyles = {
      primary: {
        variant: 'filled' as const,
        color: 'yellow',
        style: {
          backgroundColor: '#EAB308',
          color: '#000000',
          borderWidth: 4,
          borderColor: '#000000',
          fontWeight: 700,
          textTransform: 'uppercase' as const,
        },
      },
      secondary: {
        variant: 'outline' as const,
        color: 'dark',
        style: {
          borderWidth: 4,
          borderColor: '#000000',
          color: '#000000',
          backgroundColor: '#FFFFFF',
          fontWeight: 700,
          textTransform: 'uppercase' as const,
        },
      },
      outline: {
        variant: 'outline' as const,
        color: 'dark',
        style: {
          borderWidth: 4,
          borderColor: '#000000',
          color: '#000000',
          fontWeight: 700,
          textTransform: 'uppercase' as const,
        },
      },
      ghost: {
        variant: 'subtle' as const,
        color: 'dark',
        style: {
          borderWidth: 4,
          borderColor: 'transparent',
          fontWeight: 700,
          textTransform: 'uppercase' as const,
        },
      },
      destructive: {
        variant: 'filled' as const,
        color: 'red',
        style: {
          borderWidth: 4,
          borderColor: '#000000',
          fontWeight: 700,
          textTransform: 'uppercase' as const,
        },
      },
      link: {
        variant: 'transparent' as const,
        color: 'dark',
        style: {
          textDecoration: 'underline',
          textUnderlineOffset: 4,
          fontWeight: 700,
        },
      },
    }

    const variantConfig = variantStyles[variant]

    // If asChild is true, just render the children directly with styling
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(
          "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200",
          "hover:scale-[1.02] active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2",
          variant === 'primary' && "bg-yellow-400 text-black border-4 border-black uppercase",
          className,
          (children as any).props.className
        ),
        style: {
          height: size === 'icon' ? sizeConfig.h : undefined,
          width: size === 'icon' ? sizeConfig.h : undefined,
          paddingLeft: size !== 'icon' ? sizeConfig.px : 0,
          paddingRight: size !== 'icon' ? sizeConfig.px : 0,
          ...(children as any).props.style,
        },
      })
    }

    return (
      <MantineButton
        ref={ref}
        {...variantConfig}
        size={sizeConfig.size}
        fullWidth={fullWidth}
        loading={loading}
        leftSection={leftIcon}
        rightSection={rightIcon}
        className={cn(
          // Base styles
          "font-bold transition-all duration-200",
          // Hover effects
          "hover:scale-[1.02] active:scale-[0.98]",
          // Focus styles - Yellow ring for brutalist design
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2",
          className
        )}
        styles={{
          root: {
            height: size === 'icon' ? sizeConfig.h : undefined,
            width: size === 'icon' ? sizeConfig.h : undefined,
            paddingLeft: size !== 'icon' ? sizeConfig.px : 0,
            paddingRight: size !== 'icon' ? sizeConfig.px : 0,
          },
        }}
        {...props}
      >
        {children}
      </MantineButton>
    )
  }
)

Button.displayName = "Button"

export { Button }
