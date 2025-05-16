"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { CreditCardTable } from "@/components/credit-card-table"
import { CreditCardCarousel } from "@/components/credit-card-carousel"
import { AddEditCardModal } from "@/components/add-edit-card-modal"
import { UserProfile } from "@/components/user-profile"
import { RewardsView } from "@/components/rewards-view"
import { TravelPartnersView } from "@/components/travel-partners-view"
import { CardComparisonView } from "@/components/card-comparison-view"
import { PromotionsView } from "@/components/promotions-view"
import { MyCardsView } from "@/components/my-cards-view"
import { AiAssistantView } from "@/components/ai-assistant-view"
import { NewCardView } from "@/components/new-card-view"
import { LandingPage } from "@/components/landing-page"
import type { CreditCardType } from "@/lib/types"
import { CreditCard, Gift, Globe, BarChart, Tag, Bot, Search } from "lucide-react"
import { generateColorFromString } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"

// Sample data - update CreditCardType to include lastFourDigits
const initialCards: CreditCardType[] = [
  // {
  //   id: "1",
  //   name: "Sapphire Preferred",
  //   issuer: "Chase",
  //   number: "XXXX-XXXX-XXXX-4567",
  //   pointsBalance: 54892,
  //   cashValue: 1097.84,
  //   annualFee: 95,
  //   expiryDate: "05/2027",
  //   rewardsRate: 2.5,
  //   status: "Active",
  //   color: generateColorFromString("Sapphire Preferred"),
  //   secondaryColor: generateColorFromString("Sapphire Preferred"),
  //   network: "visa",
  // },
  // {
  //   id: "2",
  //   name: "Gold Card",
  //   issuer: "American Express",
  //   number: "XXXX-XXXX-XXXX-7890",
  //   pointsBalance: 32450,
  //   cashValue: 649.0,
  //   annualFee: 250,
  //   expiryDate: "09/2026",
  //   rewardsRate: 4,
  //   status: "Active",
  //   color: generateColorFromString("Gold Card"),
  //   secondaryColor: generateColorFromString("Gold Card"),
  //   network: "amex",
  // },
  // {
  //   id: "3",
  //   name: "Venture X",
  //   issuer: "Capital One",
  //   number: "XXXX-XXXX-XXXX-1234",
  //   pointsBalance: 87650,
  //   cashValue: 876.5,
  //   annualFee: 395,
  //   expiryDate: "03/2025",
  //   rewardsRate: 2,
  //   status: "Inactive",
  //   color: generateColorFromString("Venture X"),
  //   secondaryColor: generateColorFromString("Venture X"),
  //   network: "mastercard",
  // },
  // {
  //   id: "4",
  //   name: "Freedom Unlimited",
  //   issuer: "Chase",
  //   number: "XXXX-XXXX-XXXX-9876",
  //   pointsBalance: 12345,
  //   cashValue: 123.45,
  //   annualFee: 0,
  //   expiryDate: "11/2026",
  //   rewardsRate: 1.5,
  //   status: "Active",
  //   color: generateColorFromString("Freedom Unlimited"),
  //   secondaryColor: generateColorFromString("Freedom Unlimited"),
  //   network: "visa",
  // },
  // {
  //   id: "5",
  //   name: "Atlas Credit Card",
  //   issuer: "Axis Bank",
  //   number: "XXXX-XXXX-XXXX-5678",
  //   pointsBalance: 45678,
  //   cashValue: 456.78,
  //   annualFee: 5000,
  //   expiryDate: "07/2027",
  //   rewardsRate: 5,
  //   status: "Active",
  //   color: generateColorFromString("Atlas Credit Card"),
  //   secondaryColor: generateColorFromString("Atlas Credit Card"),
  //   network: "visa",
  // },
]

export default function Page() {
  const { isLoaded, isSignedIn } = useAuth()
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [cards, setCards] = useState<CreditCardType[]>(initialCards)
  const [selectedCard, setSelectedCard] = useState<CreditCardType | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeView, setActiveView] = useState<
    "dashboard" | "rewards" | "travel" | "compare" | "promotions" | "cards" | "assistant" | "new-card"
  >("dashboard")

  // Calculate totals
  const totalPoints = cards.reduce((sum, card) => sum + card.pointsBalance, 0)
  const totalCashValue = cards.reduce((sum, card) => sum + card.cashValue, 0)
  const totalAnnualFees = cards.reduce((sum, card) => sum + card.annualFee, 0)

  useEffect(() => {
    if (isLoaded) {
      setIsLoadingAuth(false)
    }
  }, [isLoaded])

  const handleAddCard = (card: CreditCardType) => {
    setCards([...cards, card])
    setShowAddModal(false)
  }

  const handleEditCard = (updatedCard: CreditCardType) => {
    setCards(cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
  }

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id))
  }

  const handleLogin = () => {
    // This is now handled by Clerk in the LandingPage component
  }

  if (isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>
  }

  if (!isSignedIn) {
    return <LandingPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-r bg-background/50 backdrop-blur flex flex-col h-screen">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <CreditCard className="h-6 w-6" />
            <span className="font-bold">PerkPal</span>
          </div>
          <nav className="space-y-2 px-2 flex-1">
            <Button
              variant={activeView === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveView("dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeView === "cards" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveView("cards")}
            >
              <CreditCard className="h-4 w-4" />
              My Cards
            </Button>
            <Button
              variant={activeView === "rewards" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveView("rewards")}
            >
              <Gift className="h-4 w-4" />
              Rewards
            </Button>
            <Button
              variant={activeView === "promotions" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveView("promotions")}
            >
              <Tag className="h-4 w-4" />
              Promotions
            </Button>
            <Button
              variant={activeView === "travel" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveView("travel")}
            >
              <Globe className="h-4 w-4" />
              Travel Partners
            </Button>
            <Button
              variant={activeView === "compare" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveView("compare")}
            >
              <BarChart className="h-4 w-4" />
              Card Comparison
            </Button>
            <Button
              variant={activeView === "new-card" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveView("new-card")}
            >
              <Search className="h-4 w-4" />
              New Card
            </Button>
            <Button
              variant={activeView === "assistant" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveView("assistant")}
            >
              <Bot className="h-4 w-4" />
              AI Assistant
            </Button>
          </nav>

          <div className="mt-auto border-t pt-2 p-2">
            <UserProfile />
          </div>
        </aside>
        <main className="p-6 overflow-auto h-screen">
          {activeView === "dashboard" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">Credit Card Points Dashboard</h1>
                  <div className="text-sm text-muted-foreground">Track and manage your credit card rewards</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <MetricsCard
                  title="Total Points"
                  value={totalPoints.toLocaleString()}
                  icon={<Gift className="h-4 w-4 text-primary" />}
                  change={{ value: "2,340", percentage: "+5.2%", isPositive: true }}
                />
                <MetricsCard
                  title="Cash Value"
                  value={`$${totalCashValue.toLocaleString()}`}
                  icon={<Tag className="h-4 w-4 text-primary" />}
                  change={{ value: "$120.40", percentage: "+3.8%", isPositive: true }}
                />
                <MetricsCard
                  title="Annual Fees"
                  value={`$${totalAnnualFees.toLocaleString()}`}
                  icon={<CreditCard className="h-4 w-4 text-primary" />}
                  change={{ value: "$0", percentage: "0%", isPositive: true }}
                />
              </div>

              <Card className="mt-6 p-6">
                <CreditCardCarousel
                  cards={cards}
                  onSelectCard={setSelectedCard}
                  onAddCard={() => setShowAddModal(true)}
                />
              </Card>

              <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Points History</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      3 Months
                    </Button>
                    <Button size="sm" variant="ghost">
                      6 Months
                    </Button>
                    <Button size="sm" variant="ghost">
                      1 Year
                    </Button>
                    <Button size="sm" variant="ghost">
                      All Time
                    </Button>
                  </div>
                </div>
                <StatsChart />
              </Card>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Credit Card Details</h2>
                </div>
                <CreditCardTable cards={cards} onEdit={handleEditCard} onDelete={handleDeleteCard} />
              </div>
            </>
          )}

          {activeView === "cards" && (
            <Card className="p-6">
              <MyCardsView cards={cards} onAddCard={() => setShowAddModal(true)} />
            </Card>
          )}

          {activeView === "rewards" && (
            <Card className="p-6">
              <RewardsView />
            </Card>
          )}

          {activeView === "travel" && (
            <Card className="p-6">
              <TravelPartnersView cards={cards} />
            </Card>
          )}

          {activeView === "compare" && (
            <Card className="p-6">
              <CardComparisonView cards={cards} />
            </Card>
          )}

          {activeView === "promotions" && (
            <Card className="p-6">
              <PromotionsView cards={cards} />
            </Card>
          )}

          {activeView === "new-card" && <NewCardView />}

          {activeView === "assistant" && <AiAssistantView />}
        </main>
      </div>

      <AddEditCardModal open={showAddModal} onOpenChange={setShowAddModal} onSave={handleAddCard} />
    </div>
  )
}