import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/get-current-user'

// GET /api/experts - Get list of available experts
export async function GET(request: NextRequest) {
  try {
    // TODO: Get from session when auth is implemented
    // await requireAuth()

    // Get all available experts
    const experts = await prisma.expertProfile.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [
        { rating: 'desc' },
        { completedJobs: 'desc' },
      ],
    })

    return NextResponse.json({
      success: true,
      experts,
    })
  } catch (error: any) {
    console.error('Get experts error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
