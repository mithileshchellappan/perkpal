import { NextResponse } from 'next/server';
import { getCardPromotions as fetchPromotionsFromService } from '@/lib/services/perplexityService';
import { getCachedPromotions, setCachedPromotions } from '@/lib/db'; // Import new DB functions
import { PromotionSpotlightResponseSchema, PromotionSpotlightResponse } from '@/types/cards';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { card: cardName, bankName: issuingBank, country, rewardsProgram } = body;

    if (!cardName || !issuingBank || !country) {
      return NextResponse.json(
        { error: 'Card name, bank name, and country are required' },
        { status: 400 }
      );
    }

    const rewardsProgramKey = rewardsProgram || ''; // Normalize for cache key

    // 1. Check cache using the new DB function
    const cachedPromotions = await getCachedPromotions(cardName, issuingBank, country, rewardsProgramKey);

    if (cachedPromotions) {
      // Cache hit and valid, validate structure before returning (optional but good practice)
      const validationResult = PromotionSpotlightResponseSchema.safeParse(cachedPromotions);
      if (validationResult.success) {
        return NextResponse.json({ success: true, data: validationResult.data });
      } else {
        console.warn('Cached promotion data failed validation:', validationResult.error.errors);
        // Proceed to fetch fresh data if cache is corrupt
      }
    }

    // 2. Fetch from Perplexity service if not in cache or expired
    const fetchedPromotionsData = await fetchPromotionsFromService(cardName, issuingBank, country, rewardsProgram);
    
    const validationResult = PromotionSpotlightResponseSchema.safeParse(fetchedPromotionsData);
    if (!validationResult.success) {
      console.error("Perplexity API response validation error:", validationResult.error.errors);
      return NextResponse.json(
        { error: "Invalid response format from AI service.", details: validationResult.error.errors },
        { status: 500 }
      );
    }
    const validatedPromotions = validationResult.data;

    // 3. Store in cache using the new DB function
    await setCachedPromotions(cardName, issuingBank, country, rewardsProgramKey, validatedPromotions);

    return NextResponse.json({ success: true, data: validatedPromotions });

  } catch (error: any) {
    console.error('Error in promotions API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get promotions' },
      { status: 500 }
    );
  }
} 