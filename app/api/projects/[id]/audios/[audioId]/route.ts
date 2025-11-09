import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schemas
const ProjectIdSchema = z.string().cuid();
const AudioIdSchema = z.string().cuid();

// DELETE /api/projects/[id]/audios/[audioId] - Remove audio from project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; audioId: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id, audioId } = await params;

    // Validate IDs
    const projectId = ProjectIdSchema.parse(id);
    const validatedAudioId = AudioIdSchema.parse(audioId);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Check if project exists and belongs to user
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

    // Check if audio is in the project
    const projectAudio = await prisma.projectAudio.findFirst({
      where: {
        projectId,
        audioId: validatedAudioId,
      },
    });

    if (!projectAudio) {
      return NextResponse.json({
        error: 'Audio not found in project',
      }, { status: 404 });
    }

    // Remove audio from project
    await prisma.projectAudio.delete({
      where: {
        id: projectAudio.id,
      },
    });

    // Reorder remaining audios
    await prisma.$executeRaw`
      UPDATE project_audios
      SET "order" = "order" - 1
      WHERE project_id = ${projectId}::text
      AND "order" > ${projectAudio.order}
    `;

    return NextResponse.json({
      success: true,
      message: 'Audio removed from project',
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

    console.error('Remove audio from project error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
