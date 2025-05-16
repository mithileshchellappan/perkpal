"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Check, Info, ArrowRight, ExternalLink } from "lucide-react"

// Sample recommendation data
const cardRecommendationData = {
  success: true,
  data: {
    evaluation_of_current_cards:
      "Your current cards, Atlas by Axis and Millennia by HDFC, offer decent travel and cashback rewards, but both have a forex markup (typically 2% or more), which is not optimal for frequent international spending. There is a gap in your portfolio for a card with zero or low forex markup, which would be more cost-effective for your primary spending category (Forex).",
    suggested_cards: [
      {
        card_name: "HDFC Bank Multicurrency Platinum ForexPlus Card",
        issuing_bank: "HDFC Bank",
        justification:
          "This card offers zero markup on all forex transactions, making it ideal for your international travel and spending needs. It complements your existing HDFC card and fills the forex optimization gap.",
        key_benefits: [
          "Zero markup on forex transactions",
          "Supports multiple currencies",
          "Reward points on international spending",
          "Travel insurance and ATM fee waivers",
        ],
        primary_card_category: "Forex Optimized",
      },
      {
        card_name: "SBI Elite Global Card",
        issuing_bank: "State Bank of India",
        justification:
          "Designed for frequent travelers, this card provides zero forex markup and premium travel benefits, making it a strong choice for your forex-focused spending.",
        key_benefits: [
          "Zero forex markup",
          "International lounge access",
          "Rewards on forex spending",
          "Comprehensive travel insurance",
        ],
        primary_card_category: "Premium Travel Rewards",
      },
      {
        card_name: "BookMyForex True Zero Markup Forex Card",
        issuing_bank: "BookMyForex",
        justification:
          "This multi-currency card offers genuine zero markup on live interbank rates, with no issuance or reload fees, and is highly transparent for international transactions.",
        key_benefits: [
          "Zero markup on live interbank rates",
          "Supports up to 14 currencies",
          "Zero issuance/annual/reload fees",
          "Instant reload via app",
        ],
        primary_card_category: "Forex Optimized",
      },
    ],
    important_considerations: [
      "Compare annual fees and benefits to ensure the card aligns with your travel frequency and spending habits.",
      "Check for any hidden charges or terms related to ATM withdrawals and currency conversion.",
      "Review the card's acceptance and customer support in your intended travel destinations.",
    ],
  },
}

// User parameters
const userParameters = {
  current_cards: [
    { cardName: "Atlas", issuingBank: "Axis" },
    { cardName: "Millenia", issuingBank: "HDFC" },
  ],
  desired_card_type: "Travel",
  country: "India",
  primary_spending_categories: ["Forex"],
  additional_preferences: "Looking for a card with better forex charges",
}

// Types for the data
interface CardInfo {
  cardName: string
  issuingBank: string
}

interface UserParameters {
  current_cards: CardInfo[]
  desired_card_type: string
  country: string
  primary_spending_categories: string[]
  additional_preferences: string
}

interface SuggestedCard {
  card_name: string
  issuing_bank: string
  justification: string
  key_benefits: string[]
  primary_card_category: string
}

interface CardRecommendationData {
  success: boolean
  data: {
    evaluation_of_current_cards: string
    suggested_cards: SuggestedCard[]
    important_considerations: string[]
  }
}

export function CardRecommendationView() {
  const [selectedCard, setSelectedCard] = useState<SuggestedCard | null>(null)

  // Function to get a color based on card category
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      "Forex Optimized": "#0f4c81",
      "Premium Travel Rewards": "#6a0dad",
      Cashback: "#2e7d32",
      "Airline Miles": "#c99c00",
      "Hotel Rewards": "#ff6b00",
    }

    return categoryColors[category] || "#ff6b00"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Looking for a New Card</h2>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Your Card Search Parameters</CardTitle>
          <CardDescription>Based on your preferences and spending habits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Cards</h3>
              <div className="flex flex-wrap gap-2">
                {userParameters.current_cards.map((card) => (
                  <Badge key={`${card.issuingBank}-${card.cardName}`} variant="outline" className="bg-background">
                    {card.issuingBank} {card.cardName}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Desired Card Type</h3>
              <Badge variant="outline" className="bg-primary/10">
                {userParameters.desired_card_type}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Country</h3>
              <span>{userParameters.country}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Primary Spending Categories</h3>
              <div className="flex flex-wrap gap-2">
                {userParameters.primary_spending_categories.map((category) => (
                  <Badge key={category} variant="outline" className="bg-background">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <h3 className="text-sm font-medium">Additional Preferences</h3>
              <p className="text-sm text-muted-foreground">{userParameters.additional_preferences}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Evaluation of Current Cards</CardTitle>
          <CardDescription>Analysis of your existing credit cards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-start bg-muted/30 p-4 rounded-md">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm">{cardRecommendationData.data.evaluation_of_current_cards}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cards">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="cards">Recommended Cards</TabsTrigger>
            <TabsTrigger value="details">Card Details</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="cards" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cardRecommendationData.data.suggested_cards.map((card) => (
              <Card
                key={card.card_name}
                className={`overflow-hidden cursor-pointer transition-all ${selectedCard?.card_name === card.card_name ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedCard(card)}
              >
                <div
                  className="h-2 bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${getCategoryColor(card.primary_card_category)}, ${getCategoryColor(card.primary_card_category)}90)`,
                  }}
                />
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{card.card_name}</CardTitle>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        backgroundColor: `${getCategoryColor(card.primary_card_category)}20`,
                        color: getCategoryColor(card.primary_card_category),
                      }}
                    >
                      {card.primary_card_category}
                    </Badge>
                  </div>
                  <CardDescription>{card.issuing_bank}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-4">{card.justification}</p>
                  <div className="space-y-1">
                    {card.key_benefits.slice(0, 2).map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                    {card.key_benefits.length > 2 && (
                      <p className="text-xs text-muted-foreground pl-6">
                        +{card.key_benefits.length - 2} more benefits
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedCard(card)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Important Considerations</CardTitle>
              <CardDescription>Keep these factors in mind when choosing a new card</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cardRecommendationData.data.important_considerations.map((consideration, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-1" />
                    <span className="text-sm">{consideration}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-0">
          {selectedCard ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="h-full">
                  <div
                    className="h-2 bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${getCategoryColor(selectedCard.primary_card_category)}, ${getCategoryColor(selectedCard.primary_card_category)}90)`,
                    }}
                  />
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{selectedCard.card_name}</CardTitle>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          backgroundColor: `${getCategoryColor(selectedCard.primary_card_category)}20`,
                          color: getCategoryColor(selectedCard.primary_card_category),
                        }}
                      >
                        {selectedCard.primary_card_category}
                      </Badge>
                    </div>
                    <CardDescription>{selectedCard.issuing_bank}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-center">
                        <div
                          className="w-48 h-32 rounded-xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${getCategoryColor(selectedCard.primary_card_category)}, ${getCategoryColor(selectedCard.primary_card_category)}90)`,
                          }}
                        >
                          <CreditCard className="h-12 w-12 text-white" />
                        </div>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2">Issuing Bank</h3>
                        <p className="text-sm">{selectedCard.issuing_bank}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Card Category</h3>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            backgroundColor: `${getCategoryColor(selectedCard.primary_card_category)}20`,
                            color: getCategoryColor(selectedCard.primary_card_category),
                          }}
                        >
                          {selectedCard.primary_card_category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" size="sm">
                      Apply Now <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Card Details</CardTitle>
                    <CardDescription>Complete information about {selectedCard.card_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-base font-medium mb-2">Why This Card?</h3>
                          <p className="text-sm">{selectedCard.justification}</p>
                        </div>

                        <div>
                          <h3 className="text-base font-medium mb-2">Key Benefits</h3>
                          <div className="space-y-2">
                            {selectedCard.key_benefits.map((benefit, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <span className="text-sm">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-medium mb-2">How It Complements Your Current Cards</h3>
                          <div className="bg-muted/30 p-4 rounded-md">
                            <p className="text-sm">
                              The {selectedCard.card_name} fills the gap in your current portfolio by providing
                              {selectedCard.primary_card_category === "Forex Optimized"
                                ? " zero or low forex markup fees, which your current cards (Atlas and Millennia) don't offer optimally."
                                : " premium travel benefits that complement your existing cards."}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-medium mb-2">Important Considerations</h3>
                          <ul className="space-y-2">
                            {cardRecommendationData.data.important_considerations.map((consideration, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 text-primary mt-1" />
                                <span className="text-sm">{consideration}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-6 text-center">
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-2">Select a Card to View Details</h3>
              <p className="text-muted-foreground">Click on any recommended card to view its detailed information.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
