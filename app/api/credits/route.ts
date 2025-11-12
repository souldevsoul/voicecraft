import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/get-current-user';
import { getUserCredits, getCreditHistory } from '@/lib/credits';

// GET /api/credits - Get user's current credit balance and history
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeHistory = searchParams.get('includeHistory') === 'true';
    const historyLimit = parseInt(searchParams.get('limit') || '50', 10);

    // Get current balance
    const balance = await getUserCredits(userId);

    const response: any = {
      success: true,
      balance,
    };

    // Include transaction history if requested
    if (includeHistory) {
      const history = await getCreditHistory(userId, historyLimit);
      response.history = history;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get credits error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get credit information',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
