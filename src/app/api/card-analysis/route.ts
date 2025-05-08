import { NextResponse } from 'next/server';
import { getCardAnalysis } from '@/lib/services/perplexityService';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { cardName, issuingBank, country } = body;

    // Validate required fields
    if (!cardName) {
      return NextResponse.json(
        { error: 'Card name is required' },
        { status: 400 }
      );
    }

    if (!issuingBank) {
      return NextResponse.json(
        { error: 'Issuing bank is required' },
        { status: 400 }
      );
    }

    if (!country) {
      return NextResponse.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }

    // Get detailed card analysis
    const analysis = await getCardAnalysis(cardName, issuingBank, country);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error in card analysis API:', error);
    return NextResponse.json(
      { error: 'Failed to get card analysis' },
      { status: 500 }
    );
  }
} 