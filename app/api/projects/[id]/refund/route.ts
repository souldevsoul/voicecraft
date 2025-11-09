import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Validation schemas
const ProjectIdSchema = z.string().cuid();

const RefundSchema = z.object({
  reason: z.string().min(10, "Please provide a detailed reason (at least 10 characters)"),
  refundAmount: z.number().positive("Refund amount must be positive").optional(),
  adminNotes: z.string().optional(),
});

// POST /api/projects/[id]/refund - Admin issues refund for cancelled/failed project
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
    const { reason, refundAmount, adminNotes } = RefundSchema.parse(body);

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
        creditLedger: {
          where: {
            type: 'PROJECT_RESERVATION',
          },
          select: {
            amount: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    // Check if project can be refunded
    if (project.status === 'refunded') {
      return NextResponse.json({
        error: 'Already refunded',
        details: 'This project has already been refunded',
      }, { status: 400 });
    }

    if (project.status === 'completed') {
      return NextResponse.json({
        error: 'Cannot refund completed project',
        details: 'Completed projects cannot be refunded without admin override',
      }, { status: 400 });
    }

    // Calculate refund amount
    // If not specified, refund the full reservation amount
    let creditsToRefund = 0;

    if (refundAmount) {
      creditsToRefund = Math.ceil(refundAmount * 100);
    } else {
      // Find the reservation transaction and refund that amount
      const reservation = project.creditLedger.find((entry: { amount: number }) => entry.amount < 0);
      if (reservation) {
        creditsToRefund = Math.abs(reservation.amount);
      } else {
        // Fall back to estimated cost
        creditsToRefund = Math.ceil((project.estimatedCost || 0) * 100);
      }
    }

    if (creditsToRefund <= 0) {
      return NextResponse.json({
        error: 'Invalid refund amount',
        details: 'Refund amount must be greater than 0',
      }, { status: 400 });
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Return credits to user
      const updatedUser = await tx.user.update({
        where: { id: project.user.id },
        data: {
          credits: {
            increment: creditsToRefund,
          },
        },
      });

      // Create credit ledger entry for refund
      await tx.creditLedger.create({
        data: {
          userId: project.user.id,
          projectId,
          amount: creditsToRefund,
          type: 'PROJECT_REFUND',
          description: `Refund for project: ${project.name}. Reason: ${reason}`,
          metadata: {
            reason,
            adminNotes,
            originalEstimate: project.estimatedCost,
          },
        },
      });

      // Update project status to refunded
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: {
          status: 'refunded',
          feedback: `Refunded: ${reason}`,
          completedAt: new Date(),
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

      return {
        updatedUser,
        updatedProject,
      };
    });

    // TODO: Send refund confirmation email to user
    // TODO: Notify expert if assigned

    return NextResponse.json({
      success: true,
      message: 'Refund issued successfully',
      project: result.updatedProject,
      creditsRefunded: creditsToRefund,
      newUserBalance: result.updatedUser.credits,
      reason,
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

    console.error('Refund error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
