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
import { useUserCards } from "@/hooks/use-user-cards"
import { CreditCardTable } from "@/components/credit-card-table"

interface MyCardsViewProps {
  cards: CreditCardType[]
  onAddCard: () => void
  onRemoveCard?: (cardId: string) => void
}

export function MyCardsView({ cards, onAddCard, onRemoveCard }: MyCardsViewProps) {
  const [selectedCard, setSelectedCard] = useState<CreditCardType | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "statements">("overview")
  
  const { deleteCard } = useUserCards({fetchCardsOnMount: false})

  const handleSelectCard = (card: CreditCardType) => {
    setSelectedCard(card)
  }

  const handleCloseDetails = () => {
    setSelectedCard(null)
  }

  const handleRemoveCard = async (cardId: string) => {
    try {
      const success = await deleteCard(cardId);
      
      if (success) {
        if (onRemoveCard) {
          onRemoveCard(cardId)
        }

        toast({
          title: "Card removed",
          description: "The credit card has been successfully removed.",
          duration: 3000,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to remove the credit card. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error removing card:", error);
      toast({
        title: "Error",
        description: "Failed to remove the credit card. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }
  
  const handleEditCard = (updatedCard: CreditCardType) => {
    // This would typically update the card in the database
    toast({
      title: "Card updated",
      description: "The credit card has been successfully updated.",
      duration: 3000,
    })
  }
  const displayCards = cards

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
                          {displayCards.reduce((sum, card) => sum + card.cashValue, 0).toLocaleString(undefined, {
                            currency: displayCards[0]?.currency || "USD",
                            style: "currency",
                          })}
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
                          {displayCards.reduce((sum, card) => sum + (card.annualFee || 0), 0).toLocaleString(undefined, {
                            currency: displayCards[0]?.currency || "USD",
                            style: "currency",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">Total annual cost</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Credit Card Details</CardTitle>
                  <CardDescription>Detailed information about all your cards</CardDescription>
                </CardHeader>
                <CardContent>
                  <CreditCardTable cards={displayCards} onEdit={handleEditCard} onDelete={handleRemoveCard} />
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
