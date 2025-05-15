import { NextResponse } from 'next/server';
import { getCardComparison } from '@/lib/services/perplexityService';
import { CardIdentifierSchema } from '@/types/cards';
import { z } from 'zod';

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

    // Get the card comparison from the service
    const comparisonData = await getCardComparison(cardsToCompare, country);

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