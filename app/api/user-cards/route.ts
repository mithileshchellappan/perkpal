import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // Import auth from Clerk
import {
  getUserCards,
  addUserCard,
  getCachedCardAnalysis,
  setCachedCardAnalysis,
  // getCardById, // We might need this later for specific card operations
  // updateUserCard, 
  // deleteUserCard 
} from '@/lib/db'; // Updated to use db.ts directly
import { getCardAnalysis } from '@/lib/services/perplexityService';

/**
 * GET user cards
 */
export async function GET(request: Request) {
  const { userId } = await auth(); // Get userId from Clerk

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cards = await getUserCards(userId);
    return NextResponse.json({ success: true, data: cards });
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user cards' }, 
      { status: 500 }
    );
  }
}

/**
 * POST - Add a new card for a user
 */
export async function POST(request: Request) {
  const { userId } = await auth(); // Get userId from Clerk
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("body", body)
    const {
      bin,
      cardName,
      bank,
      network,
      pointsBalance,
      country,
    } = body;

    // Basic validation
    if (!bin || !cardName || !bank || !network || !country) {
      console.log("Missing required card fields: bin, cardName, bank, network, country")
      return NextResponse.json(
        { error: 'Missing required card fields: bin, cardName, bank, network, country' }, 
        { status: 400 }
      );
    }
    let analysis = await getCachedCardAnalysis(cardName, bank, country);
    if(!analysis) {
      analysis = await getCardAnalysis(cardName, bank, country);
      if(analysis) {
        await setCachedCardAnalysis(cardName, bank, country, analysis);
      }
    }

    const newCardData = {
      bin,
      cardName,
      bank,
      network,
      country,
      pointsBalance: pointsBalance ? Number(pointsBalance) : undefined,
    };

    const addedCard = await addUserCard(userId, newCardData);
    return NextResponse.json({ success: true, data: {...addedCard, cardAnalysisData: analysis } }, { status: 201 });

  } catch (error) {
    console.error('Error adding user card:', error);
    return NextResponse.json(
      { error: 'Failed to add user card' }, 
      { status: 500 }
    );
  }
}