"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Check, Star, ArrowRight, DollarSign, MousePointerClick, ChevronRight, Loader2, Plus, X } from "lucide-react"
import { generateColorFromString } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CardNetworkLogo } from "@/components/card-network-logo"
import { useUserCards } from "@/hooks/use-user-cards"
import { toast } from "sonner"
import type { PersonalizedCardSuggestionResponse } from "@/types/cards"
import { ScrollArea } from "@/components/ui/scroll-area"

function adjustColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        ("0" + Math.min(255, Math.max(0, Number.parseInt(color, 16) + amount)).toString(16)).substr(-2),
      )
  )
}

export function NewCardView() {
  const { cards, isLoading: isLoadingCards } = useUserCards()
  const [cardType, setCardType] = useState<string>("")
  const [spendingCategories, setSpendingCategories] = useState<string[]>([])
  const [additionalPreference, setAdditionalPreference] = useState("")
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<PersonalizedCardSuggestionResponse | null>(null)
  const [country, setCountry] = useState("India") // Default to India
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // Update country based on user's first card
  useEffect(() => {
    if (cards && cards.length > 0 && cards[0].country) {
      setCountry(cards[0].country)
    }
  }, [cards])

  const addSpendingCategory = () => {
    if (selectedCategory && !spendingCategories.includes(selectedCategory)) {
      setSpendingCategories([...spendingCategories, selectedCategory])
      setSelectedCategory("")
    }
  }

  const removeSpendingCategory = (category: string) => {
    setSpendingCategories(spendingCategories.filter(cat => cat !== category))
  }

  const handleFindCards = async () => {
    if (!cardType) {
      toast.error("Please select a card type")
      return
    }

    setIsLoading(true)
    try {
      // Prepare request data
      const requestData = {
        current_cards: cards.map(card => ({
          cardName: card.name,
          issuingBank: card.issuer
        })),
        desired_card_type: cardType,
        country,
        primary_spending_categories: spendingCategories.length > 0 ? spendingCategories : null,
        additional_preferences: additionalPreference.length > 0 ? additionalPreference : null
      }

      // Call the personalized suggestions API
      const response = await fetch('/api/personalized-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to get personalized card suggestions')
      }

      setRecommendations(result.data)
      setShowRecommendations(true)
    } catch (error) {
      console.error('Error fetching card suggestions:', error)
      toast.error('Failed to get card suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 h-full">
      <div className="flex items-center mb-6">
        <Search className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">Find Your Next Card</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Card Preferences</CardTitle>
            <CardDescription>Tell us what you're looking for in a new card</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-cards">Current Cards</Label>
              {isLoadingCards ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input 
                  id="current-cards" 
                  value={cards.length > 0 
                    ? cards.map(card => `${card.name.replaceAll(card.issuer, '').replaceAll('Credit Card', '')}`).join(', ') 
                    : 'No cards added yet'
                  } 
                   disabled={cards.length !== 0}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={country} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-type">Desired Card Type</Label>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger id="card-type">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Travel Rewards">Travel Rewards</SelectItem>
                  <SelectItem value="Cashback">Cash Back</SelectItem>
                  <SelectItem value="Dining">Dining Rewards</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Low Annual Fee">Low Annual Fee</SelectItem>
                  <SelectItem value="No Annual Fee">No Annual Fee</SelectItem>
                  <SelectItem value="Fuel">Fuel Rewards</SelectItem>
                  <SelectItem value="Forex">Forex Optimized</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle & Entertainment</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Hotel">Hotel Co-branded</SelectItem>
                  <SelectItem value="Airline">Airline Co-branded</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Ultra-Premium">Ultra-Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Spending Categories</Label>
              <div className="flex space-x-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Dining">Dining</SelectItem>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Gas">Gas/Fuel</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Utilities">Bills & Utilities</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Transit">Transit & Commute</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={addSpendingCategory} 
                  disabled={!selectedCategory || spendingCategories.includes(selectedCategory)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {spendingCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeSpendingCategory(category)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional-preference">Additional Preferences</Label>
              <Input
                id="additional-preference"
                placeholder="e.g., airport lounges, 0% APR, etc."
                value={additionalPreference}
                onChange={(e) => setAdditionalPreference(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFindCards} disabled={!cardType || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Cards...
                </>
              ) : (
                <>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Find Cards
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div>
          {!showRecommendations && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Search className="h-16 w-16 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-2">Find Your Perfect Card</h2>
              <p className="text-muted-foreground max-w-md">
                Select your preferences and click "Find Cards" to see personalized recommendations.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-[300px] rounded-xl" />
                <Skeleton className="h-[300px] rounded-xl" />
                <Skeleton className="h-[300px] rounded-xl" />
              </div>
            </div>
          )}

          {showRecommendations && !isLoading && recommendations && (
            <ScrollArea className="h-full">
              <div className="pr-4">
                {recommendations.evaluation_of_current_cards && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Portfolio Evaluation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{recommendations.evaluation_of_current_cards}</p>
                    </CardContent>
                  </Card>
                )}
                
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold">Recommended Cards</h2>
                  <p className="text-muted-foreground">
                    Based on your {cardType} preference{spendingCategories.length > 0 ? ` and ${spendingCategories.join(', ')} spending` : ''}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  {recommendations.suggested_cards.map((card, index) => {
                    const baseColor = generateColorFromString(`${card.card_name}-${card.issuing_bank}`)
                    const secondaryColor = adjustColor(baseColor, 20)
                    const accentColor = adjustColor(baseColor, -30)
                    
                    return (
                      <Card key={index} className="overflow-hidden">
                        <div
                          className="h-36 relative"
                          style={{
                            background: `linear-gradient(135deg, ${baseColor} 0%, ${secondaryColor} 100%)`,
                            boxShadow: `inset 0 0 60px rgba(0, 0, 0, 0.2)`,
                          }}
                        >
                          {/* Add subtle pattern overlay */}
                          <div
                            className="absolute inset-0 opacity-10 mix-blend-overlay"
                            style={{
                              backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor} 1px, transparent 1px)`,
                              backgroundSize: "20px 20px",
                            }}
                          />

                          {/* Add subtle highlight */}
                          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/10 to-transparent" />

                          <div className="absolute top-4 right-4">
                            <Badge className="font-semibold">{card.primary_card_category}</Badge>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <h3 className="font-bold text-white text-xl">{card.card_name}</h3>
                            <p className="text-sm text-white/90">{card.issuing_bank}</p>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <p className="mb-4">{card.justification}</p>
                          
                          <h4 className="font-medium mb-2">Key Benefits:</h4>
                          <ul className="space-y-2">
                            {card.key_benefits.map((benefit, idx) => (
                              <li key={idx} className="flex gap-2">
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                
                {recommendations.important_considerations && recommendations.important_considerations.length > 0 && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Important Considerations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {recommendations.important_considerations.map((consideration, idx) => (
                          <li key={idx} className="flex gap-2">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}
