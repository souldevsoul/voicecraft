import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { createSubscription } from "@/lib/subscriptions"

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  plan: z.enum(['starter', 'pro']).optional().default('starter'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = RegisterSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        credits: 1000, // Give 1000 credits ($10) to new users as welcome bonus
      },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        createdAt: true,
      },
    })

    // Create subscription based on selected plan
    const startTrial = validatedData.plan === 'pro' // Start trial for Pro plan
    await createSubscription(user.id, validatedData.plan, startTrial)

    const message = validatedData.plan === 'pro'
      ? "Account created successfully! Your 14-day Pro trial has started. You also received 1000 credits ($10) as a welcome bonus."
      : "Account created successfully! You received 1000 credits ($10) as a welcome bonus."

    return NextResponse.json({
      success: true,
      user,
      message,
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    // Generic error
    return NextResponse.json(
      {
        error: "An error occurred during registration",
        message: error.message,
      },
      { status: 500 }
    )
  }
}
