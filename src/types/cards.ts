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
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  fees: CardFeesSchema.nullable(),
  transfer_partners: ComprehensiveCardAnalysisResponseSchema.shape.transfer_partners,
  welcome_offer_summary: z.string().nullable(),
  key_reward_highlights: z.array(z.string()),
  annual_fee_display: z.string(),
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