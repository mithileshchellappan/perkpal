"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCardCarousel } from "@/components/credit-card-carousel"
import type { CreditCardType } from "@/lib/types"
import { CalendarIcon, ExternalLink, Gift, Info, Tag } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

// Types for promotions
interface Promotion {
  promotion_title: string
  description: string
  partner_involved: string | null
  offer_type: string
  valid_until: string | null
  source_url: string | null
}

interface PromotionResponse {
  success: boolean
  data: {
    card_context: string
    promotions: Promotion[]
  }
}

// const mockPromotions: Record<string, PromotionResponse> = { ... }; // This line is fully removed

interface PromotionsViewProps {
  cards: CreditCardType[]
}

export function PromotionsView({ cards }: PromotionsViewProps) {
  const [selectedCard, setSelectedCard] = useState<CreditCardType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSelectCard = async (card: CreditCardType) => {
    setSelectedCard(card)
    setIsLoading(true)
    setPromotions([])
    setError(null)

    try {
      const requestBody = {
        card: card.name,
        bankName: card.issuer,
        country: card.country,
      };

      const response = await fetch("/api/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const result: PromotionResponse = await response.json();
      console.log(result)
      if (result.success && result.data) {
        setPromotions(result.data.promotions);
      } else {
        // Handle cases where success is false or data is missing, though API should ideally align with this
        setPromotions([]);
        console.warn("API response indicated failure or missing data:", result);
        setError("Could not fetch promotions for this card.");
      }
    } catch (err: any) {
      console.error("Failed to fetch promotions:", err);
      setPromotions([]);
      setError(err.message || "An unexpected error occurred while fetching promotions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Card Promotions</h2>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Your Cards</CardTitle>
          <CardDescription>Select a card to view available promotions</CardDescription>
        </CardHeader>
        <CardContent>
          <CreditCardCarousel
            cards={cards}
            onSelectCard={handleSelectCard}
            showAddButton={false}
            title="Your Cards"
            selectedCardId={selectedCard?.id}
          />
        </CardContent>
      </Card>

      {selectedCard ? (
        <Card>
          <CardHeader>
            <CardTitle>Promotions for {selectedCard.name}</CardTitle>
            <CardDescription>Current offers and promotions available for your {selectedCard.name} card</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : promotions.length > 0 ? (
              <div className="space-y-4">
                {promotions.map((promotion, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${selectedCard.color || "#ff6b00"}, ${
                          selectedCard.secondaryColor || "#cc5500"
                        })`,
                      }}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{promotion.promotion_title}</CardTitle>
                        <Badge variant="outline">{promotion.offer_type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{promotion.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        {promotion.partner_involved && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span>Partner: {promotion.partner_involved}</span>
                          </div>
                        )}

                        {promotion.valid_until && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Valid until: {format(new Date(promotion.valid_until), "MMMM d, yyyy")}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    {promotion.source_url && (
                      <CardFooter className="pt-0 flex justify-end">
                        <Button variant="outline" size="sm" className="gap-1" asChild>
                          <a href={promotion.source_url} target="_blank" rel="noopener noreferrer">
                            View Details <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Gift className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Current Promotions</h3>
                <p className="text-muted-foreground max-w-md">
                  There are no active promotions for your {selectedCard.name} at this time. Check back later for new
                  offers and deals.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">Select a Card to View Promotions</h3>
          <p className="text-muted-foreground">
            Choose a card from above to see available promotions and special offers.
          </p>
        </Card>
      )}
      {error && (
        <Card className="mt-4 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={() => selectedCard && handleSelectCard(selectedCard)} className="mt-2">
                Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
