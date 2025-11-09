import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Validation schemas
const ProjectIdSchema = z.string().cuid();

const ApproveWorkSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

// POST /api/projects/[id]/approve - User approves completed work
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
    const { rating, feedback } = ApproveWorkSchema.parse(body);

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
                credits: true,
              },
            },
            completedJobs: true,
            rating: true,
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
        error: 'Cannot approve work',
        details: `Project must be in "in_review" status. Current status: ${project.status}`,
        currentStatus: project.status,
      }, { status: 400 });
    }

    // Check if expert is assigned
    if (!project.expert) {
      return NextResponse.json({
        error: 'No expert assigned',
        details: 'Cannot approve work for a project without an assigned expert',
      }, { status: 400 });
    }

    // Calculate payment amount (use estimated cost)
    const estimatedCost = project.estimatedCost || 0;
    const paymentCredits = Math.ceil(estimatedCost * 100); // Convert dollars to credits

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Pay the expert
      const updatedExpertUser = await tx.user.update({
        where: { id: project.expert!.userId },
        data: {
          credits: {
            increment: paymentCredits,
          },
        },
      });

      // Create credit ledger entry for expert payment
      await tx.creditLedger.create({
        data: {
          userId: project.expert!.userId,
          projectId,
          amount: paymentCredits,
          type: 'PROJECT_COMPLETION',
          description: `Payment for completing project: ${project.name}`,
          metadata: {
            rating,
            feedback,
            estimatedCost,
          },
        },
      });

      // Update expert profile
      const currentRating = project.expert!.rating || 0;
      const completedJobs = project.expert!.completedJobs || 0;
      const newRating = ((currentRating * completedJobs) + rating) / (completedJobs + 1);

      await tx.expertProfile.update({
        where: { id: project.expert!.id },
        data: {
          completedJobs: {
            increment: 1,
          },
          rating: newRating,
        },
      });

      // Update project status to completed
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          reviewedAt: new Date(),
          rating,
          feedback,
          actualCost: estimatedCost, // For now, using estimated cost as actual
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
              completedJobs: true,
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

      return {
        updatedProject,
        updatedExpertUser,
      };
    });

    // TODO: Send completion email to user
    // TODO: Send payment notification email to expert

    return NextResponse.json({
      success: true,
      message: 'Work approved and project completed',
      project: result.updatedProject,
      paymentCredits,
      expertNewRating: result.updatedProject.expert?.rating,
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

    console.error('Approve work error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
