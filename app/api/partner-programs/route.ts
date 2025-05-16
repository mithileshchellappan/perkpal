import { NextResponse } from 'next/server';
import { getCardPartnerPrograms } from '@/lib/services/perplexityService';
import { getCachedCardPartnerPrograms, setCachedCardPartnerPrograms } from '@/lib/db';

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
    let partnerPrograms = await getCachedCardPartnerPrograms(cardName, issuingBank, country);

    if (partnerPrograms) {
      console.log(`Cache hit for partner programs: ${cardName}, ${issuingBank}, ${country}`);
      return NextResponse.json({
        success: true,
        data: partnerPrograms,
        source: 'cache',
      });
    }

    console.log(`Cache miss for partner programs: ${cardName}, ${issuingBank}, ${country}. Fetching from API.`);
    // Get partner programs from service
    partnerPrograms = await getCardPartnerPrograms(cardName, issuingBank, country);

    // Store in cache for future requests
    if (partnerPrograms) {
      await setCachedCardPartnerPrograms(cardName, issuingBank, country, partnerPrograms);
    }

    return NextResponse.json({
      success: true,
      data: partnerPrograms,
    });
  } catch (error) {
    console.error('Error in partner programs API:', error);
    return NextResponse.json(
      { error: 'Failed to get partner programs' },
      { status: 500 }
    );
  }
} 