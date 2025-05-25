"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Info, ArrowRight, ThumbsUp, ThumbsDown, CreditCardIcon, Plus, Loader2, ChevronRight } from "lucide-react"
import type { CreditCardType } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CardNetworkLogo } from "@/components/card-network-logo"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard } from "@/components/credit-card-carousel"
import type { CardComparisonResponse, ComparedCardDetails } from "@/types/cards"
import { toast } from "sonner"

// Default empty comparison data structure
const emptyComparisonData: CardComparisonResponse = {
  comparison_country: "",
  compared_cards: [],
  comparison_summary: "",
  recommendation_notes: [],
}

// Default networks for card display
const defaultNetworks: Record<string, string> = {
  "Axis Bank": "visa",
  "HDFC Bank": "mastercard",
  "ICICI Bank": "visa",
  "SBI Card": "rupay",
  "American Express": "amex",
  "Citi": "mastercard",
}

// Default colors for cards
const defaultColors: Record<string, {color: string, secondaryColor: string}> = {
  "Axis Bank": { color: "#0f4c81", secondaryColor: "#1a6baf" },
  "HDFC Bank": { color: "#1a237e", secondaryColor: "#303f9f" },
  "ICICI Bank": { color: "#ff7f50", secondaryColor: "#ff9e7d" },
  "SBI Card": { color: "#2e7d32", secondaryColor: "#43a047" },
  "American Express": { color: "#c0c0c0", secondaryColor: "#e0e0e0" },
  "Citi": { color: "#00539f", secondaryColor: "#0080ff" },
}

// Interface for bank card data from API
interface CardProduct {
  id: string;
  name: string;
  briefDescription?: string;
  network?: string;
  color?: string;
  secondaryColor?: string;
}

interface BankWithCards {
  name: string;
  cards: CardProduct[];
}

// Helper function to get comparison data for a card
const getComparisonDataForCard = (cardName: string, comparisonData: CardComparisonResponse): ComparedCardDetails => {
  return (
    comparisonData.compared_cards.find((card) => card.card_name === cardName) || 
    // Return empty data if not found
    {
      card_name: cardName,
      issuing_bank: "",
      reward_on_spending: "",
      pros: [],
      cons: [],
      fees: {
        joining_amount: null,
        renewal_amount: null,
        forex_percentage: null,
        apr_description: null,
        addon_card_amount: null,
        reward_redemption_description: null,
      },
      transfer_partners: [],
      welcome_offer_summary: null,
      key_reward_highlights: [],
      annual_fee_display: "",
      lounge_access: {
        international_count: null,
        domestic_count: null,
      },
      overall_evaluation: "",
    }
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
  const [availableCards, setAvailableCards] = useState<CardProduct[]>([])
  const [isAddingCard, setIsAddingCard] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [comparisonData, setComparisonData] = useState<CardComparisonResponse>(emptyComparisonData)
  const [hasComparisonData, setHasComparisonData] = useState(false)
  const [bankOptions, setBankOptions] = useState<BankWithCards[]>([])
  const [isLoadingBanks, setIsLoadingBanks] = useState(true)
  const [userCountry, setUserCountry] = useState<string>("USA")
  const [showComparison, setShowComparison] = useState(false)
  const [isComparingCards, setIsComparingCards] = useState(false)

  useEffect(() => {
    if (cards && cards.length > 0 && cards[0].country) {
      setUserCountry(cards[0].country);
    }
  }, [cards]);

  // Fetch banks and cards from API
  useEffect(() => {
    const fetchBanksAndCards = async () => {
      setIsLoadingBanks(true);
      try {
        const response = await fetch(`/api/bank-cards?country=${encodeURIComponent(userCountry)}`);
        const result = await response.json();
        
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || 'Failed to fetch banks and cards');
        }
        
        const banksData: BankWithCards[] = result.data;

        // Add network and color properties to each card
        const enhancedBanksData = banksData.map(bank => {
          return {
            ...bank,
            cards: bank.cards.map(card => ({
              ...card,
              network: defaultNetworks[bank.name] || "visa",
              color: defaultColors[bank.name]?.color || "#ff6b00",
              secondaryColor: defaultColors[bank.name]?.secondaryColor || "#cc5500",
            }))
          };
        });
        
        setBankOptions(enhancedBanksData);
      } catch (error) {
        console.error('Error fetching bank products:', error);
        toast.error('Failed to load banks and cards');
      } finally {
        setIsLoadingBanks(false);
      }
    };
    
    fetchBanksAndCards();
  }, [userCountry]);

  // Update available cards when bank is selected
  useEffect(() => {
    if (selectedBank) {
      const bank = bankOptions.find((b) => b.name === selectedBank);
      setAvailableCards(bank ? bank.cards : []);
      setSelectedCard(null);
    } else {
      setAvailableCards([]);
    }
  }, [selectedBank, bankOptions]);

  // Remove the auto-fetching useEffect for comparison data
  // and replace with a function to fetch on demand

  const fetchComparisonData = async () => {
    if (selectedCards.length < 2) {
      toast.error('Please select at least 2 cards to compare');
      return;
    }

    setIsComparingCards(true);
    
    try {
      const response = await fetch('/api/card-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardsToCompare: selectedCards.map(card => ({
            cardName: card.cardDetails.name,
            issuingBank: card.cardDetails.issuer,
          })),
          country: userCountry,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setComparisonData(data.data);
        setHasComparisonData(true);
        setShowComparison(true);
      } else {
        toast.error('Failed to fetch comparison data');
        setComparisonData(emptyComparisonData);
        setHasComparisonData(false);
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      toast.error('Error fetching comparison data');
    } finally {
      setIsComparingCards(false);
    }
  };

  const handleAddCard = () => {
    if (selectedCard && selectedBank) {
      const cardInfo = availableCards.find((c) => c.name === selectedCard);
      if (cardInfo) {
        const newCard = {
          id: crypto.randomUUID(),
          cardDetails: {
            name: selectedCard,
            issuer: selectedBank,
            network: defaultNetworks[selectedBank] || "visa",
            color: defaultColors[selectedBank]?.color || "#ff6b00",
            secondaryColor: defaultColors[selectedBank]?.secondaryColor || "#cc5500",
          },
        };
        setSelectedCards([...selectedCards, newCard]);
        setSelectedBank(null);
        setSelectedCard(null);
        setIsAddingCard(selectedCards.length < 2); // Only allow adding another card if less than 3 cards selected
      }
    }
  };

  const removeCard = (id: string) => {
    setSelectedCards(selectedCards.filter((card) => card.id !== id));
    setIsAddingCard(true);
    // Reset comparison view if a card is removed
    if (showComparison) {
      setShowComparison(false);
    }
  };

  const clearSelection = () => {
    setSelectedCards([]);
    setIsAddingCard(true);
    // Reset comparison view if selection is cleared
    if (showComparison) {
      setShowComparison(false);
    }
  };

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
                    network: card.cardDetails.network || defaultNetworks[card.cardDetails.issuer] || "visa",
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
                  {isLoadingBanks ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                      <p className="text-sm text-muted-foreground">Loading banks...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Bank</label>
                        <Select value={selectedBank || ""} onValueChange={setSelectedBank}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a bank" />
                          </SelectTrigger>
                          <SelectContent>
                            {bankOptions.map((bank) => (
                              <SelectItem key={bank.name} value={bank.name}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Card</label>
                        <Select value={selectedCard || ""} onValueChange={setSelectedCard} disabled={!selectedBank}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a card">
                              <div className="truncate max-w-[90%]">{selectedCard}</div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {availableCards.map((card) => (
                              <SelectItem key={card.id} value={card.name}>
                                <div className="truncate max-w-[250px]">
                                  <span className="block truncate font-medium">{card.name}</span>
                                  {card.briefDescription && (
                                    <span className="text-xs text-muted-foreground block truncate">
                                      {card.briefDescription}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="w-full" disabled={!selectedCard} onClick={handleAddCard}>
                        <Plus className="h-4 w-4 mr-2" /> Add Card
                      </Button>
                    </div>
                  )}
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
          
          {selectedCards.length >= 2 && !showComparison && (
            <div className="mt-6">
              <Button 
                className="w-full" 
                onClick={fetchComparisonData} 
                disabled={isComparingCards}
              >
                {isComparingCards ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Comparing Cards...
                  </>
                ) : (
                  <>
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Compare Selected Cards
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showComparison && selectedCards.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Card Comparison</CardTitle>
            <CardDescription>
              Comparing {selectedCards.length} card{selectedCards.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Fetching comparison data...</p>
              </div>
            ) : (
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
                              {hasComparisonData && (() => {
                                const comparisonCard = getComparisonDataForCard(card.cardDetails.name, comparisonData)
                                return (
                                  <>
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Annual Fee</h4>
                                      <p className="font-bold">{comparisonCard.annual_fee_display || "Not available"}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Reward Type</h4>
                                      <p className="font-bold">
                                        {comparisonCard.reward_on_spending?.includes("cashback")
                                          ? "Cashback"
                                          : comparisonCard.reward_on_spending?.includes("miles")
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

                    {hasComparisonData && (
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
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="rewards">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedCards.map((card) => {
                        const comparisonCard = getComparisonDataForCard(card.cardDetails.name, comparisonData)
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
                        const comparisonCard = getComparisonDataForCard(card.cardDetails.name, comparisonData)
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
                                  <p className="font-bold">{comparisonCard.fees?.joining_amount || "N/A"}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Annual Fee</h4>
                                  <p className="font-bold">{comparisonCard.fees?.renewal_amount || "N/A"}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Foreign Transaction Fee</h4>
                                  <p className="font-bold">{comparisonCard.fees?.forex_percentage || "N/A"}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Reward Redemption</h4>
                                  <p className="text-sm">{comparisonCard.fees?.reward_redemption_description || "No information available"}</p>
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
                        const comparisonCard = getComparisonDataForCard(card.cardDetails.name, comparisonData)
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
                        const comparisonCard = getComparisonDataForCard(card.cardDetails.name, comparisonData)
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
            )}
          </CardContent>
        </Card>
      ) : (
        !showComparison && selectedCards.length >= 2 ? (
          <Card className="p-6 text-center">
            <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-2">Ready to Compare</h3>
            <p className="text-muted-foreground mb-4">
              You've selected {selectedCards.length} cards. Click the "Compare Selected Cards" button to see a detailed comparison.
            </p>
          </Card>
        ) : (
          <Card className="p-6 text-center">
            <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-2">Select Cards to Compare</h3>
            <p className="text-muted-foreground">
              Choose at least 2 cards using the dropdowns above to enable comparison.
            </p>
          </Card>
        )
      )}
    </div>
  )
}
