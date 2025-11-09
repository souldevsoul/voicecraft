import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema
const ProjectIdSchema = z.string().cuid();

const RejectSchema = z.object({
  reason: z.string().optional(),
});

// POST /api/projects/[id]/estimate/reject - Reject estimate and return to draft
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate project ID
    const projectId = ProjectIdSchema.parse(id);

    // Parse request body
    const body = await request.json();
    const { reason } = RejectSchema.parse(body);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Get project
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

    // Check if project is in correct status
    if (project.status !== 'waiting_for_estimate_accept') {
      return NextResponse.json({
        error: 'Cannot reject estimate',
        details: `Project must be in "waiting_for_estimate_accept" status. Current status: ${project.status}`,
        currentStatus: project.status,
      }, { status: 400 });
    }

    // Update project status back to draft, keep the estimate for reference
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'draft',
        // Keep estimatedCost, estimatedDuration, and estimationData for user to review
        // User can get a new estimate by calling /estimate again
      },
      include: {
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

    return NextResponse.json({
      success: true,
      message: 'Estimate rejected, project returned to draft',
      project: updatedProject,
      rejectionReason: reason || 'No reason provided',
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

    console.error('Reject estimate error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
