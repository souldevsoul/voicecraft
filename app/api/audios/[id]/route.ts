import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';

// Validation schema for audio ID
const AudioIdSchema = z.string().cuid();

// Validation schema for update request
const UpdateAudioSchema = z.object({
  filename: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
});

// GET /api/audios/[id] - Get audio details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate audio ID
    const audioId = AudioIdSchema.parse(id);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Get audio from database
    const audio = await prisma.audio.findFirst({
      where: {
        id: audioId,
        userId,
      },
      include: {
        voice: {
          select: {
            id: true,
            name: true,
            language: true,
          },
        },
        projectAudios: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!audio) {
      return NextResponse.json({
        error: 'Audio not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      audio,
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

    console.error('Get audio error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}

// PATCH /api/audios/[id] - Update audio metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate audio ID
    const audioId = AudioIdSchema.parse(id);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = UpdateAudioSchema.parse(body);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Check if audio exists and belongs to user
    const existingAudio = await prisma.audio.findFirst({
      where: {
        id: audioId,
        userId,
      },
    });

    if (!existingAudio) {
      return NextResponse.json({
        error: 'Audio not found',
      }, { status: 404 });
    }

    // Update audio
    const updatedAudio = await prisma.audio.update({
      where: { id: audioId },
      data: validatedData,
      include: {
        voice: {
          select: {
            id: true,
            name: true,
            language: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      audio: updatedAudio,
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

    console.error('Update audio error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}

// DELETE /api/audios/[id] - Delete audio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate audio ID
    const audioId = AudioIdSchema.parse(id);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Get audio from database
    const audio = await prisma.audio.findFirst({
      where: {
        id: audioId,
        userId,
      },
      include: {
        projectAudios: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!audio) {
      return NextResponse.json({
        error: 'Audio not found',
      }, { status: 404 });
    }

    // Check if audio is used in any projects
    if (audio.projectAudios.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete audio',
        details: 'Audio is used in one or more projects. Remove it from all projects first.',
        projects: audio.projectAudios.map((pa: any) => pa.project),
      }, { status: 400 });
    }

    // Delete from Vercel Blob if it's stored there
    if (audio.audioUrl && audio.audioUrl.includes('vercel-storage')) {
      try {
        await del(audio.audioUrl);
      } catch (blobError) {
        console.error('Error deleting from Vercel Blob:', blobError);
        // Continue with database deletion even if blob deletion fails
      }
    }

    // Delete audio from database
    await prisma.audio.delete({
      where: { id: audioId },
    });

    return NextResponse.json({
      success: true,
      message: 'Audio deleted successfully',
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

    console.error('Delete audio error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
