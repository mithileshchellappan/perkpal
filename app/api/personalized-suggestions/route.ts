import { NextResponse } from 'next/server';
import {
  getPersonalizedCardSuggestions
} from '@/lib/services/perplexityService';
import { PersonalizedCardSuggestionRequestDataSchema } from '@/types/cards';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = PersonalizedCardSuggestionRequestDataSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request body for personalized suggestions',
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const requestData = validationResult.data;

    // Get personalized card suggestions from the service
    const suggestionsData = await getPersonalizedCardSuggestions(requestData);

    return NextResponse.json({
      success: true,
      data: suggestionsData,
    });

  } catch (error) {
    console.error('Error in personalized card suggestions API:', error);
    // Distinguish between known Zod errors (already handled) and other errors
    if (error instanceof z.ZodError) {
      // This case might be redundant if safeParse is used correctly,
      // but kept for robustness or if direct parse was used elsewhere.
      return NextResponse.json(
        { 
          error: 'Invalid request format after initial parse for personalized suggestions.', 
          details: error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to get personalized card suggestions' },
      { status: 500 }
    );
  }
} 