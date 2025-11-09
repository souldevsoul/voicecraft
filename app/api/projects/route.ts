import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema for create project
const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  audioIds: z.array(z.string().cuid()).optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

// Validation schema for list projects query
const ListProjectsQuerySchema = z.object({
  page: z.string().default('1').transform(Number).pipe(z.number().int().positive()),
  limit: z.string().default('20').transform(Number).pipe(z.number().int().positive().max(100)),
  sortBy: z.enum(['createdAt', 'name', 'deadline', 'priority']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['draft', 'estimating', 'ready', 'in_progress', 'completed', 'cancelled']).optional(),
  expertId: z.string().optional(),
  search: z.string().optional(),
});

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateProjectSchema.parse(body);

    // If audioIds provided, verify they exist and belong to user
    if (validatedData.audioIds && validatedData.audioIds.length > 0) {
      const audios = await prisma.audio.findMany({
        where: {
          id: { in: validatedData.audioIds },
          userId,
        },
        select: { id: true },
      });

      if (audios.length !== validatedData.audioIds.length) {
        return NextResponse.json({
          error: 'Invalid audio IDs',
          details: 'One or more audio IDs not found or do not belong to you',
        }, { status: 400 });
      }
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        userId,
        name: validatedData.name,
        description: validatedData.description,
        priority: validatedData.priority,
        tags: validatedData.tags || [],
        status: 'draft',
        // Add audios if provided
        projectAudios: validatedData.audioIds && validatedData.audioIds.length > 0 ? {
          create: validatedData.audioIds.map((audioId, index) => ({
            audioId,
            order: index,
            status: 'pending',
          })),
        } : undefined,
      },
      include: {
        projectAudios: {
          include: {
            audio: {
              select: {
                id: true,
                filename: true,
                duration: true,
                audioUrl: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      project,
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

    console.error('Create project error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}

// GET /api/projects - List projects
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
      expertId,
      search,
    } = ListProjectsQuerySchema.parse(queryParams);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    if (expertId) {
      where.expertId = expertId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.project.count({ where });

    // Get projects
    const projects = await prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        expert: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            specialization: true,
            rating: true,
          },
        },
        projectAudios: {
          select: {
            id: true,
            audioId: true,
            order: true,
            status: true,
          },
        },
        _count: {
          select: {
            projectAudios: true,
          },
        },
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      projects,
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

    console.error('List projects error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
