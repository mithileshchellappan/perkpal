"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react"
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
import { useAuth } from "@clerk/nextjs"
import { useUserCards } from "@/hooks/use-user-cards"
import { cn } from "@/lib/utils"
import { NotificationPanel } from "@/components/notification-panel"

export default function Page() {
  const { isLoaded, isSignedIn } = useAuth()
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const {
    cards,
    isLoading: isLoadingCards,
    error: cardsError,
    refetch: refetchCards,
    addCard,
    isAddingCard,
    addCardError,
  } = useUserCards()

  const [selectedCard, setSelectedCard] = useState<CreditCardType | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeView, setActiveView] = useState<
    "dashboard" | "rewards" | "travel" | "compare" | "promotions" | "cards" | "assistant" | "new-card"
  >("dashboard")

  // Calculate totals
  const totalPoints = cards.reduce((sum, card) => sum + (card.pointsBalance || 0), 0)
  const totalCashValue = cards.reduce((sum, card) => sum + (card.cashValue || 0), 0)
  const totalAnnualFees = cards.reduce((sum, card) => sum + (card.annualFee || 0), 0)
  const baseValueCurrency = cards[0]?.currency || "USD"

  useEffect(() => {
    if (isLoaded) {
      setIsLoadingAuth(false)
    }
  }, [isLoaded])

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setSidebarCollapsed(savedState === "true")
    }
  }, [])

  const handleAddCard = (card: CreditCardType) => {
    setShowAddModal(false)
    console.log("Adding card (placeholder - needs backend integration & refetch):", card)
  }

  const handleEditCard = (updatedCard: CreditCardType) => {
    console.log("Editing card (placeholder - needs backend integration & refetch):", updatedCard)
  }

  const handleDeleteCard = (id: string) => {
    console.log("Deleting card (placeholder - needs backend integration & refetch):", id)
  }

  const handleLogin = () => {
    // This is now handled by Clerk in the LandingPage component
  }

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    // Save to localStorage for persistence
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  if (isLoadingAuth || isLoadingCards) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>
  }

  if (!isSignedIn) {
    return <LandingPage onLogin={handleLogin} />
  }

  if (cardsError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <p>Error loading your cards: {cardsError.message}</p>
        <Button onClick={() => refetchCards()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className={cn(
          "grid transition-all duration-300",
          sidebarCollapsed ? "lg:grid-cols-[80px_1fr]" : "lg:grid-cols-[240px_1fr]",
        )}
      >
        <aside className="border-r bg-background/50 backdrop-blur flex flex-col h-screen relative">
          <div className="flex h-16 items-center justify-between border-b px-6 relative">
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              {!sidebarCollapsed && <span className="font-bold">PerkPal</span>}
            </div>

            {/* Toggle button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-border bg-background shadow-md"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>
          </div>
          <nav className="space-y-2 px-2 pt-6 flex-1">
            <Button
              variant={activeView === "dashboard" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center px-0")}
              onClick={() => setActiveView("dashboard")}
              title="Home"
            >
              <LayoutDashboard className="h-4 w-4" />
              {!sidebarCollapsed && <span>Home</span>}
            </Button>
            <Button
              variant={activeView === "cards" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center px-0")}
              onClick={() => setActiveView("cards")}
              title="My Cards"
            >
              <CreditCard className="h-4 w-4" />
              {!sidebarCollapsed && <span>My Cards</span>}
            </Button>
            <Button
              variant={activeView === "rewards" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center px-0")}
              onClick={() => setActiveView("rewards")}
              title="Rewards"
            >
              <Gift className="h-4 w-4" />
              {!sidebarCollapsed && <span>Rewards</span>}
            </Button>
            <Button
              variant={activeView === "promotions" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center px-0")}
              onClick={() => setActiveView("promotions")}
              title="Promotions"
            >
              <Tag className="h-4 w-4" />
              {!sidebarCollapsed && <span>Promotions</span>}
            </Button>
            <Button
              variant={activeView === "travel" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center px-0")}
              onClick={() => setActiveView("travel")}
              title="Travel Partners"
            >
              <Globe className="h-4 w-4" />
              {!sidebarCollapsed && <span>Travel Partners</span>}
            </Button>
            <Button
              variant={activeView === "compare" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center px-0")}
              onClick={() => setActiveView("compare")}
              title="Card Comparison"
            >
              <BarChart className="h-4 w-4" />
              {!sidebarCollapsed && <span>Card Comparison</span>}
            </Button>
            <Button
              variant={activeView === "new-card" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center px-0")}
              onClick={() => setActiveView("new-card")}
              title="New Card"
            >
              <Search className="h-4 w-4" />
              {!sidebarCollapsed && <span>New Card</span>}
            </Button>
            <Button
              variant={activeView === "assistant" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center px-0")}
              onClick={() => setActiveView("assistant")}
              title="Assistant"
            >
              <Bot className="h-4 w-4" />
              {!sidebarCollapsed && <span>Assistant</span>}
            </Button>
          </nav>

          <div className={cn("mt-auto border-t pt-2 p-2", sidebarCollapsed && "flex justify-center")}>
            {!sidebarCollapsed ? (
              <UserProfile />
            ) : (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <UserProfile/>
              </div>
            )}
          </div>
        </aside>
        <main className="overflow-auto h-screen">
          {activeView === "dashboard" && (
            <div className="p-6">
               <div className="absolute top-4 right-6 z-10">
                <NotificationPanel />
              </div>
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">Home</h1>
                  <div className="text-sm text-muted-foreground">Track and manage your credit card rewards</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <MetricsCard
                  title="Total Points"
                  value={totalPoints.toLocaleString()}
                  icon={<Gift className="h-4 w-4 text-primary" />}
                />
                <MetricsCard
                  title="Cash Value"
                  value={`${totalCashValue.toLocaleString(undefined, {
                    style: "currency",
                    currency: baseValueCurrency,
                    maximumFractionDigits: 0,
                  })}`}
                  icon={<Tag className="h-4 w-4 text-primary" />}
                />
                <MetricsCard
                  title="Annual Fees"
                  value={`${totalAnnualFees.toLocaleString(undefined, {
                    style: "currency",
                    currency: baseValueCurrency,
                    maximumFractionDigits: 0,
                  })}`}
                  icon={<CreditCard className="h-4 w-4 text-primary" />}
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
                <StatsChart cardId={selectedCard?.id} />
              </Card>
            </div>
          )}

          {activeView === "cards" && (
            <Card className="p-6">
              <MyCardsView onAddCard={() => setShowAddModal(true)} />
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

      <AddEditCardModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleAddCard}
        addCardAction={addCard}
        isAddingCardAction={isAddingCard}
        addCardErrorAction={addCardError}
      />
    </div>
  )
}
