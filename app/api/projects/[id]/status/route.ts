import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/get-current-user'

// Validation schema
const UpdateStatusSchema = z.object({
  status: z.enum([
    'draft',
    'estimating',
    'waiting_for_estimate_accept',
    'waiting_for_assignment',
    'assigned',
    'in_review',
    'completed',
    'cancelled',
  ]),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth()
    const resolvedParams = await params
    const projectId = resolvedParams.id

    // Parse and validate request body
    const body = await request.json()
    const { status } = UpdateStatusSchema.parse(body)

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

    // Update project status
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status },
      include: {
        projectAudios: {
          include: {
            audio: true,
          },
        },
        expert: {
          include: {
            user: {
              select: {
                name: true,
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
    })
  } catch (error: any) {
    console.error('Update project status error:', error)

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
        error: 'Failed to update project status',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
