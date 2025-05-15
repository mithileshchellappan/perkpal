"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { Card } from "@/lib/types"

interface CategoryDistributionChartProps {
  cards: Card[]
}

export function CategoryDistributionChart({ cards }: CategoryDistributionChartProps) {
  // Aggregate points by category across all cards
  const data = useMemo(() => {
    const categories: Record<string, number> = {}

    // Extract all unique categories from card transactions
    cards.forEach((card) => {
      card.transactions?.forEach((transaction) => {
        if (categories[transaction.category]) {
          categories[transaction.category] += transaction.points
        } else {
          categories[transaction.category] = transaction.points
        }
      })
    })

    // Convert to array format for the chart
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }))
  }, [cards])

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900 p-3 rounded-md border border-gray-700 shadow-lg">
          <p className="font-medium text-gray-300">{data.name}</p>
          <p className="text-white font-semibold">{data.value.toLocaleString()} points</p>
          <p className="text-gray-400 text-sm">{((data.value / data.total) * 100).toFixed(1)}% of total</p>
        </div>
      )
    }
    return null
  }

  // Calculate total for percentage
  const total = data.reduce((sum, entry) => sum + entry.value, 0)
  const dataWithTotal = data.map((item) => ({ ...item, total }))

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold mb-4">Points by Category</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
