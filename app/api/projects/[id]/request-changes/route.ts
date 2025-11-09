import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schemas
const ProjectIdSchema = z.string().cuid();

const RequestChangesSchema = z.object({
  feedback: z.string().min(10, "Please provide detailed feedback (at least 10 characters)"),
});

// POST /api/projects/[id]/request-changes - User requests changes to submitted work
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
    const { feedback } = RequestChangesSchema.parse(body);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Get project with expert details
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        expert: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    // Check if project is in review status
    if (project.status !== 'in_review') {
      return NextResponse.json({
        error: 'Cannot request changes',
        details: `Project must be in "in_review" status. Current status: ${project.status}`,
        currentStatus: project.status,
      }, { status: 400 });
    }

    // Check if expert is assigned
    if (!project.expert) {
      return NextResponse.json({
        error: 'No expert assigned',
        details: 'Cannot request changes for a project without an assigned expert',
      }, { status: 400 });
    }

    // Update project status back to assigned and add feedback
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'assigned',
        feedback,
        reviewedAt: new Date(),
        // Keep submittedAt to track how many times work has been submitted
        // Store feedback in estimationData for history
        estimationData: {
          ...(project.estimationData as any || {}),
          revisionHistory: [
            ...((project.estimationData as any)?.revisionHistory || []),
            {
              requestedAt: new Date().toISOString(),
              feedback,
            },
          ],
        },
      },
      include: {
        expert: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            specialization: true,
            rating: true,
          },
        },
        projectAudios: {
          include: {
            audio: {
              select: {
                id: true,
                filename: true,
                audioUrl: true,
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

    // TODO: Send notification email to expert with feedback
    // TODO: Send confirmation email to user

    return NextResponse.json({
      success: true,
      message: 'Changes requested, project returned to expert',
      project: updatedProject,
      feedback,
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

    console.error('Request changes error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
