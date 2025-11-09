import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema for upload metadata
const UploadMetadataSchema = z.object({
  filename: z.string().min(1),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadataJson = formData.get('metadata') as string;

    if (!file) {
      return NextResponse.json({
        error: 'No file provided',
      }, { status: 400 });
    }

    // Validate file type (audio only)
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type',
        details: `File type must be one of: ${allowedTypes.join(', ')}`,
      }, { status: 400 });
    }

    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: 'File too large',
        details: `File size must be less than 50MB`,
      }, { status: 400 });
    }

    // Parse and validate metadata
    let metadata: z.infer<typeof UploadMetadataSchema> = {
      filename: file.name,
      tags: undefined,
      description: undefined,
    };

    if (metadataJson) {
      try {
        const parsedMetadata = JSON.parse(metadataJson);
        metadata = UploadMetadataSchema.parse(parsedMetadata);
      } catch (error) {
        return NextResponse.json({
          error: 'Invalid metadata',
          details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 400 });
      }
    }

    // Determine format from file type
    const formatMap: Record<string, string> = {
      'audio/mpeg': 'mp3',
      'audio/mp3': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'audio/webm': 'webm',
    };
    const format = formatMap[file.type] || 'mp3';

    // Upload to Vercel Blob
    const blob = await put(
      `audios/${userId}/${Date.now()}-${metadata.filename}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true,
      }
    );

    // TODO: Get audio duration from file
    // For now, set to null and can be updated later with a library like 'music-metadata'
    const duration = null;

    // Create audio record in database
    const audio = await prisma.audio.create({
      data: {
        userId,
        filename: metadata.filename,
        audioUrl: blob.url,
        duration,
        fileSize: file.size,
        format,
        uploadSource: 'upload',
        tags: metadata.tags || [],
        description: metadata.description,
        status: 'ready',
      },
    });

    return NextResponse.json({
      success: true,
      audio,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        downloadUrl: blob.downloadUrl,
      },
    });

  } catch (error: any) {
    console.error('Upload audio error:', error);

    return NextResponse.json({
      error: 'Upload failed',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
