"use client"

import { useState } from "react"
import { CreditCardCarousel } from "./credit-card-carousel"
import { DashboardHeader } from "./dashboard-header"
import { DashboardSidebar } from "./dashboard-sidebar"
import { InventoryDetails } from "./inventory-details"
import { FinancialMetrics } from "./financial-metrics"
import { TransactionsSection } from "./transactions-section"
import { CardDetails } from "./card-details"
import { AddCardModal } from "./add-card-modal"
import { ChatView } from "./chat/chat-view"
import { ChartPage } from "./charts/chart-page"
import type { Card } from "@/lib/types"

export function CreditCardDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [cards, setCards] = useState<Card[]>([
    {
      id: "1",
      name: "Shopping Card",
      number: "•••• •••• 3040",
      expiry: "08/25",
      type: "VISA",
      color: "bg-purple-200",
      points: 15000,
      value: 15000,
      transactions: [
        { date: "2023-01-15", amount: 120, category: "Shopping", points: 240 },
        { date: "2023-02-10", amount: 85, category: "Dining", points: 170 },
        { date: "2023-03-05", amount: 200, category: "Travel", points: 600 },
      ],
    },
    {
      id: "2",
      name: "Transfer Card",
      number: "•••• •••• 2050",
      expiry: "06/15",
      type: "VISA",
      color: "bg-amber-200",
      points: 20200,
      value: 20200,
      transactions: [
        { date: "2023-01-20", amount: 150, category: "Groceries", points: 300 },
        { date: "2023-02-15", amount: 95, category: "Gas", points: 190 },
        { date: "2023-03-10", amount: 250, category: "Entertainment", points: 500 },
      ],
    },
    {
      id: "3",
      name: "Rewards Card",
      number: "•••• •••• 4080",
      expiry: "02/27",
      type: "MASTERCARD",
      color: "bg-green-200",
      points: 35000,
      value: 35000,
      transactions: [
        { date: "2023-01-25", amount: 180, category: "Travel", points: 540 },
        { date: "2023-02-20", amount: 110, category: "Dining", points: 330 },
        { date: "2023-03-15", amount: 300, category: "Shopping", points: 600 },
      ],
    },
    {
      id: "4",
      name: "Travel Card",
      number: "•••• •••• 7890",
      expiry: "11/26",
      type: "VISA",
      color: "bg-blue-200",
      points: 42500,
      value: 42500,
      transactions: [
        { date: "2023-01-30", amount: 500, category: "Travel", points: 1500 },
        { date: "2023-02-25", amount: 120, category: "Dining", points: 360 },
        { date: "2023-03-20", amount: 200, category: "Entertainment", points: 400 },
      ],
    },
  ])

  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)

  const totalValue = cards.reduce((sum, card) => sum + card.value, 0)
  const totalPoints = cards.reduce((sum, card) => sum + card.points, 0)

  const renderMainContent = () => {
    switch (activeView) {
      case "chat":
        return <ChatView cards={cards} />
      case "charts":
        return <ChartPage cards={cards} />
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InventoryDetails totalValue={totalValue} cardCount={cards.length} />
                <FinancialMetrics />
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Points & Rewards Trends</h2>
                <ChartPage cards={cards} />
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                <TransactionsSection />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Your Cards</h2>
                <CreditCardCarousel
                  cards={cards}
                  onSelectCard={setSelectedCard}
                  onAddCard={() => {}}
                  onDeleteCard={() => {}}
                />
              </div>
              <CardDetails
                card={selectedCard}
                onClose={() => setSelectedCard(null)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar activeView={activeView} onChangeView={setActiveView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-900 text-white p-6">
          <DashboardHeader />
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 bg-gray-900 text-white">{renderMainContent()}</div>
        </div>
      </div>

      {isAddCardModalOpen && (
        <AddCardModal
          onClose={() => setIsAddCardModalOpen(false)}
          onAdd={() => {}}
          existingIds={cards.map((card) => card.id)}
        />
      )}
    </div>
  )
}
