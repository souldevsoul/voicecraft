import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schemas
const ProjectIdSchema = z.string().cuid();

const ReEstimateSchema = z.object({
  newEstimate: z.number().positive("New estimate must be positive"),
  reason: z.string().min(10, "Please provide a detailed reason (at least 10 characters)"),
  adminNotes: z.string().optional(),
});

// POST /api/projects/[id]/re-estimate - Admin requests re-estimation for scope changes
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
    const { newEstimate, reason, adminNotes } = ReEstimateSchema.parse(body);

    // TODO: Check if user is admin (for now, allowing anyone)
    // In production, verify admin role from session

    // Get project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            credits: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    // Check if project can be re-estimated
    const allowedStatuses = ['assigned', 'in_review'];
    if (!allowedStatuses.includes(project.status)) {
      return NextResponse.json({
        error: 'Cannot re-estimate',
        details: `Project must be in "assigned" or "in_review" status. Current status: ${project.status}`,
        currentStatus: project.status,
      }, { status: 400 });
    }

    // Calculate additional credits needed
    const originalEstimate = project.estimatedCost || 0;
    const additionalCost = newEstimate - originalEstimate;
    const additionalCredits = Math.ceil(additionalCost * 100);

    // Store the old estimate in history
    const estimateHistory = {
      ...(project.estimationData as any || {}),
      estimateHistory: [
        ...((project.estimationData as any)?.estimateHistory || []),
        {
          timestamp: new Date().toISOString(),
          oldEstimate: originalEstimate,
          newEstimate,
          reason,
          adminNotes,
          additionalCost,
        },
      ],
    };

    // Update project with new estimate and return to waiting for acceptance
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        estimatedCost: newEstimate,
        estimationData: estimateHistory,
        // Store the reason as feedback for user to see
        feedback: `Re-estimation required: ${reason}`,
        // Note: We don't change status here yet - user must accept the new estimate first
        // This could be a separate acceptance flow or automatic
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            credits: true,
          },
        },
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
          },
        },
      },
    });

    // TODO: Send notification email to user about re-estimation
    // TODO: If additionalCredits > 0, may need to charge user or get approval

    return NextResponse.json({
      success: true,
      message: 'Re-estimation created',
      project: updatedProject,
      originalEstimate,
      newEstimate,
      additionalCost,
      additionalCredits,
      reason,
      userHasEnoughCredits: additionalCredits > 0 ? project.user.credits >= additionalCredits : true,
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

    console.error('Re-estimate error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
