import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Zod validation schema for voice ID parameter
const VoiceIdSchema = z.string().min(1, "Voice ID is required");

// Zod validation schema for userId in body
const DeleteVoiceSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate voice ID
    const voiceId = VoiceIdSchema.parse(id);

    // Get userId from query params
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch voice from database
    const voice = await prisma.voice.findFirst({
      where: {
        id: voiceId,
        userId: userId, // Ensure user owns this voice
      },
      select: {
        id: true,
        name: true,
        description: true,
        voiceId: true,
        language: true,
        accent: true,
        gender: true,
        ageGroup: true,
        style: true,
        sampleAudioUrl: true,
        model: true,
        isPublic: true,
        isCloned: true,
        isVerified: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            generations: true,
          },
        },
      },
    });

    if (!voice) {
      return NextResponse.json(
        { error: 'Voice not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      voice,
    });

  } catch (error: any) {
    console.error('Error fetching voice:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while fetching voice',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate voice ID
    const voiceId = VoiceIdSchema.parse(id);

    // Parse and validate request body
    const body = await request.json();
    const { userId } = DeleteVoiceSchema.parse(body);

    // Check if voice exists and belongs to user
    const voice = await prisma.voice.findFirst({
      where: {
        id: voiceId,
        userId: userId,
      },
    });

    if (!voice) {
      return NextResponse.json(
        { error: 'Voice not found or access denied' },
        { status: 404 }
      );
    }

    // Delete voice (cascade will handle related generations)
    await prisma.voice.delete({
      where: {
        id: voiceId,
      },
    });

    console.log('Voice deleted:', {
      voiceId,
      userId,
      name: voice.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Voice deleted successfully',
      deletedVoice: {
        id: voice.id,
        name: voice.name,
      },
    });

  } catch (error: any) {
    console.error('Error deleting voice:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Voice not found' },
        { status: 404 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while deleting voice',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate voice ID
    const voiceId = VoiceIdSchema.parse(id);

    // Parse request body
    const body = await request.json();

    // Validation schema for update
    const UpdateVoiceSchema = z.object({
      userId: z.string().min(1, "User ID is required"),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      isPublic: z.boolean().optional(),
      language: z.string().optional(),
      gender: z.enum(["male", "female", "neutral"]).optional(),
      ageGroup: z.enum(["child", "young adult", "adult", "senior"]).optional(),
      style: z.string().optional(),
    });

    const validatedData = UpdateVoiceSchema.parse(body);
    const { userId, ...updateData } = validatedData;

    // Check if voice exists and belongs to user
    const existingVoice = await prisma.voice.findFirst({
      where: {
        id: voiceId,
        userId: userId,
      },
    });

    if (!existingVoice) {
      return NextResponse.json(
        { error: 'Voice not found or access denied' },
        { status: 404 }
      );
    }

    // Update voice
    const updatedVoice = await prisma.voice.update({
      where: {
        id: voiceId,
      },
      data: updateData,
    });

    console.log('Voice updated:', {
      voiceId,
      userId,
      updates: Object.keys(updateData),
    });

    return NextResponse.json({
      success: true,
      voice: {
        id: updatedVoice.id,
        name: updatedVoice.name,
        description: updatedVoice.description,
        voiceId: updatedVoice.voiceId,
        language: updatedVoice.language,
        gender: updatedVoice.gender,
        ageGroup: updatedVoice.ageGroup,
        style: updatedVoice.style,
        isPublic: updatedVoice.isPublic,
        updatedAt: updatedVoice.updatedAt,
      },
    });

  } catch (error: any) {
    console.error('Error updating voice:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Voice not found' },
        { status: 404 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while updating voice',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
