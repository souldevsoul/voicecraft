import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAuth } from '@/lib/get-current-user';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user ID
    const userId = await requireAuth();

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        error: 'No file provided',
      }, { status: 400 });
    }

    // Validate file type (audio only)
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/mp4'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
      return NextResponse.json({
        error: 'Invalid file type',
        details: `File type must be one of: ${allowedTypes.join(', ')}`,
      }, { status: 400 });
    }

    // Validate file size (max 20MB for voice cloning)
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: 'File too large',
        details: `File size must be less than 20MB`,
      }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(
      `voices/${userId}/${Date.now()}-${file.name}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true,
      }
    );

    return NextResponse.json({
      success: true,
      url: blob.url,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        downloadUrl: blob.downloadUrl,
      },
    });

  } catch (error: any) {
    console.error('Upload voice audio error:', error);

    return NextResponse.json({
      error: 'Upload failed',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
