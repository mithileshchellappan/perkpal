"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCardCarousel } from "@/components/credit-card-carousel"
import { CardDetailView } from "@/components/card-detail-view"
import { StatementUpload } from "@/components/statement-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import type { CreditCardType } from "@/lib/types"
import { Plus } from "lucide-react"

interface MyCardsViewProps {
  cards: CreditCardType[]
  onAddCard: () => void
  onRemoveCard?: (cardId: string) => void
}

export function MyCardsView({ cards, onAddCard, onRemoveCard }: MyCardsViewProps) {
  const [selectedCard, setSelectedCard] = useState<CreditCardType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "statements">("overview")
  const [localCards, setLocalCards] = useState<CreditCardType[]>(cards)

  const handleSelectCard = (card: CreditCardType) => {
    setIsLoading(true)
    // Simulate loading data
    setTimeout(() => {
      setSelectedCard(card)
      setIsLoading(false)
    }, 1000)
  }

  const handleCloseDetails = () => {
    setSelectedCard(null)
  }

  const handleRemoveCard = (cardId: string) => {
    setIsLoading(true)

    // Remove card from local state
    const updatedCards = localCards.filter((card) => card.id !== cardId)
    setLocalCards(updatedCards)

    // Call the parent handler if provided
    if (onRemoveCard) {
      onRemoveCard(cardId)
    }

    // Show success toast
    toast({
      title: "Card removed",
      description: "The credit card has been successfully removed.",
      duration: 3000,
    })

    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-9 w-24" />
              </div>

              <div className="flex space-x-4 overflow-hidden">
                <Skeleton className="min-w-[calc(50%-8px)] h-56 rounded-xl" />
                <Skeleton className="min-w-[calc(50%-8px)] h-56 rounded-xl" />
              </div>

              <div className="flex justify-between mt-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex gap-1">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayCards = onRemoveCard ? localCards : cards

  return (
    <div className="space-y-4">
      {!selectedCard ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">My Credit Cards</h2>
            <Button size="sm" onClick={onAddCard} className="gap-2">
              <Plus className="h-4 w-4" /> Add New Card
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "statements")}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Card Overview</TabsTrigger>
              <TabsTrigger value="statements">Statement Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Credit Cards</CardTitle>
                  <CardDescription>Select a card to view detailed information</CardDescription>
                </CardHeader>
                <CardContent>
                  <CreditCardCarousel
                    cards={displayCards}
                    onSelectCard={handleSelectCard}
                    onRemoveCard={handleRemoveCard}
                    onAddCard={onAddCard}
                    showAddButton={false}
                    title="Your Cards"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card Management</CardTitle>
                  <CardDescription>Manage your credit cards and track rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Total Points</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {displayCards.reduce((sum, card) => sum + card.pointsBalance, 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Across all cards</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Cash Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {displayCards.reduce((sum, card) => sum + card.baseValue, 0).toLocaleString()} {displayCards[0]?.currency}
                        </p>
                        <p className="text-sm text-muted-foreground">Estimated redemption value</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Annual Fees</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {displayCards.reduce((sum, card) => sum + card.annualFee, 0).toLocaleString()} {displayCards[0]?.currency}
                        </p>
                        <p className="text-sm text-muted-foreground">Total annual cost</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statements">
              <StatementUpload cards={displayCards} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <CardDetailView card={selectedCard} onClose={handleCloseDetails} />
      )}
    </div>
  )
}
