"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"
import type { Card } from "@/lib/types"

interface CardComparisonChartProps {
  cards: Card[]
}

export function CardComparisonChart({ cards }: CardComparisonChartProps) {
  // Transform card data for the chart
  const data = useMemo(() => {
    return cards.map((card) => ({
      name: card.name,
      points: card.points,
      value: card.value,
      pointsPerDollar: card.value / card.points,
    }))
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
              <span className="ml-1 font-medium text-white">
                {entry.dataKey === "points"
                  ? `${entry.value?.toLocaleString()} pts`
                  : `$${entry.value?.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold mb-4">Card Comparison</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
          <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="points" name="Points" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="value" name="Value ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
