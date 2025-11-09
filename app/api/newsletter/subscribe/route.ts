import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = SubscribeSchema.parse(body)

    // Check if email already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 400 }
        )
      }

      // Reactivate if previously unsubscribed
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          status: 'active',
          subscribedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Successfully resubscribed to newsletter',
      })
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        status: 'active',
        source: 'popup',
        subscribedAt: new Date(),
      },
    })

    // TODO: Integrate with email service (Mailchimp, SendGrid, etc.)
    // Example:
    // await fetch('https://api.mailchimp.com/3.0/lists/YOUR_LIST_ID/members', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: 'subscribed',
    //   }),
    // })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid email address',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      {
        error: 'Failed to subscribe',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
