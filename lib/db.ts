import { supabase, toCamelCase, toSnakeCase } from './supabase';
import { CardProductSuggestionResponse, ComprehensiveCardAnalysisResponse as InternalComprehensiveCardAnalysisResponse, CardPartnerProgramsResponse, PromotionSpotlightResponse, CardStatementAnalysisResponse, ComparisonRequest } from '@/types/cards';
import { CardPointsEntry } from '@/types/points';

// Re-export for use in other modules if needed, or use the internal one directly if not meant to be widely public
export type ComprehensiveCardAnalysisResponse = InternalComprehensiveCardAnalysisResponse;

// Utility function to check if Supabase client is initialized
function assertSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check your environment variables.');
  }
  return supabase;
}

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
        annual_fee: data.annual_fee,
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
  try {
    const db = assertSupabaseClient();
    
    const { data, error } = await db
      .from('partner_programs')
      .select('*')
      .eq('card_name', cardName)
      .eq('issuing_bank', issuingBank)
      .eq('country', country)
      .single();

    if (error || !data) {
      return null;
    }
    
    // Check if the data is expired
    if (data.expires_at && new Date(data.expires_at as string) < new Date()) {
      console.log(`Cached partner programs data for ${cardName} has expired`);
      return null;
    }

    try {
      return JSON.parse(data.partners_data as string) as CardPartnerProgramsResponse;
    } catch (e) {
      console.error('Error parsing partner programs data:', e);
      return null;
    }
  } catch (e) {
    console.error('Error retrieving cached partner programs:', e);
    return null;
  }
}

export async function setCachedCardPartnerPrograms(
  cardName: string,
  issuingBank: string,
  country: string,
  data: CardPartnerProgramsResponse
): Promise<void> {
  try {
    const db = assertSupabaseClient();
    
    // Calculate expiration date (1 week from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 1 week TTL
    
    const { error } = await db
      .from('partner_programs')
      .upsert(
        {
          card_name: cardName,
          issuing_bank: issuingBank,
          country: country,
          partners_data: JSON.stringify(data),
          timestamp: new Date().toISOString(),
          expires_at: expiresAt.toISOString(), // Add expiration date
        },
        { onConflict: 'card_name,issuing_bank,country' }
      );

    if (error) {
      console.error('Error setting cached partner programs:', error);
    }
  } catch (e) {
    console.error('Error caching partner programs:', e);
  }
}

// --- Promotion Cache Functions ---

export async function getCachedPromotions(
  cardName: string,
  issuingBank: string,
  country: string,
  rewardsProgramKey: string // Normalized: empty string if null/undefined
): Promise<PromotionSpotlightResponse | null> {
  if (!supabase) {
    console.warn('Supabase client not initialized, skipping cache read for promotions.');
    return null;
  }

  const { data: cachedEntry, error: cacheSelectError } = await supabase
    .from('cached_promotions')
    .select('promotions_data, expires_at')
    .eq('card_name', cardName)
    .eq('issuing_bank', issuingBank)
    .eq('country', country)
    .eq('rewards_program_key', rewardsProgramKey)
    .single();

  if (cacheSelectError && cacheSelectError.code !== 'PGRST116') { // PGRST116: row not found
    console.error('Supabase cache read error for promotions:', cacheSelectError);
    return null; // Error during read, treat as cache miss
  }

  if (cachedEntry && new Date(cachedEntry.expires_at) > new Date()) {
    // Cache hit and valid
    // Assuming promotions_data is already in the correct PromotionSpotlightResponse format
    return cachedEntry.promotions_data as PromotionSpotlightResponse;
  }

  return null; // Cache miss or expired
}

export async function setCachedPromotions(
  cardName: string,
  issuingBank: string,
  country: string,
  rewardsProgramKey: string, // Normalized
  promotionsData: PromotionSpotlightResponse // The full object from Perplexity
): Promise<void> {
  if (!supabase) {
    console.warn('Supabase client not initialized, skipping cache write for promotions.');
    return;
  }

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const { error: upsertError } = await supabase
    .from('cached_promotions')
    .upsert({
      card_name: cardName,
      issuing_bank: issuingBank,
      country: country,
      rewards_program_key: rewardsProgramKey,
      promotions_data: promotionsData,
      fetched_at: new Date().toISOString(),
      expires_at: sevenDaysFromNow.toISOString(),
    }, {
      onConflict: 'card_name,issuing_bank,country,rewards_program_key'
    });

  if (upsertError) {
    console.error('Supabase cache upsert error for promotions:', upsertError);
    // Don't fail the request if cache write fails, just log it
  }
}

// --- User Card Functions ---

export interface UserCard {
  id: string;
  userId: string;
  bin: string;
  cardName: string;
  bank: string;
  network: string;
  country: string;
  pointsBalance?: number;
  baseValue?: number;
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
    console.error('Error fetching user cards:', cardsError);
    return [];
  }

  // Get all unique combinations of card_name, bank, and country
  const cardAnalysisQueries = userCards.map(card => ({
    card_name: card.card_name,
    issuing_bank: card.bank,
    country: card.country
  }));

  // Remove duplicates to minimize queries
  const uniqueQueries = cardAnalysisQueries.filter((query, index, self) => 
    index === self.findIndex(q => 
      q.card_name === query.card_name && 
      q.issuing_bank === query.issuing_bank && 
      q.country === query.country
    )
  );

  // Fetch all needed card analyses in a single query
  const { data: analysesData, error: analysesError } = await supabase
    .from('card_analyses')
    .select('*')
    .in('card_name', uniqueQueries.map(q => q.card_name))
    .in('issuing_bank', uniqueQueries.map(q => q.issuing_bank))
    .in('country', uniqueQueries.map(q => q.country));

  const analysesMap = new Map();
  if (analysesData && !analysesError) {
    // Create a map for quick lookup
    analysesData.forEach(analysis => {
      const key = `${analysis.card_name}|${analysis.issuing_bank}|${analysis.country}`;
      analysesMap.set(key, analysis);
    });
  }

  // Process each card with its analysis data
  const cards = userCards.map(card => {
    const camelCard = toCamelCase(card) as any;
    
    // Format to match the UserCard interface
    const userCard: UserCard = {
      id: camelCard.id,
      userId: camelCard.userId,
      bin: camelCard.bin,
      cardName: camelCard.cardName,
      bank: camelCard.bank,
      network: camelCard.network,
      country: camelCard.country,
      baseValue: camelCard.baseValue,
      pointsBalance: camelCard.pointsBalance,
      cardAnalysisData: camelCard.cardAnalysisData 
        ? JSON.parse(camelCard.cardAnalysisData)
        : null,
      addedDate: camelCard.addedDate,
    };

    // Look up analysis from the map
    const lookupKey = `${card.card_name}|${card.bank}|${card.country}`;
    const analysis = analysesMap.get(lookupKey);
    
    let baseValue: number | null = null;
    let baseValueCurrency: string | null = null;

    if (!userCard.cardAnalysisData && analysis) {
      baseValue = analysis.base_value;
      baseValueCurrency = analysis.base_value_currency;
      
      // If we have analysis_data, parse it
      if (analysis.analysis_data) {
        try {
          userCard.cardAnalysisData = JSON.parse(analysis.analysis_data);
        } catch (e) {
          console.error('Error parsing analysis data:', e);
        }
      }
    } else if (userCard.cardAnalysisData) {
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
      currency: baseValueCurrency || undefined,
    };
  });

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
    cardName: camelCard.cardName,
    bank: camelCard.bank,
    network: camelCard.network,
    country: camelCard.country,
    pointsBalance: camelCard.pointsBalance,
    cardAnalysisData: camelCard.cardAnalysisData 
      ? JSON.parse(camelCard.cardAnalysisData)
      : null,
    addedDate: camelCard.addedDate,
  };

  // Get card analysis for base value
  let baseValue: number | null = null;
  let baseValueCurrency: string | null = null;

  if (!userCard.cardAnalysisData) {
    // Fetch the analysis data in a single query
    const { data: analysisData } = await supabase
      .from('card_analyses')
      .select('base_value, base_value_currency, analysis_data')
      .eq('card_name', card.card_name)
      .eq('issuing_bank', card.bank)
      .eq('country', card.country)
      .single();

    if (analysisData) {
      baseValue = analysisData.base_value;
      baseValueCurrency = analysisData.base_value_currency;
      
      // If we have analysis_data, parse it
      if (analysisData.analysis_data) {
        try {
          userCard.cardAnalysisData = JSON.parse(analysisData.analysis_data);
        } catch (e) {
          console.error('Error parsing analysis data:', e);
        }
      }
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

// --- Card Comparison Cache Functions ---

export async function getCachedCardComparison(
  cardsToCompare: ComparisonRequest['cardsToCompare'],
  country: string
): Promise<any | null> {
  try {
    const db = assertSupabaseClient();
    
    // Sort the cards to ensure consistent caching regardless of order
    const sortedCards = [...cardsToCompare].sort((a, b) => {
      if (a.issuingBank !== b.issuingBank) {
        return a.issuingBank.localeCompare(b.issuingBank);
      }
      return a.cardName.localeCompare(b.cardName);
    });
    
    const cardsJson = JSON.stringify(sortedCards);
    
    const { data, error } = await db
      .from('card_comparisons')
      .select('comparison_data, expires_at')
      .eq('country', country)
      .filter('cards_to_compare', 'eq', cardsJson)
      .single();

    if (error || !data) {
      return null;
    }
    
    // Check if the data is expired
    if (data.expires_at && new Date(data.expires_at as string) < new Date()) {
      console.log(`Cached card comparison data has expired`);
      return null;
    }

    return data.comparison_data;
  } catch (e) {
    console.error('Error retrieving cached card comparison:', e);
    return null;
  }
}

export async function setCachedCardComparison(
  cardsToCompare: Array<{ cardName?: string; issuingBank?: string }>,
  country: string,
  comparisonData: any
): Promise<void> {
  try {
    const db = assertSupabaseClient();
    
    // Sort the cards to ensure consistent caching regardless of order
    const sortedCards = [...cardsToCompare].sort((a, b) => {
      if (a.issuingBank !== b.issuingBank) {
        return a.issuingBank.localeCompare(b.issuingBank);
      }
      return a.cardName.localeCompare(b.cardName);
    });
    
    // Calculate expiration date (1 week from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 1 week TTL
    
    const { error } = await db
      .from('card_comparisons')
      .upsert(
        {
          cards_to_compare: sortedCards,
          country: country,
          comparison_data: comparisonData,
          timestamp: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: 'cards_to_compare,country' }
      );

    if (error) {
      console.error('Error setting cached card comparison:', error);
    }
  } catch (e) {
    console.error('Error caching card comparison:', e);
  }
}

// --- Card Statement Analysis Functions ---

export async function storeStatementAnalysis(
  analysis: CardStatementAnalysisResponse
): Promise<CardStatementAnalysisResponse> {
  try {
    const db = assertSupabaseClient();
    
    // First, store the statement analysis data
    const { data: analysisData, error: analysisError } = await db
      .from('statement_analyses')
      .upsert(
        {
          user_id: analysis.userId,
          card_name: analysis.cardName,
          issuing_bank: analysis.issuingBank,
          country: analysis.country,
          statement_period: analysis.statementPeriod,
          total_points_earned: analysis.totalPointsEarned,
          total_potential_points: analysis.totalPotentialPoints,
          points_missed_percentage: analysis.pointsMissedPercentage,
          categories: JSON.stringify(analysis.categories),
          created_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,card_name,issuing_bank,statement_period' }
      )
      .select()
      .single();
    
    if (analysisError) {
      console.error('Error storing statement analysis:', analysisError);
      throw new Error('Failed to store statement analysis');
    }
    
    // Get the card ID for this user's card
    const { data: cardData } = await db
      .from('user_cards')
      .select('id')
      .eq('user_id', analysis.userId)
      .eq('card_name', analysis.cardName)
      .eq('bank', analysis.issuingBank)
      .single();
    
    if (!cardData) {
      console.error('Could not find the card to update points');
      return analysis;
    }
    
    // Extract the month and year from the statement period (e.g., "May 2023")
    const [monthName, yearStr] = analysis.statementPeriod.split(' ');
    const year = parseInt(yearStr);
    const month = new Date(Date.parse(`${monthName} 1, ${yearStr}`)).getMonth() + 1; // Convert to 1-12
    
    // Update the card_points_history with the new points balance
    await addCardPointsEntry({
      userId: analysis.userId,
      cardId: cardData.id,
      year,
      month,
      pointsBalance: analysis.totalPointsEarned
    });
    
    // Update the card's current points balance in user_cards table
    await updateUserCard(analysis.userId, cardData.id, {
      pointsBalance: analysis.totalPointsEarned
    });
    
    return analysis;
  } catch (error) {
    console.error('Error storing statement analysis:', error);
    throw new Error(`Failed to store statement analysis: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// --- Ecommerce Rewards Cache Functions ---

export async function getCachedEcommerceRewards(
  country: string,
  cardIdentifiers: Array<{ cardName?: string; issuingBank?: string }>
): Promise<any | null> {
  try {
    const db = assertSupabaseClient();
    
    // Create a sorted key of card identifiers for consistent cache lookups
    const cardsKey = JSON.stringify(
      cardIdentifiers
        .map(card => `${card.cardName}:${card.issuingBank}`)
        .sort()
    );
    
    const { data, error } = await db
      .from('ecommerce_rewards')
      .select('*')
      .eq('country', country)
      .eq('cards_key', cardsKey)
      .single();

    if (error || !data) {
      return null;
    }
    
    // Check if the data is expired
    if (data.expires_at && new Date(data.expires_at as string) < new Date()) {
      console.log(`Cached ecommerce rewards data for ${country} has expired`);
      return null;
    }

    try {
      return JSON.parse(data.rewards_data as string);
    } catch (e) {
      console.error('Error parsing ecommerce rewards data:', e);
      return null;
    }
  } catch (e) {
    console.error('Error retrieving cached ecommerce rewards:', e);
    return null;
  }
}

export async function setCachedEcommerceRewards(
  country: string,
  cardIdentifiers: Array<{ cardName?: string; issuingBank?: string }>,
  rewardsData: any
): Promise<void> {
  try {
    const db = assertSupabaseClient();
    
    // Create a sorted key of card identifiers for consistent cache lookups
    const cardsKey = JSON.stringify(
      cardIdentifiers
        .map(card => `${card.cardName}:${card.issuingBank}`)
        .sort()
    );
    
    // Calculate expiration date (1 week from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 1 week TTL
    
    const { error } = await db
      .from('ecommerce_rewards')
      .upsert(
        {
          country: country,
          cards_key: cardsKey,
          rewards_data: JSON.stringify(rewardsData),
          timestamp: new Date().toISOString(),
          expires_at: expiresAt.toISOString(), // Add expiration date
        },
        { onConflict: 'country,cards_key' }
      );

    if (error) {
      console.error('Error setting cached ecommerce rewards:', error);
    }
  } catch (e) {
    console.error('Error caching ecommerce rewards:', e);
  }
} 