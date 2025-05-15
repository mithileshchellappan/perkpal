"use client"

import { useState } from "react"
import { PointsOverTimeChart } from "./points-over-time-chart"
import { CategoryDistributionChart } from "./category-distribution-chart"
import { CardComparisonChart } from "./card-comparison-chart"
import { SpendingTrendsChart } from "./spending-trends-chart"
import type { Card } from "@/lib/types"

interface ChartPageProps {
  cards: Card[]
}

export function ChartPage({ cards }: ChartPageProps) {
  const [activeChart, setActiveChart] = useState("points")

  const renderChart = () => {
    switch (activeChart) {
      case "points":
        return <PointsOverTimeChart cards={cards} />
      case "categories":
        return <CategoryDistributionChart cards={cards} />
      case "comparison":
        return <CardComparisonChart cards={cards} />
      case "spending":
        return <SpendingTrendsChart cards={cards} />
      default:
        return <PointsOverTimeChart cards={cards} />
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Credit Card Analytics</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveChart("points")}
            className={`px-4 py-2 rounded-lg ${
              activeChart === "points" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Points Over Time
          </button>
          <button
            onClick={() => setActiveChart("categories")}
            className={`px-4 py-2 rounded-lg ${
              activeChart === "categories" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Category Distribution
          </button>
          <button
            onClick={() => setActiveChart("comparison")}
            className={`px-4 py-2 rounded-lg ${
              activeChart === "comparison" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Card Comparison
          </button>
          <button
            onClick={() => setActiveChart("spending")}
            className={`px-4 py-2 rounded-lg ${
              activeChart === "spending" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Spending Trends
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="h-[500px]">{renderChart()}</div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-green-400 mb-2">Points Growth</h4>
            <p className="text-sm text-gray-300">
              Your points have increased by 15% in the last 3 months. Keep using your Travel Card for the best rewards.
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-green-400 mb-2">Spending Patterns</h4>
            <p className="text-sm text-gray-300">
              Most of your spending is in the Travel category. Consider using your Travel Card more to maximize points.
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-yellow-400 mb-2">Redemption Opportunity</h4>
            <p className="text-sm text-gray-300">
              You have enough points for a $500 travel credit. Consider redeeming before the end of the month.
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-blue-400 mb-2">Card Recommendation</h4>
            <p className="text-sm text-gray-300">
              Based on your spending, a Premium Dining card could earn you 20% more points annually.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
