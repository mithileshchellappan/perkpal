import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { CardProductSuggestionResponse, ComprehensiveCardAnalysisResponse, CardFees, MilestoneBenefit } from '@/types/cards';

const dbDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'perplexity_cache.sqlite');
console.log('dbPath', dbPath);

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    createTables();
  }
  return db;
}

function createTables() {
  const dbInstance = getDb();
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS CardAnalyses (
      card_name TEXT NOT NULL,
      issuing_bank TEXT NOT NULL,
      country TEXT NOT NULL,
      analysis_data TEXT NOT NULL, -- JSON string of ComprehensiveCardAnalysisResponse
      base_value REAL,            -- Separate column for base_value
      base_value_currency TEXT,   -- Separate column for base_value_currency
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (card_name, issuing_bank, country)
    );
  `);

  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS CardSuggestions (
      bank_name TEXT NOT NULL,
      country TEXT NOT NULL,
      suggestions_data TEXT NOT NULL, -- JSON string of CardProductSuggestionResponse
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (bank_name, country)
    );
  `);
  
  // Add UserCards table for user card management functionality
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS UserCards (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      bin TEXT NOT NULL,
      cardProductName TEXT NOT NULL,
      issuingBank TEXT NOT NULL,
      network TEXT NOT NULL,
      country TEXT NOT NULL,
      pointsBalance REAL,
      last4Digits TEXT,
      cardAnalysisData TEXT,
      addedDate TEXT NOT NULL,
      UNIQUE(userId, id)
    );
  `);
}

// Helper to parse with potential nulls for optional complex types
function parseJSONSafe<T>(jsonString: string | null | undefined): T | null {
    if (jsonString == null) return null;
    try {
        return JSON.parse(jsonString) as T;
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        return null;
    }
}

export function getCachedCardAnalysis(cardName: string, issuingBank: string, country: string): ComprehensiveCardAnalysisResponse | null {
  const dbInstance = getDb();
  const stmt = dbInstance.prepare('SELECT analysis_data, base_value, base_value_currency FROM CardAnalyses WHERE card_name = ? AND issuing_bank = ? AND country = ?');
  const row = stmt.get(cardName, issuingBank, country) as { analysis_data: string, base_value: number | null, base_value_currency: string | null } | undefined;

  if (row) {
    const data = JSON.parse(row.analysis_data);
    // Ensure nested JSON strings are parsed if they were stored as such,
    // or handle cases where complex objects might need specific re-hydration.
    // Also ensure the base values from separate columns are used
    return {
        ...data,
        // Override with the values from separate columns
        base_value: row.base_value,
        base_value_currency: row.base_value_currency,
        fees: data.fees ? (typeof data.fees === 'string' ? parseJSONSafe<CardFees>(data.fees) : data.fees) : null,
        milestone_benefits: data.milestone_benefits ? (typeof data.milestone_benefits === 'string' ? parseJSONSafe<MilestoneBenefit[]>(data.milestone_benefits) : data.milestone_benefits) : [],
    } as ComprehensiveCardAnalysisResponse;
  }
  return null;
}

export function setCachedCardAnalysis(cardName: string, issuingBank: string, country: string, data: ComprehensiveCardAnalysisResponse): void {
  const dbInstance = getDb();
  const stmt = dbInstance.prepare('INSERT OR REPLACE INTO CardAnalyses (card_name, issuing_bank, country, analysis_data, base_value, base_value_currency) VALUES (?, ?, ?, ?, ?, ?)');
  // Stringify complex objects before insertion
  const dataToStore = {
    ...data,
    fees: data.fees ? JSON.stringify(data.fees) : null,
    milestone_benefits: data.milestone_benefits ? JSON.stringify(data.milestone_benefits) : null,
  };
  stmt.run(
    cardName, 
    issuingBank, 
    country, 
    JSON.stringify(dataToStore),
    data.base_value,  // Store base_value separately
    data.base_value_currency  // Store base_value_currency separately
  );
}

export function getCachedCardSuggestions(bankName: string, country: string): CardProductSuggestionResponse | null {
  const dbInstance = getDb();
  const stmt = dbInstance.prepare('SELECT suggestions_data FROM CardSuggestions WHERE bank_name = ? AND country = ?');
  const row = stmt.get(bankName, country) as { suggestions_data: string } | undefined;

  if (row) {
    return JSON.parse(row.suggestions_data) as CardProductSuggestionResponse;
  }
  return null;
}

export function setCachedCardSuggestions(bankName: string, country: string, data: CardProductSuggestionResponse): void {
  const dbInstance = getDb();
  const stmt = dbInstance.prepare('INSERT OR REPLACE INTO CardSuggestions (bank_name, country, suggestions_data) VALUES (?, ?, ?)');
  stmt.run(bankName, country, JSON.stringify(data));
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
  const dbInstance = getDb();
  
  // Query that joins UserCards with CardAnalyses table to get base_value for calculation
  const stmt = dbInstance.prepare(`
    SELECT uc.*, ca.base_value, ca.base_value_currency
    FROM UserCards uc
    LEFT JOIN CardAnalyses ca ON 
      uc.cardProductName = ca.card_name AND 
      uc.issuingBank = ca.issuing_bank AND
      uc.country = ca.country
    WHERE uc.userId = ?
  `);
  
  const rows = stmt.all(userId) as any[];
  
  return rows.map(row => {
    // Calculate approx value if both pointsBalance and base_value are available
    const approxPointsValue = 
      row.pointsBalance && row.base_value 
        ? row.pointsBalance * row.base_value 
        : undefined;
    
    return {
      ...row,
      pointsBalance: row.pointsBalance || undefined,
      last4Digits: row.last4Digits || undefined,
      base_value_currency: row.base_value_currency || undefined,
      approxPointsValue,
      cardAnalysisData: row.cardAnalysisData ? parseJSONSafe<ComprehensiveCardAnalysisResponse>(row.cardAnalysisData) : undefined
    };
  });
}

export async function getCardById(userId: string, cardId: string): Promise<(UserCard & { approxPointsValue?: number; base_value_currency?: string }) | undefined> {
  const dbInstance = getDb();
  
  // Similar join query as getUserCards but with specific card ID condition
  const stmt = dbInstance.prepare(`
    SELECT uc.*, ca.base_value, ca.base_value_currency
    FROM UserCards uc
    LEFT JOIN CardAnalyses ca ON 
      uc.cardProductName = ca.card_name AND 
      uc.issuingBank = ca.issuing_bank AND
      uc.country = ca.country
    WHERE uc.userId = ? AND uc.id = ?
  `);
  
  const row = stmt.get(userId, cardId) as any;
  
  if (!row) return undefined;
  
  // Calculate approx value if both pointsBalance and base_value are available
  const approxPointsValue = 
    row.pointsBalance && row.base_value 
      ? row.pointsBalance * row.base_value 
      : undefined;
  
  return {
    ...row,
    pointsBalance: row.pointsBalance || undefined,
    last4Digits: row.last4Digits || undefined,
    base_value_currency: row.base_value_currency || undefined,
    approxPointsValue,
    cardAnalysisData: row.cardAnalysisData ? parseJSONSafe<ComprehensiveCardAnalysisResponse>(row.cardAnalysisData) : undefined
  };
}

export async function addUserCard(userId: string, cardData: Omit<UserCard, 'id' | 'addedDate' | 'userId'>): Promise<UserCard> {
  const dbInstance = getDb();
  
  const newCard: UserCard = {
    ...cardData,
    id: crypto.randomUUID(),
    userId,
    addedDate: new Date().toISOString(),
  };
  
  const stmt = dbInstance.prepare(`
    INSERT INTO UserCards (
      id, userId, bin, cardProductName, issuingBank, network, country,
      pointsBalance, last4Digits, cardAnalysisData, addedDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    newCard.id,
    newCard.userId,
    newCard.bin,
    newCard.cardProductName,
    newCard.issuingBank,
    newCard.network,
    newCard.country,
    newCard.pointsBalance || null,
    newCard.last4Digits || null,
    newCard.cardAnalysisData ? JSON.stringify(newCard.cardAnalysisData) : null,
    newCard.addedDate
  );
  
  return newCard;
}

export async function updateUserCard(
  userId: string, 
  cardId: string, 
  updates: Partial<Omit<UserCard, 'id' | 'userId' | 'addedDate'>>
): Promise<UserCard | null> {
  const dbInstance = getDb();
  
  // First check if the card exists
  const existingCard = await getCardById(userId, cardId);
  if (!existingCard) {
    return null;
  }
  
  // Build the update SQL dynamically based on what fields are being updated
  const updateFields: string[] = [];
  const params: any[] = [];
  
  for (const [key, value] of Object.entries(updates)) {
    if (key === 'cardAnalysisData') {
      updateFields.push(`${key} = ?`);
      params.push(value ? JSON.stringify(value) : null);
    } else {
      updateFields.push(`${key} = ?`);
      params.push(value === undefined ? null : value);
    }
  }
  
  if (updateFields.length === 0) {
    return existingCard; // Nothing to update
  }
  
  const updateSQL = `UPDATE UserCards SET ${updateFields.join(', ')} WHERE userId = ? AND id = ?`;
  params.push(userId, cardId);
  
  const stmt = dbInstance.prepare(updateSQL);
  stmt.run(...params);
  
  // Return the updated card
  return await getCardById(userId, cardId) as UserCard;
}

export async function deleteUserCard(userId: string, cardId: string): Promise<boolean> {
  const dbInstance = getDb();
  const stmt = dbInstance.prepare('DELETE FROM UserCards WHERE userId = ? AND id = ?');
  const result = stmt.run(userId, cardId);
  
  return result.changes > 0;
}

export async function storeCardAnalysisForUserCard(
  userId: string, 
  cardId: string, 
  analysisData: ComprehensiveCardAnalysisResponse
): Promise<UserCard | null> {
  return updateUserCard(userId, cardId, { cardAnalysisData: analysisData });
}

// Initialize tables on module load
createTables(); 