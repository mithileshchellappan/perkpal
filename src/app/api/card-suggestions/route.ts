import { NextResponse } from 'next/server';
import { getCardSuggestions } from '@/lib/services/perplexityService';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { bankName, country } = body;

    // Validate the bank name
    if (!bankName) {
      return NextResponse.json(
        { error: 'Bank name is required' },
        { status: 400 }
      );
    }

    if (!country) {
      return NextResponse.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }

    // Get card suggestions for the bank
    const suggestions = await getCardSuggestions(bankName, country);

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Error in card suggestions API:', error);
    return NextResponse.json(
      { error: 'Failed to get card suggestions' },
      { status: 500 }
    );
  }
} 