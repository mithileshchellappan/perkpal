"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Info, ExternalLink, Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { useUserCards } from "@/hooks/use-user-cards"

// Types for the data
interface CardToUse {
  cardName: string
  issuingBank: string
  rewardPoints: string
  reasoning: string
  source: string
}

interface EcommerceRecommendation {
  ecomm_partner_name: string
  ecomm_partner_logo_url: string
  cards_to_use: CardToUse[]
  additional_notes: string
}

interface EcommerceRewardsData {
  country: string
  recommendations: EcommerceRecommendation[]
  overall_summary: string
}

export function EcommerceRewardsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ecommerceRewardsData, setEcommerceRewardsData] = useState<EcommerceRewardsData | null>(null)
  const { userId } = useAuth()
  const { cards, isLoading: isLoadingCards, error: cardsError } = useUserCards()

  useEffect(() => {
    async function fetchData() {
      try {
        // Wait until cards are loaded
        if (isLoadingCards || !cards || cards.length === 0) return

        setLoading(true)
        setError(null)

        // Prepare data for the API using the cards from the hook
        const requestData = {
          cards: cards.map(card => ({
            cardName: card.name,
            issuingBank: card.issuer,
          })),
          country: cards.length > 0 ? cards[0].country : "United States" // Default to US if no cards
        }

        // Call the ecommerce-advisor API
        const response = await fetch('/api/ecommerce-advisor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch recommendations')
        }

        const data = await response.json()
        setEcommerceRewardsData(data)
      } catch (err: any) {
        console.error('Error fetching ecommerce rewards data:', err)
        setError(err.message || 'Something went wrong fetching recommendations')
        toast.error('Failed to load e-commerce recommendations')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [cards, isLoadingCards])

  // If still loading or no data yet
  if (loading || isLoadingCards) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading e-commerce recommendations...</p>
      </div>
    )
  }

  // If there was an error
  if (error || cardsError || !ecommerceRewardsData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>E-commerce Rewards</CardTitle>
          <CardDescription>Maximize your rewards across different platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-muted-foreground">
              {error || cardsError?.message || "Unable to load e-commerce recommendations at this time. Please try again later."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get unique card names for filtering
  const uniqueCards = Array.from(
    new Set(
      ecommerceRewardsData.recommendations
        .flatMap((rec) => rec.cards_to_use)
        .map((card) => `${card.issuingBank} ${card.cardName}`),
    ),
  )

  // Filter recommendations based on search term and selected card
  const filteredRecommendations = ecommerceRewardsData.recommendations.filter((rec) => {
    const matchesSearch = rec.ecomm_partner_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCard = selectedCard
      ? rec.cards_to_use.some((card) => `${card.issuingBank} ${card.cardName}` === selectedCard)
      : true
    return matchesSearch && matchesCard
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">E-commerce Rewards</h2>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Maximize Your Rewards</CardTitle>
          <CardDescription>
            Find the best card to use for each e-commerce platform in {ecommerceRewardsData.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search platforms..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                value={selectedCard || ""}
                onChange={(e) => setSelectedCard(e.target.value || null)}
              >
                <option value="">All Cards</option>
                {uniqueCards.map((card) => (
                  <option key={card} value={card}>
                    {card}
                  </option>
                ))}
              </select>
            </div>

            <Card className="bg-muted/50 p-4">
              <div className="flex gap-2 items-start">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">{ecommerceRewardsData.overall_summary}</p>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <Badge variant="outline">
            {filteredRecommendations.length} of {ecommerceRewardsData.recommendations.length} platforms
          </Badge>
        </div>

        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.ecomm_partner_name} className="overflow-hidden">
                <div className="h-16 flex items-center justify-center bg-background border-b p-2">
                  <div className="relative h-full w-full max-w-[120px]">
                    <img
                      src={recommendation.ecomm_partner_logo_url || "/placeholder.svg"}
                      alt={recommendation.ecomm_partner_name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{recommendation.ecomm_partner_name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {recommendation.cards_to_use.map((card) => (
                    <div key={`${card.issuingBank}-${card.cardName}`} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-primary/10">
                          {card.issuingBank} {card.cardName}
                        </Badge>
                        {card.source && (
                          <a
                            href={card.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                          >
                            Source <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm font-medium">{card.rewardPoints}</p>
                      <p className="text-xs text-muted-foreground">{card.reasoning}</p>
                    </div>
                  ))}
                  {recommendation.additional_notes && (
                    <div className="pt-2 text-xs bg-muted/30 p-2 rounded-md">
                      <p className="font-medium mb-1">Additional Notes:</p>
                      <p>{recommendation.additional_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation) => (
                <Card key={recommendation.ecomm_partner_name}>
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-24 md:h-auto flex items-center justify-center p-4 bg-background border-b md:border-b-0 md:border-r">
                      <div className="relative h-full w-full max-w-[120px]">
                        <img
                          src={recommendation.ecomm_partner_logo_url || "/placeholder.svg"}
                          alt={recommendation.ecomm_partner_name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="text-lg font-semibold mb-2">{recommendation.ecomm_partner_name}</h3>
                      <div className="space-y-4">
                        {recommendation.cards_to_use.map((card) => (
                          <div key={`${card.issuingBank}-${card.cardName}`} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="bg-primary/10">
                                {card.issuingBank} {card.cardName}
                              </Badge>
                              {card.source && (
                                <a
                                  href={card.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                                >
                                  Source <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm font-medium">{card.rewardPoints}</p>
                            <p className="text-sm text-muted-foreground">{card.reasoning}</p>
                          </div>
                        ))}
                        {recommendation.additional_notes && (
                          <div className="pt-2 text-sm bg-muted/30 p-3 rounded-md">
                            <p className="font-medium mb-1">Additional Notes:</p>
                            <p>{recommendation.additional_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
