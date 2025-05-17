import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
// import { getUserCards } from "@/lib/db"; // No longer directly used
import type { CreditCardType } from "@/lib/types";
import { generateColorFromString, adjustColor } from "@/lib/utils";
import type { UserCard as DbUserCard, ComprehensiveCardAnalysisResponse } from "@/lib/db";

// The return type of getUserCards is (DbUserCard & { approxPointsValue?: number; currency?: string })[]
type FetchedUserCard = DbUserCard & { approxPointsValue?: number; currency?: string; last4Digits?: string };

// General ApiResponse for POST, PUT, DELETE etc. where data might be a single object
interface ApiMutationResponse {
  success: boolean;
  data?: FetchedUserCard; // Single card for POST response
  error?: string;
}

// Specific ApiResponse for GET all cards
interface ApiQueryResponse {
    success: boolean;
    data?: FetchedUserCard[]; // Array of cards for GET response
    error?: string;
}

export function useUserCards() {
  const { isSignedIn } = useAuth(); // userId is handled by the backend API route via Clerk auth
  const [cards, setCards] = useState<CreditCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [addCardError, setAddCardError] = useState<Error | null>(null);

  const fetchCards = useCallback(async () => {
    if (!isSignedIn) { // Only proceed if signed in; userId check is on backend
      setCards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user-cards');
      // Use ApiQueryResponse for GET all cards
      const result: ApiQueryResponse = await response.json();

      if (!response.ok || !result.success || !result.data) { // result.data should be an array here
        throw new Error(result.error || 'Failed to fetch cards from API');
      }

      const dbCards = result.data; // Now dbCards is FetchedUserCard[]
      
      const transformedCards: CreditCardType[] = dbCards.map((dbCard: FetchedUserCard) => {
        const analysis: ComprehensiveCardAnalysisResponse | null | undefined = dbCard.cardAnalysisData;

        let annualFee: number | undefined = undefined;
        if (analysis) {
          if (typeof analysis.fees === 'number') {
            annualFee = analysis.fees;
          } else if (typeof (analysis.fees as any)?.annual === 'number') {
            annualFee = (analysis.fees as any).annual;
          }
        }

        let rewardsRate: number | undefined = undefined;
        if (analysis && analysis.earning_rewards) {
          const earningRewards = analysis.earning_rewards;
          if (typeof (earningRewards as any)?.multiplier_value_int === 'number') {
            rewardsRate = (earningRewards as any).multiplier_value_int;
          } else if (Array.isArray(earningRewards) && earningRewards.length > 0) {
            const firstReward = earningRewards[0];
            if (firstReward && typeof firstReward.multiplier_value_int === 'number') {
              rewardsRate = firstReward.multiplier_value_int;
            } else if (firstReward && typeof (firstReward as any).rate === 'number') {
              rewardsRate = (firstReward as any).rate;
            }
          } else if (typeof (earningRewards as any)?.rate === 'number') {
             rewardsRate = (earningRewards as any).rate;
          }
        }
        
        const baseColor = generateColorFromString(dbCard.cardName || "");

        return {
          id: dbCard.id,
          name: dbCard.cardName,
          issuer: dbCard.bank,
          pointsBalance: dbCard.pointsBalance || 0,
          number: dbCard.last4Digits ? `XXXX-XXXX-XXXX-${dbCard.last4Digits}` : dbCard.bin, // Fallback to bin if last4Digits not present
          baseValue: dbCard.approxPointsValue || 0,
          annualFee: analysis?.annual_fee || 0,
          rewardsRate: rewardsRate,
          status: "Active", // Default status
          color: baseColor,
          secondaryColor: adjustColor(baseColor, 10), // Use adjustColor for consistency
          network: dbCard.network,
          country: dbCard.country,
          currency: dbCard.currency,
          cardAnalysisData: analysis,
        };
      });
      setCards(transformedCards);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch cards"));
      console.error("Error fetching user cards via API:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const addCard = async (cardData: CreditCardType): Promise<CreditCardType | null> => {
    if (!isSignedIn) {
      setAddCardError(new Error("User is not signed in. Cannot add card."));
      return null;
    }
    setIsAddingCard(true);
    setAddCardError(null);
    try {
      const apiCardData = {
        bin: cardData.number?.replace(/XXXX-XXXX-XXXX-/, "").replace(/-/g, ""), // Ensure bin is just numbers if masked
        cardName: cardData.name,
        bank: cardData.issuer,
        network: cardData.network,
        country: cardData.country,
        pointsBalance: cardData.pointsBalance,
      };

      const response = await fetch('/api/user-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiCardData),
      });

      // Use ApiMutationResponse for POST
      const result: ApiMutationResponse = await response.json();

      if (!response.ok || !result.success || !result.data ) { // result.data should be a single card object here
        throw new Error(result.error || 'Failed to add card via API');
      }
      
      const addedDbCard = result.data; // Now addedDbCard is FetchedUserCard

      await fetchCards(); 
      setIsAddingCard(false);
      
      const newCardBaseColor = generateColorFromString(addedDbCard.cardName || "");
      return {
        id: addedDbCard.id,
        name: addedDbCard.cardName,
        issuer: addedDbCard.bank,
        pointsBalance: addedDbCard.pointsBalance || 0,
        number: addedDbCard.last4Digits ? `XXXX-XXXX-XXXX-${addedDbCard.last4Digits}` : addedDbCard.bin,
        baseValue: addedDbCard.approxPointsValue || 0,
        status: "Active",
        color: newCardBaseColor,
        secondaryColor: adjustColor(newCardBaseColor, 10), // Also use adjustColor here
        network: addedDbCard.network,
        country: addedDbCard.country,
        currency: addedDbCard.currency,
      } as CreditCardType;

    } catch (err) {
      const newError = err instanceof Error ? err : new Error("Failed to add card");
      setAddCardError(newError);
      console.error("Error adding user card via hook:", err);
      setIsAddingCard(false);
      return null;
    }
  };

  return { cards, isLoading, error, refetch: fetchCards, addCard, isAddingCard, addCardError };
}
