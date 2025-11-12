import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/get-current-user';
import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

// DELETE /api/voices/[id] - Delete a voice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth();
    const { id } = await params;

    // Find the voice and verify ownership
    const voice = await prisma.voice.findUnique({
      where: { id },
    });

    if (!voice) {
      return NextResponse.json(
        { error: 'Voice not found' },
        { status: 404 }
      );
    }

    if (voice.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the audio file from Vercel Blob if it exists
    if (voice.sampleAudioUrl) {
      try {
        await del(voice.sampleAudioUrl);
      } catch (error) {
        console.error('Failed to delete audio file from blob:', error);
        // Continue with database deletion even if blob deletion fails
      }
    }

    // Delete the voice from database
    await prisma.voice.delete({
      where: { id },
    });

    // Revalidate the voices page
    revalidatePath('/dashboard/voices');
    revalidatePath('/dashboard');

    return NextResponse.json({
      success: true,
      message: 'Voice deleted successfully',
    });

  } catch (error: any) {
    console.error('Delete voice error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete voice',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/voices/[id] - Get a specific voice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth();
    const { id } = await params;

    const voice = await prisma.voice.findUnique({
      where: { id },
    });

    if (!voice) {
      return NextResponse.json(
        { error: 'Voice not found' },
        { status: 404 }
      );
    }

    if (voice.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      voice: {
        id: voice.id,
        name: voice.name,
        description: voice.description,
        language: voice.language,
        gender: voice.gender,
        ageGroup: voice.ageGroup,
        style: voice.style,
        sampleAudioUrl: voice.sampleAudioUrl,
        voiceId: voice.voiceId,
        model: voice.model,
        isCloned: voice.isCloned,
        status: voice.status,
        createdAt: voice.createdAt,
      },
    });

  } catch (error: any) {
    console.error('Get voice error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get voice',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
