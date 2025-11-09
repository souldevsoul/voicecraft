import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema for project ID
const ProjectIdSchema = z.string().cuid();

// Validation schema for update request
const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'estimating', 'ready', 'in_progress', 'completed', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  instructions: z.string().optional(),
  deadline: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/projects/[id] - Get project details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate project ID
    const projectId = ProjectIdSchema.parse(id);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Get project from database
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
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
                fileSize: true,
                format: true,
                audioUrl: true,
                voice: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project,
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

    console.error('Get project error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(
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
    const validatedData = UpdateProjectSchema.parse(body);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!existingProject) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = { ...validatedData };

    // Handle status change to completed
    if (validatedData.status === 'completed' && existingProject.status !== 'completed') {
      updateData.completedAt = new Date();
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        expert: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        projectAudios: {
          include: {
            audio: {
              select: {
                id: true,
                filename: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
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

    console.error('Update project error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate project ID
    const projectId = ProjectIdSchema.parse(id);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Get project from database
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    // Prevent deletion of in-progress or completed projects
    if (project.status === 'in_progress' || project.status === 'completed') {
      return NextResponse.json({
        error: 'Cannot delete project',
        details: `Projects with status "${project.status}" cannot be deleted. Cancel the project first.`,
      }, { status: 400 });
    }

    // Delete project (projectAudios will be cascade deleted)
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
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

    console.error('Delete project error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
