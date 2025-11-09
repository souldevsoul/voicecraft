import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema for query parameters
const ListVoicesQuerySchema = z.object({
  page: z.string().default('1').transform(Number).pipe(z.number().int().positive()),
  limit: z.string().default('20').transform(Number).pipe(z.number().int().positive().max(100)),
  sortBy: z.enum(['createdAt', 'name', 'language']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['active', 'processing', 'failed']).optional(),
  language: z.string().optional(),
  isCloned: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
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
      language,
      isCloned,
    } = ListVoicesQuerySchema.parse(queryParams);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    if (language) {
      where.language = language;
    }

    if (isCloned !== undefined) {
      where.isCloned = isCloned;
    }

    // Get total count for pagination
    const total = await prisma.voice.count({ where });

    // Get voices with pagination and sorting
    const voices = await prisma.voice.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      voices,
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

    console.error('List voices error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
