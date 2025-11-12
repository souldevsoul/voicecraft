import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/get-current-user'

// Validation schema
const AssignExpertSchema = z.object({
  expertId: z.string().cuid(),
  instructions: z.string().min(10).max(5000),
})

// POST /api/projects/[id]/assign - Assign expert to project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth()
    const resolvedParams = await params
    const projectId = resolvedParams.id

    // Parse and validate request body
    const body = await request.json()
    const { expertId, instructions } = AssignExpertSchema.parse(body)

    // Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if project is in correct status (waiting_for_assignment)
    if (project.status !== 'waiting_for_assignment') {
      return NextResponse.json(
        {
          error: 'Invalid project status',
          details: 'Project must be in "waiting_for_assignment" status to assign an expert',
        },
        { status: 400 }
      )
    }

    // Check if expert exists and is available
    const expert = await prisma.expertProfile.findUnique({
      where: { id: expertId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!expert) {
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      )
    }

    if (!expert.isAvailable) {
      return NextResponse.json(
        {
          error: 'Expert not available',
          details: 'This expert is currently not accepting new projects',
        },
        { status: 400 }
      )
    }

    // Assign expert to project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        expertId,
        instructions,
        status: 'assigned',
        assignedAt: new Date(),
      },
      include: {
        projectAudios: {
          include: {
            audio: {
              select: {
                id: true,
                filename: true,
                duration: true,
                audioUrl: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        expert: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            projectAudios: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: `Project assigned to ${expert.user.name}`,
    })
  } catch (error: any) {
    console.error('Assign expert error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to assign expert',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
