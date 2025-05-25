import { z } from 'zod';

// Card Product Suggestion Schema
export const CardProductSuggestionResponseSchema = z.object({
  issuing_bank: z.string(),
  suggested_cards: z.array(
    z.object({
      card_name: z.string(),
      brief_description: z.string(),
    })
  ),
});
export type CardProductSuggestionResponse = z.infer<typeof CardProductSuggestionResponseSchema>;

// Card Fees Schema
export const CardFeesSchema = z.object({
  joining_amount: z.string().nullable().optional(),
  renewal_amount: z.string().nullable().optional(),
  forex_percentage: z.string().nullable().optional(),
  apr_description: z.string().nullable().optional(),
  addon_card_amount: z.string().nullable().optional(),
  reward_redemption_description: z.string().nullable().optional(),
});
export type CardFees = z.infer<typeof CardFeesSchema>;

// Milestone Benefit Schema
export const MilestoneBenefitSchema = z.object({
  spend_level_description: z.string(),
  benefit_description: z.array(z.string()),
});
export type MilestoneBenefit = z.infer<typeof MilestoneBenefitSchema>;

// Comprehensive Card Analysis Schema
export const ComprehensiveCardAnalysisResponseSchema = z.object({
  card_name: z.string(),
  issuing_bank: z.string(),
  base_value: z.number().nullable(),
  base_value_currency: z.string().nullable(),
  annual_fee: z.number().nullable(),
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
  strategic_insights: z.array(
    z.object({
      strategy_title: z.string(),
      description: z.string(),
      value_proposition: z.string(),
    })
  ),
  fees: CardFeesSchema.nullable().optional(),
  milestone_benefits: z.array(MilestoneBenefitSchema).nullable().optional(),
});
export type ComprehensiveCardAnalysisResponse = z.infer<typeof ComprehensiveCardAnalysisResponseSchema>;

// Promotion Spotlight Schema
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
export type PromotionSpotlightResponse = z.infer<typeof PromotionSpotlightResponseSchema>;

// Card Comparison Schemas
export const CardIdentifierSchema = z.object({
  cardName: z.string(),
  issuingBank: z.string(),
});
export type CardIdentifier = z.infer<typeof CardIdentifierSchema>;

export const ComparedCardDetailsSchema = z.object({
  card_name: z.string(),
  issuing_bank: z.string(),
  reward_on_spending: z.string().nullable(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  fees: CardFeesSchema.nullable(),
  transfer_partners: z.array(
    z.object({
      partner_name: z.string(),
      partner_type: z.enum(['Airline', 'Hotel']),
      transfer_ratio: z.string(),
      notes: z.string().nullable(),
    })
  ),
  welcome_offer_summary: z.string().nullable(),
  key_reward_highlights: z.array(z.string()),
  annual_fee_display: z.string(),
  lounge_access: z.object({
    international_count: z.string().nullable(),
    domestic_count: z.string().nullable(),
  }),
  overall_evaluation: z.string(),
});
export type ComparedCardDetails = z.infer<typeof ComparedCardDetailsSchema>;

export const CardComparisonResponseSchema = z.object({
  comparison_country: z.string(),
  compared_cards: z.array(ComparedCardDetailsSchema),
  comparison_summary: z.string(),
  recommendation_notes: z.array(z.string()),
});
export type CardComparisonResponse = z.infer<typeof CardComparisonResponseSchema>;

// Personalized Card Suggestions Schemas
export const UserHeldCardSchema = z.object({
  cardName: z.string(),
  issuingBank: z.string(),
});
export type UserHeldCard = z.infer<typeof UserHeldCardSchema>;

export const PersonalizedCardSuggestionRequestDataSchema = z.object({
  current_cards: z.array(UserHeldCardSchema),
  desired_card_type: z.string().nullable(),
  country: z.string(),
  primary_spending_categories: z.array(z.string()).nullable(),
  additional_preferences: z.string().nullable(),
});
export type PersonalizedCardSuggestionRequestData = z.infer<typeof PersonalizedCardSuggestionRequestDataSchema>;

export const RecommendedCardDetailSchema = z.object({
  card_name: z.string(),
  issuing_bank: z.string(),
  justification: z.string(),
  key_benefits: z.array(z.string()),
  primary_card_category: z.string(),
});
export type RecommendedCardDetail = z.infer<typeof RecommendedCardDetailSchema>;

export const PersonalizedCardSuggestionResponseSchema = z.object({
  evaluation_of_current_cards: z.string().nullable(),
  suggested_cards: z.array(RecommendedCardDetailSchema).max(3),
  important_considerations: z.array(z.string()).nullable(),
});
export type PersonalizedCardSuggestionResponse = z.infer<typeof PersonalizedCardSuggestionResponseSchema>;

// Ecommerce Card Advisor Schemas
export const EcommerceCardAdvisorRequestDataSchema = z.object({
  cards: z.array(UserHeldCardSchema), // Reusing UserHeldCardSchema
  country: z.string(),
});
export type EcommerceCardAdvisorRequestData = z.infer<typeof EcommerceCardAdvisorRequestDataSchema>;

export const EcommercePartnerCardSuggestionSchema = z.object({
  cardName: z.string(),
  issuingBank: z.string(),
  rewardPoints: z.string(), // e.g., "10X Points", "5% Cashback"
  reasoning: z.string().nullable(), // Why this card is good for this ecomm partner
  source: z.string().nullable(), // URL to the offer or card page if applicable
});
export type EcommercePartnerCardSuggestion = z.infer<typeof EcommercePartnerCardSuggestionSchema>;

export const EcommercePartnerRecommendationSchema = z.object({
  ecomm_partner_name: z.string(), // e.g., "Amazon", "Flipkart"
  ecomm_partner_logo_url: z.string().nullable(), // URL for the logo
  cards_to_use: z.array(EcommercePartnerCardSuggestionSchema),
  additional_notes: z.string().nullable(), // Any other notes like "Offer valid till..."
});
export type EcommercePartnerRecommendation = z.infer<typeof EcommercePartnerRecommendationSchema>;

export const EcommerceCardAdvisorResponseSchema = z.object({
  country: z.string(),
  recommendations: z.array(EcommercePartnerRecommendationSchema),
  overall_summary: z.string().nullable(), // A brief summary or disclaimer
});
export type EcommerceCardAdvisorResponse = z.infer<typeof EcommerceCardAdvisorResponseSchema>;

// Card Statement Analysis Schemas
export const CardStatementCategorySchema = z.object({
  category: z.enum(['dining', 'travel', 'shopping', 'groceries', 'fuel', 'entertainment', 'utilities', 'other']),
  points_earned: z.number(),
  potential_points: z.number(),
  transactions_count: z.number(),
  total_spend: z.number(),
  currency: z.string(),
  optimization_tips: z.string().nullable(),
});
export type CardStatementCategory = z.infer<typeof CardStatementCategorySchema>;

export const CardStatementAnalysisRequestSchema = z.object({
  userId: z.string(),
  cardName: z.string(),
  issuingBank: z.string(),
  country: z.string(),
  statementMonth: z.string(), // e.g., "2023-05" for May 2023
  statementYear: z.string(),
});
export type CardStatementAnalysisRequest = z.infer<typeof CardStatementAnalysisRequestSchema>;

export const CardStatementAnalysisResponseSchema = z.object({
  userId: z.string(),
  cardName: z.string(),
  issuingBank: z.string(),
  country: z.string(),
  statementPeriod: z.string(), // e.g., "May 2023"
  totalPointsEarned: z.number(),
  totalPotentialPoints: z.number(),
  pointsBalance: z.number(),
  pointsMissedPercentage: z.number(), // percentage of potential points missed
  categories: z.array(CardStatementCategorySchema),
});
export type CardStatementAnalysisResponse = z.infer<typeof CardStatementAnalysisResponseSchema>;

// Partner Programs Schema
export const PartnerProgramSchema = z.object({
  partner_name: z.string(),
  partner_type: z.enum(['Airline', 'Hotel']),
  transfer_ratio: z.string(),
  current_bonus: z.string().nullable(),
  transfer_url: z.string().nullable(),
  logo_url: z.string().nullable(),
});
export type PartnerProgram = z.infer<typeof PartnerProgramSchema>;

export const CardPartnerProgramsResponseSchema = z.object({
  card_name: z.string(),
  issuing_bank: z.string(),
  partners: z.array(PartnerProgramSchema),
  domestic_lounges_available: z.number(),
  international_lounges_available: z.number(),
});
export type CardPartnerProgramsResponse = z.infer<typeof CardPartnerProgramsResponseSchema>;

// Card Offer Schema
export const CardOfferSchema = z.object({
  type: z.enum([
    'new_offer', 
    'transfer_bonus', 
    'merchant_offer', 
    'seasonal_promotion',
    'lounge_access_removal',
    'rewards_rate_reduction',
    'annual_fee_increase',
    'benefits_discontinued',
    'program_changes',
    'expiring_offers'
  ]),
  title: z.string(),
  description: z.string(),
  start_date: z.string(),
  end_date: z.string().nullable(),
  source_url: z.string(),
});
export type CardOffer = z.infer<typeof CardOfferSchema>;

export const CardOffersResponseSchema = z.array(CardOfferSchema);
export type CardOffersResponse = z.infer<typeof CardOffersResponseSchema>;

export const ComparisonRequestSchema = z.object({
  cardsToCompare: z.array(CardIdentifierSchema).min(2, { message: "At least two cards are required for comparison." }),
  country: z.string().min(1, { message: "Country is required." }),
});
export type ComparisonRequest = z.infer<typeof ComparisonRequestSchema>;