import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Validation schema
const ProjectIdSchema = z.string().cuid();

// POST /api/projects/[id]/estimate/accept - Accept estimate and reserve credits
export async function POST(
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

    // Get project with user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
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

    // Check if project is in correct status
    if (project.status !== 'waiting_for_estimate_accept') {
      return NextResponse.json({
        error: 'Cannot accept estimate',
        details: `Project must be in "waiting_for_estimate_accept" status. Current status: ${project.status}`,
        currentStatus: project.status,
      }, { status: 400 });
    }

    // Check if estimate exists
    if (!project.estimatedCost) {
      return NextResponse.json({
        error: 'No estimate available',
        details: 'Project does not have an estimated cost',
      }, { status: 400 });
    }

    // Convert estimated cost to credits (1 credit = $0.01, so $1 = 100 credits)
    const creditsNeeded = Math.ceil(project.estimatedCost * 100);

    // Check if user has enough credits
    if (project.user.credits < creditsNeeded) {
      return NextResponse.json({
        error: 'Insufficient credits',
        details: `You need ${creditsNeeded} credits but only have ${project.user.credits} credits`,
        creditsNeeded,
        creditsAvailable: project.user.credits,
        shortfall: creditsNeeded - project.user.credits,
      }, { status: 402 }); // 402 Payment Required
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Deduct credits from user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: creditsNeeded,
          },
        },
      });

      // Create credit ledger entry for reservation
      await tx.creditLedger.create({
        data: {
          userId,
          projectId,
          amount: -creditsNeeded,
          type: 'PROJECT_RESERVATION',
          description: `Reserved ${creditsNeeded} credits for project: ${project.name}`,
          metadata: {
            estimatedCost: project.estimatedCost,
            estimatedDuration: project.estimatedDuration,
          },
        },
      });

      // Update project status
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: {
          status: 'waiting_for_assignment',
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

      return {
        updatedUser,
        updatedProject,
      };
    });

    // TODO: Send notification email to user
    // TODO: Send notification to admin about new project awaiting assignment

    return NextResponse.json({
      success: true,
      message: 'Estimate accepted and credits reserved',
      project: result.updatedProject,
      creditsReserved: creditsNeeded,
      creditsRemaining: result.updatedUser.credits,
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

    console.error('Accept estimate error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
