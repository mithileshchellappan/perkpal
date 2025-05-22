import { NextRequest, NextResponse } from 'next/server';
import {
  EcommerceCardAdvisorRequestDataSchema,
  EcommerceCardAdvisorRequestData,
  EcommerceCardAdvisorResponse
} from '@/types/cards';
import { getEcommerceCardSuggestions } from '@/lib/services/perplexityService';
import { getCachedEcommerceRewards, setCachedEcommerceRewards } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const validationResult = EcommerceCardAdvisorRequestDataSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Invalid request body',
          errors: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const validatedData: EcommerceCardAdvisorRequestData = validationResult.data;
    
    // Check if we have cached data for this country and cards combination
    const cachedData = await getCachedEcommerceRewards(
      validatedData.country,
      validatedData.cards
    );

    if (cachedData) {
      console.log('Using cached ecommerce rewards data');
      return NextResponse.json(cachedData);
    }

    console.log('Fetching ecommerce rewards data from Perplexity');
    const suggestionsResponse: EcommerceCardAdvisorResponse = await getEcommerceCardSuggestions(validatedData);
    
    // Cache the response for future use with 1-week TTL
    await setCachedEcommerceRewards(
      validatedData.country,
      validatedData.cards,
      suggestionsResponse
    );

    return NextResponse.json(suggestionsResponse);

  } catch (error: any) {
    console.error('[API /ecommerce-advisor POST] Error:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: `Server error: ${errorMessage}` }, { status: 500 });
  }
} 