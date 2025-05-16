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

// Mock API responses for different cards
const mockPromotions: Record<string, PromotionResponse> = {
  "Sapphire Preferred": {
    success: true,
    data: {
      card_context: "Chase Sapphire Preferred",
      promotions: [
        {
          promotion_title: "Earn 60,000 Bonus Points",
          description:
            "Earn 60,000 bonus points after you spend $4,000 on purchases in the first 3 months from account opening. That's $750 when you redeem through Chase Ultimate Rewards®.",
          partner_involved: null,
          offer_type: "Sign Up Bonus",
          valid_until: "2025-12-31",
          source_url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
        },
        {
          promotion_title: "5X Points on Lyft Rides",
          description: "Earn 5X total points on Lyft rides through March 2025.",
          partner_involved: "Lyft",
          offer_type: "Category Bonus",
          valid_until: "2025-03-31",
          source_url: "https://www.chase.com/personal/credit-cards/sapphire/preferred/travel-benefits",
        },
        {
          promotion_title: "10% Anniversary Point Bonus",
          description:
            "Each account anniversary, earn bonus points equal to 10% of your total purchases made the previous year.",
          partner_involved: null,
          offer_type: "Anniversary Bonus",
          valid_until: null,
          source_url: null,
        },
      ],
    },
  },
  "Gold Card": {
    success: true,
    data: {
      card_context: "AMEX Gold",
      promotions: [
        {
          promotion_title: "Earn 60,000 Membership Rewards® Points",
          description:
            "Earn 60,000 Membership Rewards® points after you spend $4,000 on eligible purchases within the first 6 months of card membership.",
          partner_involved: null,
          offer_type: "Sign Up Bonus",
          valid_until: "2025-06-30",
          source_url: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
        },
        {
          promotion_title: "$120 Dining Credit",
          description:
            "Earn up to $10 in statement credits monthly when you pay with the Gold Card at participating dining partners.",
          partner_involved:
            "Grubhub, The Cheesecake Factory, Goldbelly, Wine.com, Milk Bar and select Shake Shack locations",
          offer_type: "Statement Credit",
          valid_until: null,
          source_url: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
        },
      ],
    },
  },
  "Venture X": {
    success: true,
    data: {
      card_context: "Capital One Venture X",
      promotions: [
        {
          promotion_title: "Earn 75,000 Bonus Miles",
          description:
            "Earn 75,000 bonus miles when you spend $4,000 on purchases in the first 3 months from account opening, equal to $750 in travel.",
          partner_involved: null,
          offer_type: "Sign Up Bonus",
          valid_until: "2025-08-15",
          source_url: "https://www.capitalone.com/credit-cards/venture-x/",
        },
        {
          promotion_title: "$300 Annual Travel Credit",
          description: "Receive up to $300 back as statement credits for bookings through Capital One Travel.",
          partner_involved: "Capital One Travel",
          offer_type: "Travel Credit",
          valid_until: null,
          source_url: null,
        },
        {
          promotion_title: "10,000 Bonus Miles Every Anniversary",
          description: "Receive 10,000 bonus miles every account anniversary, equal to $100 in travel.",
          partner_involved: null,
          offer_type: "Anniversary Bonus",
          valid_until: null,
          source_url: null,
        },
      ],
    },
  },
  // Empty promotions example
  "Freedom Unlimited": {
    success: true,
    data: {
      card_context: "Chase Freedom Unlimited",
      promotions: [],
    },
  },
}

interface PromotionsViewProps {
  cards: CreditCardType[]
}

export function PromotionsView({ cards }: PromotionsViewProps) {
  const [selectedCard, setSelectedCard] = useState<CreditCardType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [promotions, setPromotions] = useState<Promotion[]>([])

  const handleSelectCard = async (card: CreditCardType) => {
    setSelectedCard(card)
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get mock promotions for the selected card
    const response = mockPromotions[card.name] || {
      success: true,
      data: {
        card_context: card.name,
        promotions: [],
      },
    }

    setPromotions(response.data.promotions)
    setIsLoading(false)
  }

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
    </div>
  )
}
