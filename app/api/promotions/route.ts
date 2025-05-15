import { NextResponse } from 'next/server';
import { getCardPromotions } from '@/lib/services/perplexityService';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { cardName, rewardsProgram } = body;

    // Validate required fields
    if (!cardName) {
      return NextResponse.json(
        { error: 'Card name is required' },
        { status: 400 }
      );
    }

    // Get current promotions for the card/rewards program
    const promotions = await getCardPromotions(cardName, rewardsProgram);

    return NextResponse.json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    console.error('Error in promotions API:', error);
    return NextResponse.json(
      { error: 'Failed to get promotions' },
      { status: 500 }
    );
  }
} 