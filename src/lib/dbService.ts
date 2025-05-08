import fs from 'fs/promises';
import path from 'path';
import { ComprehensiveCardAnalysisResponse } from './services/perplexityService'; 

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'db.json');

export interface UserCard {
  id: string; // Unique ID for the card entry (e.g., UUID)
  userId: string; // Identifier for the user
  bin: string; // First 6-8 digits
  cardProductName: string; // e.g., "Chase Sapphire Preferred"
  issuingBank: string; 
  network: string; 
  pointsBalance?: number; 
  last4Digits?: string; // Optional
  cardAnalysisData?: ComprehensiveCardAnalysisResponse | null; // Store fetched analysis, can be null initially
  addedDate: string; // ISO date string
}

interface DatabaseSchema {
  userCards: { [userId: string]: UserCard[] };
  // We could add other tables/collections here in the future
}

async function readDb(): Promise<DatabaseSchema> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, initialize with empty structure
      return { userCards: {} };
    }
    console.error('Error reading database:', error);
    throw new Error('Could not read database.');
  }
}

async function writeDb(data: DatabaseSchema): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
    throw new Error('Could not write to database.');
  }
}

// --- User Card Functions ---

export async function getUserCards(userId: string): Promise<UserCard[]> {
  const db = await readDb();
  return db.userCards[userId] || [];
}

export async function getCardById(userId: string, cardId: string): Promise<UserCard | undefined> {
  const userCards = await getUserCards(userId);
  return userCards.find(card => card.id === cardId);
}

export async function addUserCard(userId: string, cardData: Omit<UserCard, 'id' | 'addedDate' | 'userId'>): Promise<UserCard> {
  const db = await readDb();
  if (!db.userCards[userId]) {
    db.userCards[userId] = [];
  }

  const newCard: UserCard = {
    ...cardData,
    id: crypto.randomUUID(), // Generate a unique ID
    userId,
    addedDate: new Date().toISOString(),
  };

  db.userCards[userId].push(newCard);
  await writeDb(db);
  return newCard;
}

export async function updateUserCard(userId: string, cardId: string, updates: Partial<Omit<UserCard, 'id' | 'userId' | 'addedDate'>>): Promise<UserCard | null> {
  const db = await readDb();
  if (!db.userCards[userId]) {
    return null;
  }

  const cardIndex = db.userCards[userId].findIndex(card => card.id === cardId);
  if (cardIndex === -1) {
    return null;
  }

  const updatedCard = { ...db.userCards[userId][cardIndex], ...updates };
  db.userCards[userId][cardIndex] = updatedCard;
  await writeDb(db);
  return updatedCard;
}

export async function deleteUserCard(userId: string, cardId: string): Promise<boolean> {
  const db = await readDb();
  if (!db.userCards[userId]) {
    return false;
  }

  const initialLength = db.userCards[userId].length;
  db.userCards[userId] = db.userCards[userId].filter(card => card.id !== cardId);
  
  if (db.userCards[userId].length < initialLength) {
    await writeDb(db);
    return true;
  }
  return false;
}

// Example: Function to store card analysis data for a specific card
export async function storeCardAnalysisForUserCard(
  userId: string, 
  cardId: string, 
  analysisData: ComprehensiveCardAnalysisResponse
): Promise<UserCard | null> {
  return updateUserCard(userId, cardId, { cardAnalysisData: analysisData });
} 