import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Minimax Voice Cloning Model
const MINIMAX_VOICE_CLONING_MODEL = "minimax/voice-cloning";
const MINIMAX_CLONING_VERSION = "fff8a670880f066d3742838515a88f7f0a3ae40a4f2e06dae0f7f70ba63582d7";

// Zod validation schema for voice cloning request
const CloneVoiceSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Voice name is required").max(255, "Voice name too long"),
  description: z.string().optional(),
  audioFileUrl: z.string().url("Valid audio file URL is required"),
  model: z.enum(["minimax-2.6-turbo", "minimax-2.6-hd", "speech-02-turbo", "speech-02-hd"]).default("speech-02-turbo"),
  accuracy: z.number().min(0).max(1).default(0.7),
  noiseReduction: z.boolean().default(false),
  normalizeVolume: z.boolean().default(false),
  language: z.string().default("en-US"),
  gender: z.enum(["male", "female", "neutral"]).optional(),
  ageGroup: z.enum(["child", "young adult", "adult", "senior"]).optional(),
  style: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = CloneVoiceSchema.parse(body);

    // Validate API token
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Voice cloning service is not configured' },
        { status: 500 }
      );
    }

    console.log('Starting voice cloning:', {
      userId: validatedData.userId,
      name: validatedData.name,
      audioUrl: validatedData.audioFileUrl,
      model: validatedData.model,
    });

    // Create voice record in database with "processing" status
    const voice = await prisma.voice.create({
      data: {
        userId: validatedData.userId,
        name: validatedData.name,
        description: validatedData.description,
        language: validatedData.language,
        gender: validatedData.gender,
        ageGroup: validatedData.ageGroup,
        style: validatedData.style,
        sampleAudioUrl: validatedData.audioFileUrl,
        model: validatedData.model,
        isCloned: true,
        status: 'processing',
      },
    });

    // Prepare input for Minimax Voice Cloning
    const input = {
      voice_file: validatedData.audioFileUrl,
      model: validatedData.model,
      accuracy: validatedData.accuracy,
      need_noise_reduction: validatedData.noiseReduction,
      need_volume_normalization: validatedData.normalizeVolume,
    };

    try {
      // Run voice cloning model
      const output: any = await replicate.run(
        `${MINIMAX_VOICE_CLONING_MODEL}:${MINIMAX_CLONING_VERSION}`,
        { input }
      );

      console.log('Voice cloning completed:', {
        voiceId: output.voice_id,
        dbId: voice.id,
      });

      // Update voice record with the returned voice_id
      const updatedVoice = await prisma.voice.update({
        where: { id: voice.id },
        data: {
          voiceId: output.voice_id,
          status: 'active',
          isVerified: true,
        },
      });

      return NextResponse.json({
        success: true,
        voice: {
          id: updatedVoice.id,
          name: updatedVoice.name,
          voiceId: updatedVoice.voiceId,
          description: updatedVoice.description,
          language: updatedVoice.language,
          model: updatedVoice.model,
          sampleAudioUrl: updatedVoice.sampleAudioUrl,
          createdAt: updatedVoice.createdAt,
        },
        metadata: {
          model: MINIMAX_VOICE_CLONING_MODEL,
          version: MINIMAX_CLONING_VERSION,
          settings: {
            accuracy: input.accuracy,
            noiseReduction: input.need_noise_reduction,
            normalizeVolume: input.need_volume_normalization,
          },
        },
      });

    } catch (cloneError: any) {
      // Update voice status to failed
      await prisma.voice.update({
        where: { id: voice.id },
        data: {
          status: 'failed',
        },
      });

      throw cloneError;
    }

  } catch (error: any) {
    console.error('Voice cloning error:', error);

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

    // Handle Replicate API errors
    if (error.response) {
      return NextResponse.json(
        {
          error: 'Voice cloning failed',
          details: error.response.data || error.message,
        },
        { status: error.response.status || 500 }
      );
    }

    // Handle rate limiting
    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 120, // seconds
        },
        { status: 429 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during voice cloning',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'voice-cloning',
    model: MINIMAX_VOICE_CLONING_MODEL,
    version: MINIMAX_CLONING_VERSION,
    configured: !!process.env.REPLICATE_API_TOKEN,
  });
}
