import { NextRequest, NextResponse } from 'next/server';
import {
  EcommerceCardAdvisorRequestDataSchema,
  EcommerceCardAdvisorRequestData,
  EcommerceCardAdvisorResponse
} from '@/types/cards';
import { getEcommerceCardSuggestions } from '@/lib/services/perplexityService';

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

    // Call the Perplexity service
    const suggestionsResponse: EcommerceCardAdvisorResponse = await getEcommerceCardSuggestions(validatedData);

    return NextResponse.json(suggestionsResponse);

  } catch (error: any) {
    console.error('[API /ecommerce-advisor POST] Error:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error.message) {
      errorMessage = error.message;
    }
    
    // Check if the error is from Perplexity or schema validation specifically
    if (error.message && (error.message.includes('Perplexity API') || error.message.includes('validate schema'))) {
        return NextResponse.json({ message: `Error processing request: ${errorMessage}` }, { status: 502 }); // Bad Gateway for upstream errors
    }

    return NextResponse.json({ message: `Server error: ${errorMessage}` }, { status: 500 });
  }
} 