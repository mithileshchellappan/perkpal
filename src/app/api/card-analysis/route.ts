import { NextResponse } from 'next/server';
import { getCardAnalysis } from '@/lib/services/perplexityService';
import { getCachedCardAnalysis, setCachedCardAnalysis } from '@/lib/db';

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

    // Try to get from cache first
    let analysis = getCachedCardAnalysis(cardName, issuingBank, country);

    if (analysis) {
      console.log(`Cache hit for card analysis: ${cardName}, ${issuingBank}, ${country}`);
      return NextResponse.json({
        success: true,
        data: analysis,
        source: 'cache',
      });
    }

    console.log(`Cache miss for card analysis: ${cardName}, ${issuingBank}, ${country}. Fetching from API.`);
    // Get detailed card analysis from service
    analysis = await getCardAnalysis(cardName, issuingBank, country);

    // Store in cache for future requests
    if (analysis) {
      setCachedCardAnalysis(cardName, issuingBank, country, analysis);
    }

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