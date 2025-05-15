"use client"

import { useMemo } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { format, subMonths, parseISO } from "date-fns"
import type { Card } from "@/lib/types"

interface SpendingTrendsChartProps {
  cards: Card[]
}

export function SpendingTrendsChart({ cards }: SpendingTrendsChartProps) {
  // Generate sample data for the past 6 months
  const data = useMemo(() => {
    const months = 6
    const now = new Date()

    return Array.from({ length: months }).map((_, i) => {
      const date = subMonths(now, months - 1 - i)
      const month = format(date, "MMM")

      // Calculate spending for each category
      const categorySpending: Record<string, number> = {}

      cards.forEach((card) => {
        card.transactions?.forEach((transaction) => {
          const transactionDate = parseISO(transaction.date)
          const transactionMonth = format(transactionDate, "MMM")

          if (transactionMonth === month) {
            if (categorySpending[transaction.category]) {
              categorySpending[transaction.category] += transaction.amount
            } else {
              categorySpending[transaction.category] = transaction.amount
            }
          }
        })
      })

      return {
        month,
        ...categorySpending,
      }
    })
  }, [cards])

  // Extract all unique categories
  const categories = useMemo(() => {
    const allCategories = new Set<string>()

    cards.forEach((card) => {
      card.transactions?.forEach((transaction) => {
        allCategories.add(transaction.category)
      })
    })

    return Array.from(allCategories)
  }, [cards])

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-md border border-gray-700 shadow-lg">
          <p className="font-medium text-gray-300 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-300">{entry.name}: </span>
              <span className="ml-1 font-medium text-white">${entry.value?.toLocaleString()}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-300">Total:</span>
              <span className="font-medium text-white">
                ${payload.reduce((sum, entry) => sum + ((entry.value as number) || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const colors = [
    "#10b981", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
  ]

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold mb-4">Spending Trends by Category</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
          <Tooltip content={<CustomTooltip />} />
          {categories.map((category, index) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stackId="1"
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
