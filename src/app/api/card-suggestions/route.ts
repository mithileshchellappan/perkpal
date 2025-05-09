import { NextResponse } from 'next/server';
import { getCardSuggestions } from '@/lib/services/perplexityService';
import { getCachedCardSuggestions, setCachedCardSuggestions } from '@/lib/db';

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

    // Try to get from cache first
    let suggestions = getCachedCardSuggestions(bankName, country);

    if (suggestions) {
      console.log(`Cache hit for card suggestions: ${bankName}, ${country}`);
      return NextResponse.json({
        success: true,
        data: suggestions,
        source: 'cache',
      });
    }

    console.log(`Cache miss for card suggestions: ${bankName}, ${country}. Fetching from API.`);
    // Get card suggestions for the bank from service
    suggestions = await getCardSuggestions(bankName, country);

    // Store in cache for future requests
    if (suggestions) {
      setCachedCardSuggestions(bankName, country, suggestions);
    }

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