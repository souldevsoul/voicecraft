import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schemas
const ProjectIdSchema = z.string().cuid();

const AssignExpertSchema = z.object({
  expertId: z.string().cuid(),
  instructions: z.string().optional(),
  deadline: z.string().datetime().optional(),
});

// POST /api/projects/[id]/assign - Assign project to expert
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate project ID
    const projectId = ProjectIdSchema.parse(id);

    // Parse and validate request body
    const body = await request.json();
    const { expertId, instructions, deadline } = AssignExpertSchema.parse(body);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      select: {
        id: true,
        status: true,
        estimatedCost: true,
        estimatedDuration: true,
      },
    });

    if (!project) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    // Check if project is ready to be assigned
    if (project.status !== 'waiting_for_assignment') {
      return NextResponse.json({
        error: 'Project not ready',
        details: 'Project must be in "waiting_for_assignment" status to assign to an expert. User must accept the estimate first.',
        currentStatus: project.status,
      }, { status: 400 });
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
    });

    if (!expert) {
      return NextResponse.json({
        error: 'Expert not found',
      }, { status: 404 });
    }

    if (!expert.isAvailable) {
      return NextResponse.json({
        error: 'Expert not available',
        details: `${expert.user.name} is currently unavailable for new projects`,
      }, { status: 400 });
    }

    // Assign project to expert
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        expertId,
        instructions,
        deadline: deadline ? new Date(deadline) : null,
        assignedAt: new Date(),
        status: 'assigned',
      },
      include: {
        expert: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
            specialization: true,
            rating: true,
            hourlyRate: true,
          },
        },
        projectAudios: {
          include: {
            audio: {
              select: {
                id: true,
                filename: true,
                duration: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // TODO: Send notification email to expert
    // TODO: Send confirmation email to user

    return NextResponse.json({
      success: true,
      message: `Project assigned to ${expert.user.name}`,
      project: updatedProject,
    });

  } catch (error: any) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.issues.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      }, { status: 400 });
    }

    console.error('Assign project error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
