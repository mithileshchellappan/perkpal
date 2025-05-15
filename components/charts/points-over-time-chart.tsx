"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"
import { format, subMonths } from "date-fns"
import type { Card } from "@/lib/types"

interface PointsOverTimeChartProps {
  cards: Card[]
}

export function PointsOverTimeChart({ cards }: PointsOverTimeChartProps) {
  // Generate sample data for the past 12 months
  const data = useMemo(() => {
    const months = 12
    const now = new Date()

    return Array.from({ length: months }).map((_, i) => {
      const date = subMonths(now, months - 1 - i)
      const month = format(date, "MMM")

      const result: Record<string, any> = { month }

      // Add random growth for each card
      cards.forEach((card) => {
        const basePoints = card.points / 2
        const growthFactor = 1 + (i / months) * 0.5 // Gradual growth
        const randomVariation = 0.9 + Math.random() * 0.2 // Random variation between 0.9 and 1.1

        result[card.name] = Math.round((basePoints * growthFactor * randomVariation) / months) * (i + 1)
      })

      return result
    })
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
              <span className="ml-1 font-medium text-white">{entry.value?.toLocaleString()} pts</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const colors = ["#8b5cf6", "#f59e0b", "#10b981", "#3b82f6"]

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold mb-4">Points Growth Over Time</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          {cards.map((card, index) => (
            <Line
              key={card.id}
              type="monotone"
              dataKey={card.name}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
