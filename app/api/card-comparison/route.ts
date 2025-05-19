import { NextResponse } from 'next/server';
import { getCardComparison } from '@/lib/services/perplexityService';
import { CardIdentifierSchema } from '@/types/cards';
import { z } from 'zod';
import { getCachedCardComparison, setCachedCardComparison } from '@/lib/db';

// Zod schema for the request body
const ComparisonRequestSchema = z.object({
  cardsToCompare: z.array(CardIdentifierSchema).min(2, { message: "At least two cards are required for comparison." }),
  country: z.string().min(1, { message: "Country is required." }),
});

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = ComparisonRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { cardsToCompare, country } = validationResult.data;

    // Try to get from cache first
    let comparisonData = await getCachedCardComparison(cardsToCompare, country);

    if (comparisonData) {
      console.log(`Cache hit for card comparison: ${country}, ${cardsToCompare.map(c => c.cardName).join(', ')}`);
      return NextResponse.json({
        success: true,
        data: comparisonData,
        source: 'cache',
      });
    }

    console.log(`Cache miss for card comparison: ${country}, ${cardsToCompare.map(c => c.cardName).join(', ')}. Fetching from API.`);
    // Get the card comparison from the service
    comparisonData = await getCardComparison(cardsToCompare, country);

    // Store in cache for future requests
    if (comparisonData) {
      await setCachedCardComparison(cardsToCompare, country, comparisonData);
    }

    return NextResponse.json({
      success: true,
      data: comparisonData,
    });

  } catch (error) {
    console.error('Error in card comparison API:', error);
    // Distinguish between known Zod errors (already handled) and other errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format after initial parse.', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to get card comparison' },
      { status: 500 }
    );
  }
} 