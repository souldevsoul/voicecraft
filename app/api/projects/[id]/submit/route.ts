import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schemas
const ProjectIdSchema = z.string().cuid();

const SubmitWorkSchema = z.object({
  audioIds: z.array(z.string().cuid()).min(1, "At least one audio must be submitted"),
  notes: z.string().optional(),
});

// POST /api/projects/[id]/submit - Specialist submits completed work
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
    const { audioIds, notes } = SubmitWorkSchema.parse(body);

    // TODO: Get expertId from session (for now using temp ID)
    // In a real implementation, this would come from the authenticated expert user
    const expertUserId = 'temp-user-id';

    // Get project to verify expert assignment
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        expert: {
          select: {
            id: true,
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    // Check if project is assigned to this expert
    if (!project.expert || project.expert.userId !== expertUserId) {
      return NextResponse.json({
        error: 'Not authorized',
        details: 'This project is not assigned to you',
      }, { status: 403 });
    }

    // Check if project is in correct status
    if (project.status !== 'assigned') {
      return NextResponse.json({
        error: 'Cannot submit work',
        details: `Project must be in "assigned" status. Current status: ${project.status}`,
        currentStatus: project.status,
      }, { status: 400 });
    }

    // Verify all audio IDs exist and are accessible
    const audios = await prisma.audio.findMany({
      where: {
        id: {
          in: audioIds,
        },
      },
      select: {
        id: true,
        filename: true,
        audioUrl: true,
      },
    });

    if (audios.length !== audioIds.length) {
      return NextResponse.json({
        error: 'Invalid audio IDs',
        details: 'Some audio files were not found',
      }, { status: 400 });
    }

    // Update project status and add submitted audios
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'in_review',
        submittedAt: new Date(),
        // Optionally add the submitted notes to a field
        // For now, we'll add them to the estimationData metadata
        estimationData: {
          ...(project.estimationData as any || {}),
          submissionNotes: notes,
          submittedAudioIds: audioIds,
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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

    // TODO: Send notification email to project owner
    // TODO: Send confirmation email to expert

    return NextResponse.json({
      success: true,
      message: 'Work submitted successfully for review',
      project: updatedProject,
      submittedAudios: audios,
      submissionNotes: notes,
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

    console.error('Submit work error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
