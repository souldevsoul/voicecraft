import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Zod validation schema for query parameters
const GetVoicesSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  includePublic: z.string().optional().transform(val => val === 'true'),
  status: z.enum(['active', 'processing', 'failed', 'all']).optional().default('all'),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
});

export async function GET(request: NextRequest) {
  try {
    // Get and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const params = {
      userId: searchParams.get('userId') || '',
      includePublic: searchParams.get('includePublic'),
      status: searchParams.get('status') as 'active' | 'processing' | 'failed' | 'all' | null,
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    };

    const validatedParams = GetVoicesSchema.parse(params);

    // Build filter conditions
    const where: any = {
      userId: validatedParams.userId,
    };

    if (validatedParams.status !== 'all') {
      where.status = validatedParams.status;
    }

    // Calculate pagination
    const skip = (validatedParams.page - 1) * validatedParams.limit;
    const take = validatedParams.limit;

    // Fetch voices from database
    const [voices, totalCount] = await Promise.all([
      prisma.voice.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
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
        },
      }),
      prisma.voice.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / validatedParams.limit);
    const hasMore = validatedParams.page < totalPages;

    return NextResponse.json({
      success: true,
      voices,
      pagination: {
        currentPage: validatedParams.page,
        totalPages,
        totalCount,
        limit: validatedParams.limit,
        hasMore,
      },
    });

  } catch (error: any) {
    console.error('Error fetching voices:', error);

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
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while fetching voices',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
