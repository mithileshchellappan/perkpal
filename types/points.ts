import { z } from 'zod';

// Schema for card points tracking
export const CardPointsEntrySchema = z.object({
  id: z.string().optional(), // Will be generated when stored
  userId: z.string(),
  cardId: z.string(),
  year: z.number(), // Numeric year (e.g., 2023)
  month: z.number(), // Numeric month (1-12)
  pointsBalance: z.number(),
  createdAt: z.string().optional(), // Will be generated when stored
});

export type CardPointsEntry = z.infer<typeof CardPointsEntrySchema>;

// Schema for the request to add/update card points
export const AddCardPointsRequestSchema = z.object({
  cardId: z.string(),
  year: z.number(), // Numeric year
  month: z.number().min(1).max(12), // Numeric month (1-12)
  pointsBalance: z.number(),
});

export type AddCardPointsRequest = z.infer<typeof AddCardPointsRequestSchema>;

// Schema for querying card points history
export const GetCardPointsHistoryRequestSchema = z.object({
  cardId: z.string().optional(), // If not provided, get for all user cards
  startYear: z.number().optional(), // Start year
  startMonth: z.number().min(1).max(12).optional(), // Start month (1-12)
  endYear: z.number().optional(), // End year
  endMonth: z.number().min(1).max(12).optional(), // End month (1-12)
});

export type GetCardPointsHistoryRequest = z.infer<typeof GetCardPointsHistoryRequestSchema>; 