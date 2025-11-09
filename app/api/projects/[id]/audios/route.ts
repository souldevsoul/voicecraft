import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schemas
const ProjectIdSchema = z.string().cuid();

const AddAudioSchema = z.object({
  audioIds: z.array(z.string().cuid()).min(1),
});

// POST /api/projects/[id]/audios - Add audios to project
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
    const { audioIds } = AddAudioSchema.parse(body);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        projectAudios: {
          select: {
            audioId: true,
            order: true,
          },
          orderBy: {
            order: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!project) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    // Verify all audios exist and belong to user
    const audios = await prisma.audio.findMany({
      where: {
        id: { in: audioIds },
        userId,
      },
      select: { id: true },
    });

    if (audios.length !== audioIds.length) {
      return NextResponse.json({
        error: 'Invalid audio IDs',
        details: 'One or more audio IDs not found or do not belong to you',
      }, { status: 400 });
    }

    // Check for duplicate audios
    const existingAudioIds = await prisma.projectAudio.findMany({
      where: {
        projectId,
        audioId: { in: audioIds },
      },
      select: { audioId: true },
    });

    if (existingAudioIds.length > 0) {
      return NextResponse.json({
        error: 'Duplicate audios',
        details: 'One or more audios are already in this project',
        duplicateIds: existingAudioIds.map((pa: any) => pa.audioId),
      }, { status: 400 });
    }

    // Get the next order number
    const lastOrder = project.projectAudios[0]?.order ?? -1;

    // Add audios to project
    const projectAudios = await prisma.projectAudio.createMany({
      data: audioIds.map((audioId, index) => ({
        projectId,
        audioId,
        order: lastOrder + 1 + index,
        status: 'pending',
      })),
    });

    // Get updated project
    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        projectAudios: {
          include: {
            audio: {
              select: {
                id: true,
                filename: true,
                duration: true,
                audioUrl: true,
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
      message: `Added ${audioIds.length} audio(s) to project`,
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

    console.error('Add audio to project error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
