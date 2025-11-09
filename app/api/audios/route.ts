import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema for query parameters
const ListAudiosQuerySchema = z.object({
  page: z.string().default('1').transform(Number).pipe(z.number().int().positive()),
  limit: z.string().default('20').transform(Number).pipe(z.number().int().positive().max(100)),
  sortBy: z.enum(['createdAt', 'filename', 'duration', 'fileSize']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['ready', 'processing', 'failed']).optional(),
  voiceId: z.string().optional(),
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
});

export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      voiceId,
      search,
      tags,
    } = ListAudiosQuerySchema.parse(queryParams);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    if (voiceId) {
      where.voiceId = voiceId;
    }

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      where.tags = {
        hasSome: tagArray,
      };
    }

    // Get total count for pagination
    const total = await prisma.audio.count({ where });

    // Get audios with pagination and sorting
    const audios = await prisma.audio.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
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

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      audios,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
      },
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

    console.error('List audios error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
