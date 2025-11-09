import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Validation schemas
const ProjectIdSchema = z.string().cuid();

const EstimateRequestSchema = z.object({
  request: z.string().min(10, "Request must be at least 10 characters").max(5000, "Request too long"),
});

// POST /api/projects/[id]/estimate - Get AI estimation for project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = await params;

    // Validate project ID
    const projectId = ProjectIdSchema.parse(id);

    // Parse and validate request body
    const body = await request.json();
    const { request: userRequest } = EstimateRequestSchema.parse(body);

    // TODO: Get userId from session (for now using a placeholder)
    const userId = 'temp-user-id';

    // Get project with audios
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        projectAudios: {
          include: {
            audio: {
              select: {
                id: true,
                filename: true,
                duration: true,
                text: true,
                metadata: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({
        error: 'Project not found',
      }, { status: 404 });
    }

    if (project.projectAudios.length === 0) {
      return NextResponse.json({
        error: 'No audios in project',
        details: 'Add audios to the project before requesting an estimation',
      }, { status: 400 });
    }

    // Update project with request and status to "estimating"
    await prisma.project.update({
      where: { id: projectId },
      data: {
        request: userRequest,
        status: 'estimating',
      },
    });

    try {
      // Prepare project summary for OpenAI
      const totalDuration = project.projectAudios.reduce(
        (sum: number, pa: any) => sum + (pa.audio.duration || 0),
        0
      );
      const audioCount = project.projectAudios.length;

      const projectSummary = `
User Request: ${userRequest}

Project: ${project.name}
Description: ${project.description || 'No description'}
Priority: ${project.priority}
Total Audios: ${audioCount}
Total Duration: ${totalDuration.toFixed(2)} seconds (${(totalDuration / 60).toFixed(2)} minutes)

Audios:
${project.projectAudios.map((pa: any, index: number) =>
  `${index + 1}. ${pa.audio.filename} - ${pa.audio.duration || 'N/A'}s`
).join('\n')}
      `.trim();

      // Call OpenAI for estimation
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert audio project estimator. Given a project with audio files, estimate the cost and time required for an expert to complete the work. Consider factors like:
- Audio editing complexity
- Number of files
- Total duration
- Project priority
- Quality requirements

Provide a structured JSON response with:
- estimatedCost (in USD)
- estimatedDuration (in hours)
- breakdown (object with cost and time breakdown)
- recommendations (array of strings)`
          },
          {
            role: 'user',
            content: projectSummary
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const estimationText = completion.choices[0].message.content;
      const estimation = JSON.parse(estimationText || '{}');

      // Update project with estimation - now waiting for user to accept
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          status: 'waiting_for_estimate_accept',
          estimatedCost: estimation.estimatedCost || null,
          estimatedDuration: estimation.estimatedDuration || null,
          estimationData: estimation,
        },
        include: {
          projectAudios: {
            include: {
              audio: {
                select: {
                  id: true,
                  filename: true,
                  duration: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        estimation,
        project: updatedProject,
      });

    } catch (openaiError: any) {
      // Update project status back to draft on error
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'draft' },
      });

      console.error('OpenAI estimation error:', openaiError);

      return NextResponse.json({
        error: 'Estimation failed',
        details: openaiError.message || 'Unknown error',
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

    console.error('Estimate project error:', error);

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
