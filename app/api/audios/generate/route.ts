import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Replicate from 'replicate';
import { prisma } from '@/lib/prisma';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// Validation schema for generate audio request
const GenerateAudioSchema = z.object({
  text: z.string().min(1).max(10000),
  voiceId: z.string().min(1),
  emotion: z.enum(['auto', 'happy', 'sad', 'angry', 'excited', 'calm', 'serious', 'friendly']).default('auto'),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  pitch: z.number().min(-12).max(12).default(0),
  volume: z.number().min(0).max(10).default(1.0),
  audioFormat: z.enum(['mp3', 'wav', 'pcm']).default('mp3'),
  sampleRate: z.number().default(32000),
  filename: z.string().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = GenerateAudioSchema.parse(body);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Check if voice exists (either preset or custom cloned voice)
    let voice = null;
    let replicateVoiceId = validatedData.voiceId;

    // Try to find custom voice in database
    if (!validatedData.voiceId.startsWith('preset_')) {
      voice = await prisma.voice.findUnique({
        where: { id: validatedData.voiceId },
        select: {
          id: true,
          voiceId: true,
          name: true,
          status: true,
        },
      });

      if (!voice) {
        return NextResponse.json({
          error: 'Voice not found',
        }, { status: 404 });
      }

      if (voice.status !== 'active') {
        return NextResponse.json({
          error: 'Voice is not ready for use',
          details: `Voice status: ${voice.status}`,
        }, { status: 400 });
      }

      // Use the Replicate voice ID from the cloned voice
      replicateVoiceId = voice.voiceId || validatedData.voiceId;
    }

    // Generate filename
    const filename = validatedData.filename || `audio-${Date.now()}.${validatedData.audioFormat}`;

    // Create audio record in database with "processing" status
    const audio = await prisma.audio.create({
      data: {
        userId,
        filename,
        audioUrl: '', // Will be updated after generation
        format: validatedData.audioFormat,
        voiceId: voice?.id,
        text: validatedData.text,
        metadata: {
          emotion: validatedData.emotion,
          speed: validatedData.speed,
          pitch: validatedData.pitch,
          volume: validatedData.volume,
          sampleRate: validatedData.sampleRate,
        },
        uploadSource: 'generate',
        tags: validatedData.tags || [],
        description: validatedData.description,
        status: 'processing',
      },
    });

    try {
      // Call Replicate TTS API
      const output = await replicate.run(
        "minimax/speech-02-turbo:e2e8812b10a3e5aff45324f1fc3ee3bbea5b19a64a916f82ba74a434aca8691d",
        {
          input: {
            text: validatedData.text,
            voice_id: replicateVoiceId,
            emotion: validatedData.emotion,
            pitch: validatedData.pitch,
            speed: validatedData.speed,
            audio_format: validatedData.audioFormat,
            sample_rate: validatedData.sampleRate,
          }
        }
      ) as { audio_url: string };

      if (!output || !output.audio_url) {
        throw new Error('No audio URL returned from Replicate');
      }

      // TODO: Upload to Vercel Blob for permanent storage
      // For now, using Replicate URL directly
      const audioUrl = output.audio_url;

      // TODO: Get audio duration and file size
      const duration = null;
      const fileSize = null;

      // Update audio record with generated URL
      const updatedAudio = await prisma.audio.update({
        where: { id: audio.id },
        data: {
          audioUrl,
          duration,
          fileSize,
          status: 'ready',
        },
        include: {
          voice: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        audio: updatedAudio,
      });

    } catch (replicateError: any) {
      // Update audio status to failed
      await prisma.audio.update({
        where: { id: audio.id },
        data: {
          status: 'failed',
        },
      });

      console.error('Replicate generation error:', replicateError);

      return NextResponse.json({
        error: 'Audio generation failed',
        details: replicateError.message || 'Unknown error',
      }, { status: 500 });
    }

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

    console.error('Generate audio error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
