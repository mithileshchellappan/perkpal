import { perplexity } from '@ai-sdk/perplexity';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

// Type for card suggestion response
export interface CardProductSuggestionResponse {
  issuing_bank: string;
  suggested_cards: {
    card_name: string;
    brief_description: string;
  }[];
}

// Zod schema for CardProductSuggestionResponse
export const CardProductSuggestionResponseSchema = z.object({
  issuing_bank: z.string(),
  suggested_cards: z.array(
    z.object({
      card_name: z.string(),
      brief_description: z.string(),
    })
  ),
});

// Types for comprehensive card analysis
export interface ComprehensiveCardAnalysisResponse {
  card_name: string;
  issuing_bank: string;
  base_value: number | null;
  base_value_currency: string | null;
  earning_rewards: {
    category: string;
    multiplier_description: string;
    multiplier_value_int?: number | null;
    notes: string | null;
  }[];
  redemption_options: {
    type: string;
    value_per_point_cents: number | null;
    value_description: string;
  }[];
  transfer_partners: {
    partner_name: string;
    partner_type: 'Airline' | 'Hotel';
    transfer_ratio: string;
    notes: string | null;
  }[];
  strategic_insights: {
    strategy_title: string;
    description: string;
    value_proposition: string;
  }[];
  domestic_lounges_available?: number | null;
  international_lounges_available?: number | null;
  fees?: CardFees | null;
  milestone_benefits?: MilestoneBenefit[] | null;
}

// Interface for card fees (new)
export interface CardFees {
  joining_amount?: string | null;
  renewal_amount?: string | null;
  forex_percentage?: string | null;
  apr_description?: string | null;
  addon_card_amount?: string | null;
  reward_redemption_description?: string | null;
  // Currency is assumed to be base_value_currency
}

// Zod schema for CardFees (new)
export const CardFeesSchema = z.object({
  joining_amount: z.string().nullable().optional(),
  renewal_amount: z.string().nullable().optional(),
  forex_percentage: z.string().nullable().optional(),
  apr_description: z.string().nullable().optional(),
  addon_card_amount: z.string().nullable().optional(),
  reward_redemption_description: z.string().nullable().optional(),
});

// Interface for MilestoneBenefit (new)
export interface MilestoneBenefit {
  spend_level_description: string; // e.g., "Spend $5,000 in first 3 months"
  benefit_description: string[];     // e.g., ["Receive 10,000 bonus points", "Get a $100 statement credit"]
}

// Zod schema for MilestoneBenefit (new)
export const MilestoneBenefitSchema = z.object({
  spend_level_description: z.string(),
  benefit_description: z.array(z.string()),
});

// Zod schema for ComprehensiveCardAnalysisResponse
export const ComprehensiveCardAnalysisResponseSchema = z.object({
  card_name: z.string(),
  issuing_bank: z.string(),
  base_value: z.number().nullable(),
  base_value_currency: z.string().nullable(),
  earning_rewards: z.array(
    z.object({
      category: z.string(),
      multiplier_description: z.string(),
      multiplier_value_int: z.number().nullable().optional(),
      notes: z.string().nullable(),
    })
  ),
  redemption_options: z.array(
    z.object({
      type: z.string(),
      value_per_point_cents: z.number().nullable(),
      value_description: z.string(),
    })
  ),
  transfer_partners: z.array(
    z.object({
      partner_name: z.string(),
      partner_type: z.enum(['Airline', 'Hotel']),
      transfer_ratio: z.string(),
      notes: z.string().nullable(),
    })
  ),
  strategic_insights: z.array(
    z.object({
      strategy_title: z.string(),
      description: z.string(),
      value_proposition: z.string(),
    })
  ),
  domestic_lounges_available: z.number().nullable().optional(),
  international_lounges_available: z.number().nullable().optional(),
  fees: CardFeesSchema.nullable().optional(),
  milestone_benefits: z.array(MilestoneBenefitSchema).nullable().optional(),
});

// Types for promotion spotlight response
export interface PromotionSpotlightResponse {
  card_context: string;
  promotions: {
    promotion_title: string;
    description: string;
    partner_involved: string | null;
    offer_type: string;
    valid_until: string | null;
    source_url: string | null;
  }[];
}

// Zod schema for PromotionSpotlightResponse
export const PromotionSpotlightResponseSchema = z.object({
  card_context: z.string(),
  promotions: z.array(
    z.object({
      promotion_title: z.string(),
      description: z.string(),
      partner_involved: z.string().nullable(),
      offer_type: z.string(),
      valid_until: z.string().nullable(),
      source_url: z.string().nullable(),
    })
  ),
});

/**
 * Call the Perplexity API with a prompt and get a structured JSON object
 * @param prompt The prompt to send to Perplexity
 * @param systemPrompt The system prompt for the AI
 * @param schema The Zod schema for the expected JSON response
 * @returns The parsed JSON object matching the schema
 */
async function queryPerplexity<T>(
  prompt: string,
  systemPrompt: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    // Using generateObject from AI SDK
    const { object } = await generateObject({
      model: perplexity('sonar-pro'),
      system: systemPrompt,
      prompt: prompt,
      schema: schema,
    });
    
    return object as T;
  } catch (error) {
    console.error('Error querying Perplexity API with AI SDK (generateObject):', error);
    if (error instanceof Error) {
        throw new Error(`Failed to query Perplexity API or validate schema (generateObject): ${error.message}`);
    }
    throw new Error('Failed to query Perplexity API or validate schema (generateObject) due to an unknown error.');
  }
}

/**
 * Get card suggestions for a given bank
 * @param bankName The name of the bank to get card suggestions for
 * @param country The country to get card suggestions for
 * @returns A list of card suggestions
 */
export async function getCardSuggestions(bankName: string, country: string): Promise<CardProductSuggestionResponse> {
  const systemPrompt = 'You are an AI assistant that provides accurate and concise information about credit card rewards and promotions. You always respond in the requested JSON format without any additional explanatory text or markdown formatting outside of the JSON structure itself.';
  const userPrompt = `
    For the bank ${bankName}, provide a list of their major personal credit card products currently offered in ${country}.

    Ensure the output is only the JSON object, with no preceding or succeeding text. Use standard escape characters for any quotes within string values.
  `;

  return queryPerplexity(
    userPrompt,
    systemPrompt,
    CardProductSuggestionResponseSchema
  );
}

/**
 * Get comprehensive card analysis for a selected card
 * @param cardName The name of the card to analyze
 * @param issuingBank The issuing bank of the card
 * @param country The country where the card is issued
 * @returns Detailed analysis of the card
 */
export async function getCardAnalysis(
  cardName: string, 
  issuingBank: string,
  country: string
): Promise<ComprehensiveCardAnalysisResponse> {
  const systemPrompt = 'You are an AI assistant that provides accurate and concise information about credit card rewards and promotions. You always respond in the requested JSON format without any additional explanatory text or markdown formatting outside of the JSON structure itself.';
  const userPrompt = `
    Provide a comprehensive rewards analysis for the '${cardName}' credit card from '${issuingBank}' in ${country}.

    Include details on earning rewards, redemption options, transfer partners, strategic insights, and lounge access (domestic and international).
    For monetary values like base point value, provide the amount and its currency (e.g., base_value_currency).
    
    Detail any applicable fees within a nested 'fees' object. This 'fees' object should include:
    - joining_amount (string with currency)
    - renewal_amount (string with currency)
    - forex_percentage (string, e.g., 3.5 for 3.5%)
    - apr_description (string, e.g., "15.99% - 23.99% variable")
    - addon_card_amount (string with currency)
    - reward_redemption_description (string, e.g., "Fee for redeeming points for specific rewards")
    The currency for all amounts within the 'fees' object should be assumed to be the same as the main 'base_value_currency' for the card, and should not be repeated for each fee.

    Additionally, if the card offers any milestone benefits (e.g., bonus points or credits for reaching certain spending thresholds within a specific timeframe), list them in an array called 'milestone_benefits'. Each object in this array should have:
    - spend_level_description (string, e.g., "Spend $5,000 in the first 3 months")
    - benefit_description (array of strings, e.g., ["Earn 50,000 bonus points", "Receive a $100 hotel voucher"])
 
    Use standard escape characters for any quotes within string values. If a particular piece of information isn't readily available or applicable, use null for optional fields or an empty array [] where appropriate for array fields, but try to populate all required fields.
  `;

  return queryPerplexity(
    userPrompt,
    systemPrompt,
    ComprehensiveCardAnalysisResponseSchema
  );
}

/**
 * Get current promotions for a card or rewards ecosystem
 * @param cardName The card name or ecosystem to search for promotions
 * @param country The country to search for promotions in
 * @param rewardsProgram Optional rewards program name (e.g., "Chase Ultimate Rewards")
 * @returns Current promotions for the card/ecosystem
 */
export async function getCardPromotions(
  cardName: string,
  country: string,
  rewardsProgram?: string
): Promise<PromotionSpotlightResponse> {
  const context = rewardsProgram 
    ? `${cardName} / ${rewardsProgram} points` 
    : cardName;
  
  const systemPrompt = 'You are an AI assistant that provides accurate and concise information about credit card rewards and promotions. You always respond in the requested JSON format without any additional explanatory text or markdown formatting outside of the JSON structure itself.';
  const userPrompt = `
    Are there any current, publicly available special promotions, transfer bonuses, or limited-time offers for the '${cardName}' card${rewardsProgram ? ` or its '${rewardsProgram}' ecosystem` : ''} in ${country}? Focus on offers that significantly enhance point value.

    Return the data strictly in the following JSON format. If no specific promotions are found, return an empty 'promotions' array. Ensure the output is only the JSON object.

    {
      "card_context": "${context}",
      "promotions": [
        {
          "promotion_title": "Example: 30% Bonus on Transfers to Airline X",
          "description": "Example: Get a 30% bonus when transferring your points to Airline X's frequent flyer program.",
          "partner_involved": "Example: Airline X",
          "offer_type": "Example: Transfer Bonus",
          "valid_until": "Example: 2024-07-31",
          "source_url": "Example: https://promos.example.com/airline_x_bonus"
        }
        // ... more promotions
      ]
    }
    Use standard escape characters for any quotes within string values.
  `;

  return queryPerplexity(
    userPrompt,
    systemPrompt,
    PromotionSpotlightResponseSchema
  );
} 