import { supabase, toCamelCase, toSnakeCase } from './supabase';
import { CardProductSuggestionResponse, ComprehensiveCardAnalysisResponse, CardPartnerProgramsResponse } from '@/types/cards';
import { CardPointsEntry } from '@/types/points';

// --- Card Analysis Cache Functions ---

export async function getCachedCardAnalysis(
  cardName: string,
  issuingBank: string,
  country: string
): Promise<ComprehensiveCardAnalysisResponse | null> {
  const { data, error } = await supabase
    .from('card_analyses')
    .select('*')
    .eq('card_name', cardName)
    .eq('issuing_bank', issuingBank)
    .eq('country', country)
    .single();

  if (error || !data) {
    return null;
  }

  // Convert snake_case to camelCase
  const cardData = toCamelCase(data);
  
  try {
    return {
      card_name: cardData.cardName,
      issuing_bank: cardData.issuingBank,
      base_value: cardData.baseValue,
      base_value_currency: cardData.baseValueCurrency,
      earning_rewards: JSON.parse(cardData.analysisData).earning_rewards,
      redemption_options: JSON.parse(cardData.analysisData).redemption_options,
      strategic_insights: JSON.parse(cardData.analysisData).strategic_insights,
      fees: JSON.parse(cardData.analysisData).fees,
      milestone_benefits: JSON.parse(cardData.analysisData).milestone_benefits || [],
    } as ComprehensiveCardAnalysisResponse;
  } catch (e) {
    console.error('Error parsing card analysis data:', e);
    return null;
  }
}

export async function setCachedCardAnalysis(
  cardName: string,
  issuingBank: string,
  country: string,
  data: ComprehensiveCardAnalysisResponse
): Promise<void> {
  const { error } = await supabase
    .from('card_analyses')
    .upsert(
      {
        card_name: cardName,
        issuing_bank: issuingBank,
        country: country,
        analysis_data: JSON.stringify(data),
        base_value: data.base_value,
        base_value_currency: data.base_value_currency,
        timestamp: new Date().toISOString(),
      },
      { onConflict: 'card_name,issuing_bank,country' }
    );

  if (error) {
    console.error('Error setting cached card analysis:', error);
  }
}

// --- Card Suggestions Cache Functions ---

export async function getCachedCardSuggestions(
  bankName: string,
  country: string
): Promise<CardProductSuggestionResponse | null> {
  const { data: cardProducts, error } = await supabase
    .from('bank_card_products')
    .select('card_name, brief_description')
    .eq('bank_name', bankName)
    .eq('country', country);

  if (error || !cardProducts || cardProducts.length === 0) {
    return null;
  }

  // Convert to the expected response format
  const response: CardProductSuggestionResponse = {
    issuing_bank: bankName,
    suggested_cards: cardProducts.map(product => ({
      card_name: product.card_name,
      brief_description: product.brief_description || ''
    }))
  };
  
  return response;
}

export async function setCachedCardSuggestions(
  bankName: string,
  country: string,
  data: CardProductSuggestionResponse
): Promise<void> {
  if (!data.suggested_cards || data.suggested_cards.length === 0) {
    console.error('No card products to store');
    return;
  }

  // Create an array of records to insert
  const cardProducts = data.suggested_cards.map(card => ({
    bank_name: bankName,
    country: country,
    card_name: card.card_name,
    brief_description: card.brief_description || null,
    timestamp: new Date().toISOString()
  }));

  // Use upsert to handle conflicts with existing records
  const { error } = await supabase
    .from('bank_card_products')
    .upsert(
      cardProducts,
      { onConflict: 'bank_name,card_name,country' }
    );

  if (error) {
    console.error('Error storing card products:', error);
  }
}

/**
 * Get all available bank card products from a specific bank
 * @param bankName Name of the bank to get card products for
 * @param country Country to get card products for
 * @returns Array of card products
 */
export async function getBankCardProducts(
  bankName?: string,
  country?: string
): Promise<Array<{
  id: string;
  bankName: string;
  cardName: string;
  country: string;
  briefDescription?: string;
  timestamp: string;
}>> {
  let query = supabase
    .from('bank_card_products')
    .select('*');
  
  if (bankName) {
    query = query.eq('bank_name', bankName);
  }
  
  if (country) {
    query = query.eq('country', country);
  }
  
  const { data, error } = await query.order('bank_name', { ascending: true });
  
  if (error || !data) {
    console.error('Error fetching bank card products:', error);
    return [];
  }
  
  // Convert snake_case to camelCase
  return data.map(product => toCamelCase(product)) as any[];
}

// --- Partner Programs Functions ---

export async function getCachedCardPartnerPrograms(
  cardName: string,
  issuingBank: string,
  country: string
): Promise<CardPartnerProgramsResponse | null> {
  const { data, error } = await supabase
    .from('partner_programs')
    .select('*')
    .eq('card_name', cardName)
    .eq('issuing_bank', issuingBank)
    .eq('country', country)
    .single();

  if (error || !data) {
    return null;
  }

  try {
    return JSON.parse(data.partners_data) as CardPartnerProgramsResponse;
  } catch (e) {
    console.error('Error parsing partner programs data:', e);
    return null;
  }
}

export async function setCachedCardPartnerPrograms(
  cardName: string,
  issuingBank: string,
  country: string,
  data: CardPartnerProgramsResponse
): Promise<void> {
  const { error } = await supabase
    .from('partner_programs')
    .upsert(
      {
        card_name: cardName,
        issuing_bank: issuingBank,
        country: country,
        partners_data: JSON.stringify(data),
        timestamp: new Date().toISOString(),
      },
      { onConflict: 'card_name,issuing_bank,country' }
    );

  if (error) {
    console.error('Error setting cached partner programs:', error);
  }
}

// --- User Card Functions ---

export interface UserCard {
  id: string;
  userId: string;
  bin: string;
  cardProductName: string;
  issuingBank: string;
  network: string;
  country: string;
  pointsBalance?: number;
  last4Digits?: string;
  cardAnalysisData?: ComprehensiveCardAnalysisResponse | null;
  addedDate: string;
}

export async function getUserCards(userId: string): Promise<(UserCard & { approxPointsValue?: number; base_value_currency?: string })[]> {
  // First get all user cards
  const { data: userCards, error: cardsError } = await supabase
    .from('user_cards')
    .select('*')
    .eq('user_id', userId);

  if (cardsError || !userCards) {
    return [];
  }

  // For each card, get the card analysis data to calculate approxPointsValue
  const cards = await Promise.all(
    userCards.map(async (card) => {
      const camelCard = toCamelCase(card) as any;
      
      // Format to match the UserCard interface
      const userCard: UserCard = {
        id: camelCard.id,
        userId: camelCard.userId,
        bin: camelCard.bin,
        cardProductName: camelCard.cardProductName,
        issuingBank: camelCard.issuingBank,
        network: camelCard.network,
        country: camelCard.country,
        pointsBalance: camelCard.pointsBalance,
        last4Digits: camelCard.last4Digits,
        cardAnalysisData: camelCard.cardAnalysisData 
          ? JSON.parse(camelCard.cardAnalysisData)
          : null,
        addedDate: camelCard.addedDate,
      };

      // Get card analysis for base value
      let baseValue: number | null = null;
      let baseValueCurrency: string | null = null;

      if (!userCard.cardAnalysisData) {
        const { data: analysisData } = await supabase
          .from('card_analyses')
          .select('base_value, base_value_currency')
          .eq('card_name', userCard.cardProductName)
          .eq('issuing_bank', userCard.issuingBank)
          .eq('country', userCard.country)
          .single();

        if (analysisData) {
          baseValue = analysisData.base_value;
          baseValueCurrency = analysisData.base_value_currency;
        }
      } else {
        baseValue = userCard.cardAnalysisData.base_value;
        baseValueCurrency = userCard.cardAnalysisData.base_value_currency;
      }

      // Calculate approximate points value if possible
      const approxPointsValue = 
        userCard.pointsBalance && baseValue 
          ? userCard.pointsBalance * baseValue 
          : undefined;

      return {
        ...userCard,
        approxPointsValue,
        base_value_currency: baseValueCurrency || undefined,
      };
    })
  );

  return cards;
}

export async function getCardById(userId: string, cardId: string): Promise<(UserCard & { approxPointsValue?: number; base_value_currency?: string }) | undefined> {
  const { data: card, error } = await supabase
    .from('user_cards')
    .select('*')
    .eq('user_id', userId)
    .eq('id', cardId)
    .single();

  if (error || !card) {
    return undefined;
  }

  const camelCard = toCamelCase(card) as any;
  
  // Format to match the UserCard interface
  const userCard: UserCard = {
    id: camelCard.id,
    userId: camelCard.userId,
    bin: camelCard.bin,
    cardProductName: camelCard.cardProductName,
    issuingBank: camelCard.issuingBank,
    network: camelCard.network,
    country: camelCard.country,
    pointsBalance: camelCard.pointsBalance,
    last4Digits: camelCard.last4Digits,
    cardAnalysisData: camelCard.cardAnalysisData 
      ? JSON.parse(camelCard.cardAnalysisData)
      : null,
    addedDate: camelCard.addedDate,
  };

  // Get card analysis for base value
  let baseValue: number | null = null;
  let baseValueCurrency: string | null = null;

  if (!userCard.cardAnalysisData) {
    const { data: analysisData } = await supabase
      .from('card_analyses')
      .select('base_value, base_value_currency')
      .eq('card_name', userCard.cardProductName)
      .eq('issuing_bank', userCard.issuingBank)
      .eq('country', userCard.country)
      .single();

    if (analysisData) {
      baseValue = analysisData.base_value;
      baseValueCurrency = analysisData.base_value_currency;
    }
  } else {
    baseValue = userCard.cardAnalysisData.base_value;
    baseValueCurrency = userCard.cardAnalysisData.base_value_currency;
  }

  // Calculate approximate points value if possible
  const approxPointsValue = 
    userCard.pointsBalance && baseValue 
      ? userCard.pointsBalance * baseValue 
      : undefined;

  return {
    ...userCard,
    approxPointsValue,
    base_value_currency: baseValueCurrency || undefined,
  };
}

export async function addUserCard(userId: string, cardData: Omit<UserCard, 'id' | 'addedDate' | 'userId'>): Promise<UserCard> {
  const newCard: UserCard = {
    ...cardData,
    id: crypto.randomUUID(),
    userId,
    addedDate: new Date().toISOString(),
  };
  
  // Convert to snake_case for Supabase
  const snakeCard = toSnakeCase(newCard);

  // Special handling for cardAnalysisData
  if (newCard.cardAnalysisData) {
    snakeCard.card_analysis_data = JSON.stringify(newCard.cardAnalysisData);
  }

  const { error } = await supabase
    .from('user_cards')
    .insert(snakeCard);

  if (error) {
    console.error('Error adding user card:', error);
    throw new Error('Failed to add user card');
  }

  return newCard;
}

export async function updateUserCard(
  userId: string, 
  cardId: string, 
  updates: Partial<Omit<UserCard, 'id' | 'userId' | 'addedDate'>>
): Promise<UserCard | null> {
  // First check if the card exists
  const existingCard = await getCardById(userId, cardId);
  if (!existingCard) {
    return null;
  }

  // Convert to snake_case for Supabase
  const snakeUpdates = toSnakeCase(updates);

  // Special handling for cardAnalysisData
  if (updates.cardAnalysisData) {
    snakeUpdates.card_analysis_data = JSON.stringify(updates.cardAnalysisData);
  }

  const { error } = await supabase
    .from('user_cards')
    .update(snakeUpdates)
    .eq('user_id', userId)
    .eq('id', cardId);

  if (error) {
    console.error('Error updating user card:', error);
    throw new Error('Failed to update user card');
  }

  // Return the updated card
  return await getCardById(userId, cardId) as UserCard;
}

export async function deleteUserCard(userId: string, cardId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_cards')
    .delete()
    .eq('user_id', userId)
    .eq('id', cardId);

  return !error;
}

export async function storeCardAnalysisForUserCard(
  userId: string, 
  cardId: string, 
  analysisData: ComprehensiveCardAnalysisResponse
): Promise<UserCard | null> {
  return updateUserCard(userId, cardId, { cardAnalysisData: analysisData });
}

// --- Card Points History Functions ---

export async function addCardPointsEntry(entry: Omit<CardPointsEntry, 'id' | 'createdAt'>): Promise<CardPointsEntry> {
  // Check if the card exists for this user
  const cardExists = await checkCardExists(entry.userId, entry.cardId);
  if (!cardExists) {
    throw new Error('Card not found. Cannot add points for a non-existent card.');
  }
  
  // Validate month range
  if (entry.month < 1 || entry.month > 12) {
    throw new Error('Month must be between 1 and 12.');
  }
  
  const newEntry: CardPointsEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  // Convert to snake_case for Supabase
  const snakeEntry = toSnakeCase(newEntry);
  
  // Check if an entry already exists for this month/year/card
  const { data: existingEntry } = await supabase
    .from('card_points_history')
    .select('id')
    .eq('user_id', entry.userId)
    .eq('card_id', entry.cardId)
    .eq('year', entry.year)
    .eq('month', entry.month)
    .single();
  
  if (existingEntry) {
    // Update existing entry
    const { error } = await supabase
      .from('card_points_history')
      .update({ 
        points_balance: newEntry.pointsBalance,
        created_at: newEntry.createdAt 
      })
      .eq('id', existingEntry.id);
    
    if (error) {
      console.error('Error updating card points entry:', error);
      throw new Error('Failed to update card points entry');
    }
  } else {
    // Insert new entry
    const { error } = await supabase
      .from('card_points_history')
      .insert(snakeEntry);
    
    if (error) {
      console.error('Error adding card points entry:', error);
      throw new Error('Failed to add card points entry');
    }
  }
  
  return newEntry;
}

export async function getCardPointsHistory(
  userId: string,
  options?: {
    cardId?: string;
    startYear?: number;
    startMonth?: number;
    endYear?: number;
    endMonth?: number;
  }
): Promise<CardPointsEntry[]> {
  let query = supabase
    .from('card_points_history')
    .select('*')
    .eq('user_id', userId);
  
  if (options?.cardId) {
    query = query.eq('card_id', options.cardId);
  }
  
  // Handle date range filtering using Supabase query filtering
  if (options?.startYear && options?.startMonth) {
    // Filter for entries after or equal to start year/month
    query = query.or(`year.gt.${options.startYear},and(year.eq.${options.startYear},month.gte.${options.startMonth})`);
  } else if (options?.startYear) {
    query = query.gte('year', options.startYear);
  }
  
  if (options?.endYear && options?.endMonth) {
    // Filter for entries before or equal to end year/month
    query = query.or(`year.lt.${options.endYear},and(year.eq.${options.endYear},month.lte.${options.endMonth})`);
  } else if (options?.endYear) {
    query = query.lte('year', options.endYear);
  }
  
  // Order by year and month
  query = query.order('year', { ascending: true }).order('month', { ascending: true });
  
  const { data, error } = await query;
  
  if (error || !data) {
    console.error('Error getting card points history:', error);
    return [];
  }
  
  // Convert snake_case to camelCase
  return data.map(entry => ({
    id: entry.id,
    userId: entry.user_id,
    cardId: entry.card_id,
    year: entry.year,
    month: entry.month,
    pointsBalance: entry.points_balance,
    createdAt: entry.created_at
  }));
}

// Helper function to check if a card exists for a user
async function checkCardExists(userId: string, cardId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_cards')
    .select('id')
    .eq('user_id', userId)
    .eq('id', cardId)
    .single();
  
  return !!data;
} 