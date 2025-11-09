import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Model configuration
const MINIMAX_SPEECH_MODEL = "minimax/speech-02-turbo";
const MINIMAX_VERSION = "e2e8812b45eefa93b20990418480fe628ddce470f9b72909a175d65e288ff3d5";

// Character limit enforcement
const MAX_CHARACTERS = 10000;

// Zod validation schema for voice generation
const GenerateVoiceSchema = z.object({
  text: z.string().min(1, "Text is required").max(MAX_CHARACTERS, `Text cannot exceed ${MAX_CHARACTERS} characters`),
  voiceId: z.string().optional(), // Can be preset voice (e.g., "Wise_Woman") or custom cloned voice ID
  userId: z.string().optional(), // Optional: for tracking usage and verifying custom voices
  emotion: z.enum(["auto", "happy", "sad", "angry", "excited", "calm", "serious", "friendly"]).default("auto"),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  pitch: z.number().min(-12).max(12).default(0),
  volume: z.number().min(0).max(10).default(1.0),
  audioFormat: z.enum(["mp3", "wav", "flac", "pcm"]).default("mp3"),
  sampleRate: z.number().refine(val => [16000, 22050, 24000, 32000, 44100, 48000].includes(val), {
    message: "Sample rate must be one of: 16000, 22050, 24000, 32000, 44100, 48000"
  }).default(32000),
  languageBoost: z.string().default("Automatic"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body with Zod
    const body = await request.json();
    const validatedData = GenerateVoiceSchema.parse(body);

    // Validate API token
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Voice generation service is not configured' },
        { status: 500 }
      );
    }

    // Determine voice ID to use
    let voiceIdToUse = validatedData.voiceId || "Wise_Woman";
    let isCustomVoice = false;
    let voiceDbRecord = null;

    // If userId provided and voiceId looks like a custom voice (starts with 'v_' or is a cuid)
    if (validatedData.userId && validatedData.voiceId && validatedData.voiceId !== "Wise_Woman") {
      // Try to find the voice in database to verify ownership and get Replicate voice_id
      const voice = await prisma.voice.findFirst({
        where: {
          OR: [
            { id: validatedData.voiceId },           // By database ID
            { voiceId: validatedData.voiceId },      // By Replicate voice_id
          ],
          userId: validatedData.userId,
          status: 'active',
        },
      });

      if (voice) {
        voiceIdToUse = voice.voiceId || validatedData.voiceId;
        isCustomVoice = true;
        voiceDbRecord = voice;
        console.log('Using custom voice:', { name: voice.name, voiceId: voiceIdToUse });
      } else {
        console.warn('Custom voice not found or access denied, falling back to preset');
      }
    }

    // Prepare input for Minimax Speech-02-Turbo
    const input = {
      text: validatedData.text,
      voice_id: voiceIdToUse,
      emotion: validatedData.emotion,
      speed: validatedData.speed,
      pitch: validatedData.pitch,
      volume: validatedData.volume,
      audio_format: validatedData.audioFormat,
      sample_rate: validatedData.sampleRate,
      language_boost: validatedData.languageBoost
    };

    console.log('Generating voice with Minimax Speech-02-Turbo:', {
      textLength: validatedData.text.length,
      voiceId: voiceIdToUse,
      isCustomVoice,
      emotion: input.emotion,
    });

    // Run the model and get the output
    const output = await replicate.run(
      `${MINIMAX_SPEECH_MODEL}:${MINIMAX_VERSION}`,
      { input }
    );

    console.log('Replicate raw output type:', typeof output, output?.constructor?.name);

    // Log all properties of the output object for debugging
    if (output && typeof output === 'object') {
      console.log('Output object keys:', Object.keys(output));
      console.log('Output object properties:', Object.getOwnPropertyNames(output));
      // Try to log methods
      const proto = Object.getPrototypeOf(output);
      if (proto) {
        console.log('Output prototype methods:', Object.getOwnPropertyNames(proto));
      }
    }

    // Handle different output formats from Replicate
    let audioUrl: string;

    if (typeof output === 'string') {
      // Direct URL string
      audioUrl = output;
      console.log('Output is direct string URL:', audioUrl);
    } else if (output && typeof output === 'object') {
      // For FileOutput objects from Replicate, they might have a url() method
      // or the object itself might be callable/have a valueOf

      // Check for url property or method first
      if ('url' in output) {
        const urlValue = (output as any).url;
        audioUrl = typeof urlValue === 'function' ? urlValue() : String(urlValue);
        console.log('Got URL from output.url:', audioUrl);
      } else if (typeof (output as any).url === 'function') {
        audioUrl = (output as any).url();
        console.log('Got URL from output.url() method:', audioUrl);
      } else {
        throw new Error('FileOutput object does not have a url property or method. Available keys: ' + Object.keys(output).join(', ') + ', Prototype: ' + Object.getOwnPropertyNames(Object.getPrototypeOf(output)).join(', '));
      }
    } else {
      throw new Error('Invalid output from Replicate API');
    }

    console.log('Final extracted audio URL:', audioUrl);

    // Optionally save generation to database for tracking
    if (validatedData.userId && voiceDbRecord) {
      try {
        await prisma.voiceGeneration.create({
          data: {
            userId: validatedData.userId,
            voiceId: voiceDbRecord.id,
            text: validatedData.text,
            audioUrl: audioUrl,
            characterCount: validatedData.text.length,
            speed: validatedData.speed,
            pitch: validatedData.pitch,
            emotion: validatedData.emotion,
            status: 'completed',
            completedAt: new Date(),
          },
        });
      } catch (dbError) {
        console.error('Failed to save generation to database:', dbError);
        // Don't fail the request if DB save fails
      }
    }

    // Return the audio URL
    return NextResponse.json({
      success: true,
      audioUrl: audioUrl,
      metadata: {
        characterCount: validatedData.text.length,
        model: MINIMAX_SPEECH_MODEL,
        version: MINIMAX_VERSION,
        isCustomVoice,
        voiceName: voiceDbRecord?.name,
        settings: {
          voiceId: input.voice_id,
          emotion: input.emotion,
          speed: input.speed,
          pitch: input.pitch,
          volume: input.volume,
          audioFormat: input.audio_format,
          sampleRate: input.sample_rate,
        }
      }
    });

  } catch (error: any) {
    console.error('Voice generation error:', error);

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

    // Handle specific Replicate errors
    if (error.response) {
      return NextResponse.json(
        {
          error: 'Voice generation failed',
          details: error.response.data || error.message
        },
        { status: error.response.status || 500 }
      );
    }

    // Handle rate limiting
    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again in a moment.',
          retryAfter: 60 // seconds
        },
        { status: 429 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during voice generation',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'voice-generation',
    model: MINIMAX_SPEECH_MODEL,
    version: MINIMAX_VERSION,
    configured: !!process.env.REPLICATE_API_TOKEN,
  });
}
