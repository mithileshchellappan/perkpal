"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Info, ArrowRight, ThumbsUp, ThumbsDown, CreditCardIcon, Plus } from "lucide-react"
import type { CreditCardType } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CardNetworkLogo } from "@/components/card-network-logo"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard } from "@/components/credit-card-carousel"

// Sample bank and card data
const bankCardData = [
  {
    bankName: "Axis Bank",
    cards: [
      {
        name: "Axis Bank Atlas Credit Card",
        network: "visa",
        color: "#0f4c81",
        secondaryColor: "#1a6baf",
      },
      {
        name: "Axis Bank Ace Credit Card",
        network: "visa",
        color: "#6a0dad",
        secondaryColor: "#9932cc",
      },
      {
        name: "Axis Bank Flipkart Credit Card",
        network: "visa",
        color: "#2874f0",
        secondaryColor: "#5a98f2",
      },
    ],
  },
  {
    bankName: "HDFC Bank",
    cards: [
      {
        name: "HDFC Bank Infinia Credit Card (Metal Edition)",
        network: "mastercard",
        color: "#000000",
        secondaryColor: "#333333",
      },
      {
        name: "HDFC Bank Millennia Credit Card",
        network: "mastercard",
        color: "#2e7d32",
        secondaryColor: "#43a047",
      },
      {
        name: "HDFC Bank Regalia Credit Card",
        network: "visa",
        color: "#1a237e",
        secondaryColor: "#303f9f",
      },
    ],
  },
  {
    bankName: "ICICI Bank",
    cards: [
      {
        name: "ICICI Bank Amazon Pay Credit Card",
        network: "visa",
        color: "#ff9900",
        secondaryColor: "#ffbb33",
      },
      {
        name: "ICICI Bank Emeralde Credit Card",
        network: "mastercard",
        color: "#006400",
        secondaryColor: "#228b22",
      },
      {
        name: "ICICI Bank Coral Credit Card",
        network: "mastercard",
        color: "#ff7f50",
        secondaryColor: "#ff9e7d",
      },
    ],
  },
  {
    bankName: "American Express",
    cards: [
      {
        name: "American Express Platinum Card",
        network: "amex",
        color: "#c0c0c0",
        secondaryColor: "#e0e0e0",
      },
      {
        name: "American Express Gold Card",
        network: "amex",
        color: "#d4af37",
        secondaryColor: "#f1c232",
      },
      {
        name: "American Express Green Card",
        network: "amex",
        color: "#2e8b57",
        secondaryColor: "#3cb371",
      },
    ],
  },
]

// Sample comparison data based on the provided JSON
const comparisonData = {
  comparison_country: "India",
  compared_cards: [
    {
      card_name: "Axis Bank Atlas Credit Card",
      issuing_bank: "Axis Bank",
      reward_on_spending:
        "Earn air miles (Edge Miles) on all spends, with higher rewards on travel and foreign currency transactions.",
      pros: [
        "Strong travel rewards and air miles accrual",
        "Complimentary international and domestic lounge access",
        "Higher reward rates on foreign currency spends",
        "Airport concierge services",
      ],
      cons: ["High annual fee", "Best value is for frequent travelers; less attractive for non-travelers"],
      fees: {
        joining_amount: "₹5,000 + GST",
        renewal_amount: "₹5,000 + GST",
        forex_percentage: "2%",
        apr_description: null,
        addon_card_amount: null,
        reward_redemption_description:
          "Edge Miles can be redeemed for flights/hotels; redemption rates and partners may vary.",
      },
      transfer_partners: [
        {
          partner_name: "Multiple international airlines and hotels (via Edge Miles)",
          partner_type: "Airline",
          transfer_ratio: "Varies (typically 1:1 or 2:1 depending on partner)",
          notes: "Partners include Air Asia, Air France, Etihad, Singapore Airlines, Marriott, IHG, and more.",
        },
      ],
      welcome_offer_summary: "Welcome Edge Miles on first spend (exact amount varies by offer period).",
      key_reward_highlights: [
        "Earn Edge Miles on all spends",
        "Accelerated Edge Miles on travel and foreign currency transactions",
        "Milestone benefits for high annual spends",
      ],
      annual_fee_display: "₹5,000 + GST",
      lounge_access: {
        international_count: "12 complimentary international lounge visits per year",
        domestic_count: "12 complimentary domestic lounge visits per year",
      },
      overall_evaluation:
        "Excellent for frequent international travelers seeking air miles and lounge access; high annual fee justified by travel benefits.",
    },
    {
      card_name: "HDFC Bank Infinia Credit Card (Metal Edition)",
      issuing_bank: "HDFC Bank",
      reward_on_spending: "5 reward points per ₹150 spent (base rate), up to 10X points on HDFC SmartBuy platform.",
      pros: [
        "Unlimited complimentary airport lounge access (domestic and international)",
        "High reward rate, especially via SmartBuy",
        "Premium lifestyle and travel benefits",
        "By-invite exclusivity",
      ],
      cons: [
        "Very high annual fee",
        "Eligibility is restrictive (by invite only)",
        "Maximum value requires use of SmartBuy platform",
      ],
      fees: {
        joining_amount: "₹12,500 + GST",
        renewal_amount: "₹12,500 + GST",
        forex_percentage: "2%",
        apr_description: null,
        addon_card_amount: null,
        reward_redemption_description:
          "Reward points can be redeemed for flights/hotels at 1 RP = ₹1; other redemption options may have lower value.",
      },
      transfer_partners: [
        {
          partner_name: "Multiple international airlines and hotels (via reward points)",
          partner_type: "Airline",
          transfer_ratio: "Typically 1:1 or 2:1 depending on partner",
          notes: "Partners include Singapore Airlines, British Airways, Club Vistara, Marriott, IHG, and more.",
        },
      ],
      welcome_offer_summary: "No standard public welcome offer; benefits are ongoing and premium-focused.",
      key_reward_highlights: [
        "5X points on all spends (base rate)",
        "Up to 10X points on HDFC SmartBuy purchases",
        "Unlimited lounge access worldwide",
        "Complimentary golf rounds",
      ],
      annual_fee_display: "₹12,500 + GST",
      lounge_access: {
        international_count: "Unlimited international lounge access (Priority Pass)",
        domestic_count: "Unlimited domestic lounge access",
      },
      overall_evaluation:
        "Best-in-class for high spenders and premium users who maximize SmartBuy and travel benefits; high fee and exclusivity limit accessibility.",
    },
    {
      card_name: "HDFC Bank Millennia Credit Card",
      issuing_bank: "HDFC Bank",
      reward_on_spending: "5% cashback on select online spends (Amazon, Flipkart, etc.), 1% cashback on other spends.",
      pros: ["Good cashback rates on popular online merchants", "Affordable annual fee", "Welcome bonus for new users"],
      cons: ["Cashback capped per cycle", "Lower rewards on offline and non-partner spends", "Limited travel benefits"],
      fees: {
        joining_amount: "₹1,000 + GST",
        renewal_amount: "₹1,000 + GST",
        forex_percentage: "3.5%",
        apr_description: null,
        addon_card_amount: null,
        reward_redemption_description: "Cashback credited as CashPoints; minimum redemption threshold applies.",
      },
      transfer_partners: [],
      welcome_offer_summary: "1,000 CashPoints as welcome benefit on first spend.",
      key_reward_highlights: [
        "5% cashback on Amazon, Flipkart, BookMyShow, Myntra, Uber, Swiggy, Zomato",
        "1% cashback on all other spends",
        "1,000 CashPoints as welcome bonus",
      ],
      annual_fee_display: "₹1,000 + GST",
      lounge_access: {
        international_count: null,
        domestic_count: "8 complimentary domestic lounge visits per year",
      },
      overall_evaluation: "Strong value for online shoppers seeking cashback; limited travel and premium benefits.",
    },
  ],
  comparison_summary:
    "The Axis Bank Atlas is a premium travel card with strong air miles rewards, extensive lounge access, and travel-focused perks, best suited for frequent flyers. HDFC Infinia is a super-premium, by-invite card offering unlimited lounge access, high reward rates (especially via SmartBuy), and premium lifestyle benefits, but comes with a very high annual fee and strict eligibility. HDFC Millennia is a mass-market cashback card with good rewards for online shopping, a low annual fee, and limited travel benefits, making it ideal for everyday spenders rather than travelers.",
  recommendation_notes: [
    "For frequent international travelers and those valuing air miles, the Axis Bank Atlas is a top choice due to its lounge access and travel rewards.",
    "For high spenders who can access the card, HDFC Infinia offers unmatched premium benefits and unlimited lounge access, especially if you use the SmartBuy platform.",
    "For online shoppers and those seeking a low-fee card, HDFC Millennia provides strong cashback on popular e-commerce platforms and is more accessible.",
    "If you rarely travel or want simple cashback, Millennia is best; if you want luxury and travel perks, Infinia or Atlas are superior, with Infinia being the most exclusive.",
  ],
}

// Helper function to get comparison data for a card
const getComparisonDataForCard = (cardName: string) => {
  return (
    comparisonData.compared_cards.find((card) => card.card_name === cardName) || comparisonData.compared_cards[0] // Fallback to first card if not found
  )
}

interface CardComparisonViewProps {
  cards: CreditCardType[]
}

export function CardComparisonView({ cards }: CardComparisonViewProps) {
  const [selectedCards, setSelectedCards] = useState<Array<{ id: string; cardDetails: any }>>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [availableCards, setAvailableCards] = useState<any[]>([])
  const [isAddingCard, setIsAddingCard] = useState(true)

  // Update available cards when bank is selected
  useEffect(() => {
    if (selectedBank) {
      const bank = bankCardData.find((b) => b.bankName === selectedBank)
      setAvailableCards(bank ? bank.cards : [])
      setSelectedCard(null)
    } else {
      setAvailableCards([])
    }
  }, [selectedBank])

  const handleAddCard = () => {
    if (selectedCard && selectedBank) {
      const cardInfo = availableCards.find((c) => c.name === selectedCard)
      if (cardInfo) {
        const newCard = {
          id: crypto.randomUUID(),
          cardDetails: {
            name: cardInfo.name,
            issuer: selectedBank,
            network: cardInfo.network,
            color: cardInfo.color,
            secondaryColor: cardInfo.secondaryColor,
          },
        }
        setSelectedCards([...selectedCards, newCard])
        setSelectedBank(null)
        setSelectedCard(null)
        setIsAddingCard(selectedCards.length < 2) // Only allow adding another card if less than 3 cards
      }
    }
  }

  const removeCard = (id: string) => {
    setSelectedCards(selectedCards.filter((card) => card.id !== id))
    setIsAddingCard(true)
  }

  const clearSelection = () => {
    setSelectedCards([])
    setIsAddingCard(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Card Comparison</h2>
        {selectedCards.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearSelection}>
            Clear Selection
          </Button>
        )}
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select Cards to Compare</CardTitle>
          <CardDescription>Choose up to 3 cards to compare features and benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {selectedCards.map((card) => (
              <div key={card.id} className="w-[calc(33.33%-1rem)] min-w-[250px]">
                <CreditCard
                  card={{
                    id: card.id,
                    name: card.cardDetails.name,
                    issuer: card.cardDetails.issuer,
                    network: card.cardDetails.network,
                    color: card.cardDetails.color,
                    secondaryColor: card.cardDetails.secondaryColor,
                    pointsBalance: 0,
                    baseValue: 0,
                    annualFee: 0,
                    expiryDate: "",
                    rewardsRate: 0,
                    status: "Active",
                  }}
                  isActive={true}
                  hideDetails={true}
                />
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => removeCard(card.id)}>
                  <X className="h-4 w-4 mr-2" /> Remove
                </Button>
              </div>
            ))}

            {isAddingCard && (
              <div className="w-[calc(33.33%-1rem)] min-w-[250px]">
                <Card className="h-56 border-dashed flex flex-col items-center justify-center">
                  <div className="space-y-4 p-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Bank</label>
                      <Select value={selectedBank || ""} onValueChange={setSelectedBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankCardData.map((bank) => (
                            <SelectItem key={bank.bankName} value={bank.bankName}>
                              {bank.bankName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Card</label>
                      <Select value={selectedCard || ""} onValueChange={setSelectedCard} disabled={!selectedBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a card" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCards.map((card) => (
                            <SelectItem key={card.name} value={card.name}>
                              {card.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full" disabled={!selectedCard} onClick={handleAddCard}>
                      <Plus className="h-4 w-4 mr-2" /> Add Card
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {!isAddingCard && selectedCards.length < 3 && (
              <div className="w-[calc(33.33%-1rem)] min-w-[250px]">
                <Card
                  className="h-56 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setIsAddingCard(true)}
                >
                  <Plus className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Add Another Card</p>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedCards.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Card Comparison</CardTitle>
            <CardDescription>
              Comparing {selectedCards.length} card{selectedCards.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {selectedCards.map((card) => (
                      <Card key={card.id} className="overflow-hidden">
                        <div
                          className="h-24 bg-gradient-to-r"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${card.cardDetails.color || "#ff6b00"}, ${
                              card.cardDetails.secondaryColor || "#cc5500"
                            })`,
                          }}
                        >
                          <div className="p-4 flex justify-between">
                            <div className="h-8 w-12">
                              {card.cardDetails.network && <CardNetworkLogo network={card.cardDetails.network} />}
                            </div>
                            <CreditCardIcon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-1">{card.cardDetails.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{card.cardDetails.issuer}</p>

                          <div className="space-y-3">
                            {/* We don't have real data for these cards, so we'll use the comparison data */}
                            {(() => {
                              const comparisonCard = getComparisonDataForCard(card.cardDetails.name)
                              return (
                                <>
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">Annual Fee</h4>
                                    <p className="font-bold">{comparisonCard.annual_fee_display}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">Reward Type</h4>
                                    <p className="font-bold">
                                      {comparisonCard.reward_on_spending.includes("cashback")
                                        ? "Cashback"
                                        : comparisonCard.reward_on_spending.includes("miles")
                                          ? "Miles"
                                          : "Points"}
                                    </p>
                                  </div>
                                </>
                              )
                            })()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Comparison Summary</h3>
                      <Card className="p-4 bg-muted/50">
                        <p className="text-sm">{comparisonData.comparison_summary}</p>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                      <div className="space-y-2">
                        {comparisonData.recommendation_notes.map((note, index) => (
                          <div key={index} className="flex gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="rewards">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedCards.map((card) => {
                      const comparisonCard = getComparisonDataForCard(card.cardDetails.name)
                      return (
                        <Card key={card.id} className="overflow-hidden">
                          <div
                            className="h-12 bg-gradient-to-r flex items-center px-4"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${card.cardDetails.color || "#ff6b00"}, ${
                                card.cardDetails.secondaryColor || "#cc5500"
                              })`,
                            }}
                          >
                            <h3 className="font-bold text-white">{card.cardDetails.name}</h3>
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Reward on Spending</h4>
                                <p className="text-sm">{comparisonCard.reward_on_spending}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-1">Key Reward Highlights</h4>
                                <ul className="space-y-1">
                                  {comparisonCard.key_reward_highlights.map((highlight, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                      <span>{highlight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-1">Welcome Offer</h4>
                                <p className="text-sm">{comparisonCard.welcome_offer_summary}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="fees">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedCards.map((card) => {
                      const comparisonCard = getComparisonDataForCard(card.cardDetails.name)
                      return (
                        <Card key={card.id} className="overflow-hidden">
                          <div
                            className="h-12 bg-gradient-to-r flex items-center px-4"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${card.cardDetails.color || "#ff6b00"}, ${
                                card.cardDetails.secondaryColor || "#cc5500"
                              })`,
                            }}
                          >
                            <h3 className="font-bold text-white">{card.cardDetails.name}</h3>
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Joining Fee</h4>
                                <p className="font-bold">{comparisonCard.fees.joining_amount}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Annual Fee</h4>
                                <p className="font-bold">{comparisonCard.fees.renewal_amount}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Foreign Transaction Fee</h4>
                                <p className="font-bold">{comparisonCard.fees.forex_percentage}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Reward Redemption</h4>
                                <p className="text-sm">{comparisonCard.fees.reward_redemption_description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="benefits">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedCards.map((card) => {
                      const comparisonCard = getComparisonDataForCard(card.cardDetails.name)
                      return (
                        <Card key={card.id} className="overflow-hidden">
                          <div
                            className="h-12 bg-gradient-to-r flex items-center px-4"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${card.cardDetails.color || "#ff6b00"}, ${
                                card.cardDetails.secondaryColor || "#cc5500"
                              })`,
                            }}
                          >
                            <h3 className="font-bold text-white">{card.cardDetails.name}</h3>
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                  <ThumbsUp className="h-4 w-4 text-green-500" /> Pros
                                </h4>
                                <ul className="space-y-1">
                                  {comparisonCard.pros.map((pro, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                      <span>{pro}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                  <ThumbsDown className="h-4 w-4 text-red-500" /> Cons
                                </h4>
                                <ul className="space-y-1">
                                  {comparisonCard.cons.map((con, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                      <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                      <span>{con}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-1">Lounge Access</h4>
                                <div className="space-y-1 text-sm">
                                  {comparisonCard.lounge_access.international_count && (
                                    <p>International: {comparisonCard.lounge_access.international_count}</p>
                                  )}
                                  {comparisonCard.lounge_access.domestic_count && (
                                    <p>Domestic: {comparisonCard.lounge_access.domestic_count}</p>
                                  )}
                                  {!comparisonCard.lounge_access.international_count &&
                                    !comparisonCard.lounge_access.domestic_count && <p>No lounge access</p>}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-1">Overall Evaluation</h4>
                                <p className="text-sm">{comparisonCard.overall_evaluation}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="partners">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedCards.map((card) => {
                      const comparisonCard = getComparisonDataForCard(card.cardDetails.name)
                      return (
                        <Card key={card.id} className="overflow-hidden">
                          <div
                            className="h-12 bg-gradient-to-r flex items-center px-4"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${card.cardDetails.color || "#ff6b00"}, ${
                                card.cardDetails.secondaryColor || "#cc5500"
                              })`,
                            }}
                          >
                            <h3 className="font-bold text-white">{card.cardDetails.name}</h3>
                          </div>
                          <CardContent className="p-4">
                            {comparisonCard.transfer_partners.length > 0 ? (
                              <div className="space-y-4">
                                {comparisonCard.transfer_partners.map((partner, i) => (
                                  <div key={i} className="border rounded-lg p-3">
                                    <h4 className="font-medium text-sm mb-1">{partner.partner_name}</h4>
                                    <div className="space-y-1 text-sm">
                                      <p className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-xs">
                                          {partner.partner_type}
                                        </Badge>
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">Transfer Ratio:</span>{" "}
                                        {partner.transfer_ratio}
                                      </p>
                                      {partner.notes && (
                                        <p className="text-xs text-muted-foreground mt-2">{partner.notes}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-40 text-center">
                                <Info className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No transfer partners available</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">Select Cards to Compare</h3>
          <p className="text-muted-foreground">Choose cards using the dropdowns above to see a detailed comparison.</p>
        </Card>
      )}
    </div>
  )
}
