import { perplexity } from '@ai-sdk/perplexity';
// import { openai } from '@ai-sdk/openai';
import { generateText, generateObject } from 'ai';
import {
  // Schemas
  CardProductSuggestionResponseSchema,
  ComprehensiveCardAnalysisResponseSchema,
  PromotionSpotlightResponseSchema,
  CardComparisonResponseSchema,
  PersonalizedCardSuggestionResponseSchema,
  PersonalizedCardSuggestionRequestDataSchema,
  EcommerceCardAdvisorRequestDataSchema,
  EcommerceCardAdvisorResponseSchema,
  CardPartnerProgramsResponseSchema,
  // Types
  CardProductSuggestionResponse,
  ComprehensiveCardAnalysisResponse,
  PromotionSpotlightResponse,
  CardComparisonResponse,
  CardIdentifier,
  PersonalizedCardSuggestionRequestData,
  PersonalizedCardSuggestionResponse,
  EcommerceCardAdvisorRequestData,
  EcommerceCardAdvisorResponse,
  CardPartnerProgramsResponse
} from '@/types/cards';

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
  schema: any
): Promise<T> {
  try {
    const { object } = await generateObject({
      model: perplexity('sonar-pro'),
      system: systemPrompt,
      prompt: prompt,
      schema: schema,
      experimental_repairText: async ({text, error}) => {
        console.log("repair error", error);
        console.log(text.replace(/<think>.*?<\/think>/g, ''))
        return text.replaceAll(/<think>.*?<\/think>/g, '');
      },
      providerOptions: {
        perplexity: {
          thinking: {type: "enabled"},
          search_after_date_filter: "1/1/2025",
          web_search_options: {
            country: "India"
          }
        }
      }
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
  const systemPrompt = 'You are an AI assistant that provides accurate and concise information about credit card rewards and promotions. You always respond in the requested JSON format without any additional explanatory text or markdown formatting outside of the JSON structure itself. Do not include the character u0000 in your response.';
  const userPrompt = `
    For the bank ${bankName}, provide a list of their credit card products currently offered in ${country}. Ensure to cover all credit cards offered by the bank.

    Make sure to cover all segments of credit card offered by the bank, be it Ultra Premium, Premium, Business, Entry-Level, Co-Branded, etc.

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

    Include details on earning rewards, redemption options, and strategic insights.
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

/**
 * Get a comparison of multiple credit cards.
 * @param cardsToCompare Array of cards to compare (name and bank).
 * @param country The country where the cards are issued.
 * @returns A detailed comparison of the cards.
 */
export async function getCardComparison(
  cardsToCompare: CardIdentifier[],
  country: string
): Promise<CardComparisonResponse> {
  const systemPrompt = 'You are an AI assistant that provides accurate, detailed, and unbiased credit card comparisons. You always respond in the requested JSON format without any additional explanatory text or markdown formatting outside of the JSON structure itself. When financial figures like annual fees are mentioned, ensure to include the currency if commonly specified (e.g., USD, INR, CAD) or if the country context implies it clearly.';
  
  const cardListString = cardsToCompare.map(c => `'${c.cardName}' from '${c.issuingBank}'`).join(', and ');

  const userPrompt = `
    Provide a comprehensive comparison for the following credit cards in ${country}: ${cardListString}.

    For each card, detail the following:
    - card_name: The name of the card.
    - issuing_bank: The bank issuing the card.
    - reward_on_spending: A string describing the reward on spending, or null if none.
    - pros: An array of key advantages (e.g., strong rewards on travel, excellent customer service).
    - cons: An array of key disadvantages (e.g., high annual fee, poor reward redemption value for certain categories).
    - fees: A detailed breakdown of fees. This should be an object including:
        - joining_amount (string with currency, or null)
        - renewal_amount (string with currency, or null)
        - forex_percentage (string, e.g., "3.5%" or null)
        - apr_description (string, e.g., "15.99% - 23.99% variable" or null)
        - addon_card_amount (string with currency, or null)
        - reward_redemption_description (string, for any fees related to redeeming rewards, or null)
    - transfer_partners: An array of objects, each detailing a transfer partner, including:
        - partner_name (string)
        - partner_type ('Airline' or 'Hotel')
        - transfer_ratio (string, e.g., "1:1", "1000:750")
        - notes (string or null, for any specific conditions or remarks)
    - welcome_offer_summary: A string summarizing the current welcome offer (e.g., "50,000 bonus points after spending $3,000 in 3 months"), or null if none significant.
    - key_reward_highlights: An array of strings highlighting the main ways to earn rewards (e.g., "5x points on travel purchased through their portal", "2% cash back on all purchases", "3 points per dollar on dining").
    - annual_fee_display: A string clearly stating the annual fee, including currency and any conditions like 'first year free' (e.g., "$95 USD", "₹499 + GST", "€0 first year, then €120").
    - lounge_access: An object describing lounge access benefits, including:
        - international_count (string or null) (describe the count and cycle)
        - domestic_count (string or null) (describe the count and cycle)
    - overall_evaluation: A brief evaluation of this specific card in the context of this comparison.

    After detailing each card, provide:
    - comparison_summary: An overall summary that highlights the key differences and comparative strengths or weaknesses across all cards compared.
    - recommendation_notes: An array of strings providing specific advice or considerations for different user profiles when choosing between these cards (e.g., "For frequent international travelers, Card A is superior due to its forex benefits and lounge access.", "If your primary spend is groceries, Card B offers better rewards in that category.").

    Ensure the output is ONLY the JSON object. If information for a specific field is not available or not applicable for a card, use null for optional string/object fields and empty arrays [] for array fields, but try to populate all required fields. 
    The country for this comparison is ${country}.
  `;

  return queryPerplexity(
    userPrompt,
    systemPrompt,
    CardComparisonResponseSchema
  );
}

/**
 * Get personalized credit card suggestions for a user.
 * @param requestData Data about the user's current cards and preferences.
 * @returns Personalized card suggestions.
 */
export async function getPersonalizedCardSuggestions(
  requestData: PersonalizedCardSuggestionRequestData
): Promise<PersonalizedCardSuggestionResponse> {
  const systemPrompt = 'You are an expert financial advisor AI specializing in credit card recommendations. You provide insightful, personalized advice based on the user\'s current portfolio and stated needs. Always respond in the requested JSON format without any additional explanatory text or markdown. Focus on actionable and clear suggestions.';

  let userContext = `The user is from ${requestData.country}.\n`;
  if (requestData.current_cards && requestData.current_cards.length > 0) {
    userContext += `They currently hold the following cards: ${requestData.current_cards.map(c => `${c.cardName} by ${c.issuingBank}`).join(', ')}.\n`;
  } else {
    userContext += "They currently hold no cards or haven't specified them.\n";
  }

  if (requestData.desired_card_type) {
    userContext += `They are specifically looking for a card with a focus on: ${requestData.desired_card_type} (e.g., Travel, Cashback, Fuel, Rewards, No Annual Fee, Forex Optimized, Balance Transfer).\n`;
  }

  if (requestData.primary_spending_categories && requestData.primary_spending_categories.length > 0) {
    userContext += `Their primary spending categories are: ${requestData.primary_spending_categories.join(', ')}.\n`;
  }

  if (requestData.additional_preferences) {
    userContext += `Additional preferences include: ${requestData.additional_preferences}.\n`;
  }

  const userPrompt = `
    ${userContext}
    Based on the user\'s profile and card preferences for ${requestData.country}, please provide the following in JSON format:

    1.  "evaluation_of_current_cards": (Nullable string) A brief analysis of their current card portfolio. For example, identify any gaps, overlaps, or how well their current cards meet their stated (or implied) needs. If they have no cards, state that this part is not applicable or suggest foundational card types.
    2.  "suggested_cards": (Array, max 3) Recommend up to three new credit cards. For each card, include:
        *   "card_name": The official name of the card.
        *   "issuing_bank": The bank that issues the card.
        *   "justification": A concise explanation of why this card is a good fit for the user, considering their existing cards and preferences.
        *   "key_benefits": An array of 2-4 key features or benefits (e.g., "5x points on travel", "No foreign transaction fees", "Complimentary airport lounge access").
        *   "primary_card_category": Your assessment of the card\'s main type (e.g., "Premium Travel Rewards", "Everyday Cashback", "Fuel Co-branded").
           If a "desired_card_type" was specified by the user, the recommended cards should primarily align with that type. If no type was specified, suggest a diverse set if appropriate or focus on general value.
    3.  "important_considerations": (Nullable array of strings) Any general advice, warnings, or important factors the user should consider when applying for or using these new cards (e.g., "Consider the annual fees against your spending habits", "Check for specific welcome offer terms and conditions").

    Ensure your response is ONLY the JSON object. If information isn\'t available or applicable, use null for optional fields or empty arrays for array fields where appropriate.
  `;

  return queryPerplexity<PersonalizedCardSuggestionResponse>(
    userPrompt,
    systemPrompt,
    PersonalizedCardSuggestionResponseSchema
  );
}

/**
 * Get e-commerce card usage suggestions for a user's cards.
 * @param requestData Data about the user's current cards and country.
 * @returns E-commerce card usage suggestions.
 */
export async function getEcommerceCardSuggestions(
  requestData: EcommerceCardAdvisorRequestData
): Promise<EcommerceCardAdvisorResponse> {
  const systemPrompt = 'You are an AI assistant specializing in credit card rewards and e-commerce partnerships. You provide detailed recommendations on which of the user\'s cards to use for specific e-commerce platforms to maximize benefits. Respond ONLY in the requested JSON format. Ensure all string fields with URLs are valid URLs or null. For e-commerce partner logos, try to find official, publicly accessible URLs.';

  const userCardsString = requestData.cards.map(c => `'${c.cardName}' from '${c.issuingBank}'`).join(', ');

  const userPrompt = `
    The user is in ${requestData.country} and has the following credit cards: ${userCardsString}.

    Please identify at least 30 major and diverse e-commerce platforms and online retailers relevant to ${requestData.country} (e.g., Amazon, Flipkart, Myntra, Nykaa, MakeMyTrip, Swiggy, Zomato, BigBasket, JioMart, Tata CLiQ, AJIO, BookMyShow, Goibibo, Cleartrip, Pepperfry, Urban Company, Netmeds, Pharmeasy, Lenskart, FirstCry etc., but tailor to the country and ensure variety across categories like general retail, fashion, groceries, food delivery, travel, bill payments, electronics, health, and entertainment). For each platform, suggest which of the user's cards would be best to use, considering current offers, reward multipliers, or co-branded benefits.

    Structure your response according to the EcommerceCardAdvisorResponseSchema.
    The response should be a JSON object with the following top-level keys:
    - "country": (string) The country for which these recommendations are made (echo back ${requestData.country}).
    - "recommendations": (array) An array of e-commerce partner recommendations.
    - "overall_summary": (string or null) A brief overall summary or disclaimer if necessary.

    Each object in the "recommendations" array should have:
    - "ecomm_partner_name": (string) The name of the e-commerce platform (e.g., "Amazon India").
    - "ecomm_partner_logo_url": (string or null) A URL to the e-commerce partner's logo.
    - "cards_to_use": (array) An array of card suggestions for this platform. Each object here should have:
        - "cardName": (string) The name of the user's card to use.
        - "issuingBank": (string) The issuing bank of that card.
        - "rewardPoints": (string) A description of the rewards (e.g., "5% cashback on electronics", "10X points on fashion purchases", "Flat INR 500 off on orders above INR 2000").
        - "reasoning": (string or null) Brief reasoning for the suggestion (e.g., "Co-branded card with specific benefits", "Ongoing bank offer").
        - "source": (string URL or null) A direct link to the offer, promotion, or card benefit page if available.
    - "additional_notes": (string or null) Any other important notes, like offer validity, minimum purchase requirements, etc.

    Prioritize official and current offers. If specific offer details (like exact reward points or source URL) are not readily available, you can describe the general benefit or leave the field as null if appropriate.
    Ensure the output is strictly the JSON object as defined. Only include cards from the user's provided list: ${userCardsString}.
  `;

  return queryPerplexity<EcommerceCardAdvisorResponse>(
    userPrompt,
    systemPrompt,
    EcommerceCardAdvisorResponseSchema
  );
}

/**
 * Get partner programs for a card (airlines and hotels) with transfer ratios
 * @param cardName The name of the card to analyze
 * @param issuingBank The issuing bank of the card
 * @param country The country where the card is issued
 * @returns Details about partner programs and lounge access
 */
export async function getCardPartnerPrograms(
  cardName: string, 
  issuingBank: string,
  country: string
): Promise<CardPartnerProgramsResponse> {
  const systemPrompt = 'You are an AI assistant that provides accurate and concise information about credit card rewards and promotions. You always respond in the requested JSON format without any additional explanatory text or markdown formatting outside of the JSON structure itself.';
  const userPrompt = `
    Provide information about the partner programs (airlines and hotels) for the '${cardName}' credit card from '${issuingBank}' in ${country}.

    For each partner, include:
    - partner_name: The name of the airline or hotel partner
    - partner_type: Either 'Airline' or 'Hotel'
    - transfer_ratio: The transfer ratio (e.g., "1:1", "1000:750")
    - current_bonus: Any current promotional bonus for transferring to this partner (null if none)
    - transfer_url: URL to transfer points to this partner (null if not available)
    - logo_url: URL to the partner's logo from Wikipedia (e.g., https://upload.wikimedia.org/wikipedia/commons/thumb/...). Please find the actual Wikipedia URL for the official logo of each partner. If no Wikipedia logo is available, use null.

    Also include information about lounge access:
    - domestic_lounges_available: Number of domestic lounges available (null if unknown)
    - international_lounges_available: Number of international lounges available (null if unknown)

    Ensure the output is ONLY the JSON object without any additional text or explanations.
    Use standard escape characters for any quotes within string values.
  `;

  return queryPerplexity(
    userPrompt,
    systemPrompt,
    CardPartnerProgramsResponseSchema
  );
} 