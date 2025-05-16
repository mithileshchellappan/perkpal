import { NextResponse } from 'next/server';
import { addCardPointsEntry, getCardPointsHistory } from '@/lib/db';
import { AddCardPointsRequestSchema } from '@/types/points';

/**
 * GET card points history
 */
export async function GET(request: Request) {
  // For now, using a test user ID. In production, use Clerk auth
  const userId = 'test';
  
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const cardId = url.searchParams.get('cardId') || undefined;
    
    // Parse year/month parameters
    const startYear = url.searchParams.get('startYear') ? 
      parseInt(url.searchParams.get('startYear')!, 10) : undefined;
    const startMonth = url.searchParams.get('startMonth') ? 
      parseInt(url.searchParams.get('startMonth')!, 10) : undefined;
    const endYear = url.searchParams.get('endYear') ? 
      parseInt(url.searchParams.get('endYear')!, 10) : undefined;
    const endMonth = url.searchParams.get('endMonth') ? 
      parseInt(url.searchParams.get('endMonth')!, 10) : undefined;
    
    // Validate month ranges if present
    if (startMonth !== undefined && (startMonth < 1 || startMonth > 12)) {
      return NextResponse.json(
        { error: 'startMonth must be between 1 and 12' },
        { status: 400 }
      );
    }
    
    if (endMonth !== undefined && (endMonth < 1 || endMonth > 12)) {
      return NextResponse.json(
        { error: 'endMonth must be between 1 and 12' },
        { status: 400 }
      );
    }
    
    const pointsHistory = await getCardPointsHistory(userId, {
      cardId,
      startYear,
      startMonth,
      endYear,
      endMonth,
    });
    
    return NextResponse.json({ success: true, data: pointsHistory });
  } catch (error) {
    console.error('Error fetching card points history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card points history' }, 
      { status: 500 }
    );
  }
}

/**
 * POST - Add a new card points entry
 */
export async function POST(request: Request) {
  // For now, using a test user ID. In production, use Clerk auth
  const userId = 'test';
  
  try {
    const body = await request.json();
    
    // Validate the request body against the schema
    const validationResult = AddCardPointsRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.format()
        }, 
        { status: 400 }
      );
    }
    
    const { cardId, year, month, pointsBalance } = validationResult.data;
    
    try {
      const entry = await addCardPointsEntry({
        userId,
        cardId,
        year,
        month,
        pointsBalance
      });
      
      return NextResponse.json({ success: true, data: entry }, { status: 201 });
    } catch (error: any) {
      // Check specific error messages
      if (error.message.includes('Card not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Month must be between')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      throw error; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Error adding card points entry:', error);
    return NextResponse.json(
      { error: 'Failed to add card points entry' }, 
      { status: 500 }
    );
  }
} 