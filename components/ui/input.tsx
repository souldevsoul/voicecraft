"use client"

import * as React from "react"
import { TextInput, TextInputProps, Textarea, TextareaProps } from "@mantine/core"
import { cn } from "@/lib/utils"

export interface InputProps extends Omit<TextInputProps, 'size' | 'variant'> {
  variant?: "default" | "error" | "success"
  inputSize?: "sm" | "md" | "lg"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = "default",
    inputSize = "md",
    className,
    ...props
  }, ref) => {

    // Map to Mantine sizes
    const sizeMap = {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    } as const

    // Error state
    const error = variant === 'error' ? true : undefined

    // Success styling
    const successStyles = variant === 'success' ? {
      input: {
        borderColor: 'var(--mantine-color-emerald-5)',
        '&:focus': {
          borderColor: 'var(--mantine-color-emerald-6)',
        },
      },
    } : {}

    return (
      <TextInput
        ref={ref}
        size={sizeMap[inputSize]}
        error={error}
        radius="md"
        className={cn(
          "transition-all duration-200",
          "focus-within:shadow-md",
          className
        )}
        styles={(theme) => ({
          input: {
            fontSize: inputSize === 'sm' ? '0.875rem' : inputSize === 'lg' ? '1rem' : '0.9375rem',
            height: inputSize === 'sm' ? 36 : inputSize === 'lg' ? 56 : 44,
            ...successStyles.input,
          },
        })}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export interface TextareaInputProps extends Omit<TextareaProps, 'size' | 'variant'> {
  variant?: "default" | "error" | "success"
  inputSize?: "sm" | "md" | "lg"
}

const TextareaInput = React.forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({
    variant = "default",
    inputSize = "md",
    className,
    ...props
  }, ref) => {

    // Map to Mantine sizes
    const sizeMap = {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    } as const

    // Error state
    const error = variant === 'error' ? true : undefined

    // Success styling
    const successStyles = variant === 'success' ? {
      input: {
        borderColor: 'var(--mantine-color-emerald-5)',
        '&:focus': {
          borderColor: 'var(--mantine-color-emerald-6)',
        },
      },
    } : {}

    return (
      <Textarea
        ref={ref}
        size={sizeMap[inputSize]}
        error={error}
        radius="md"
        className={cn(
          "transition-all duration-200",
          "focus-within:shadow-md",
          className
        )}
        styles={{
          input: {
            fontSize: inputSize === 'sm' ? '0.875rem' : inputSize === 'lg' ? '1rem' : '0.9375rem',
            minHeight: inputSize === 'sm' ? 80 : inputSize === 'lg' ? 120 : 100,
            ...successStyles.input,
          },
        }}
        {...props}
      />
    )
  }
)

TextareaInput.displayName = "TextareaInput"

export { Input, TextareaInput }
