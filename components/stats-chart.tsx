"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import { CardPointsEntry } from "@/types/points"

export function StatsChart({ cardId }: { cardId?: string }) {
  const [data, setData] = useState<{ date: string; value: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPointsHistory() {
      setIsLoading(true)
      setError(null)
      
      try {
        // Build query params
        const params = new URLSearchParams()
        if (cardId) {
          params.append('cardId', cardId)
        }
        
        // Get data for the past 12 months
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth() + 1 // 1-12
        
        let startDate = new Date()
        startDate.setFullYear(currentYear - 1)
        
        params.append('startYear', startDate.getFullYear().toString())
        params.append('startMonth', (startDate.getMonth() + 1).toString())
        params.append('endYear', currentYear.toString())
        params.append('endMonth', currentMonth.toString())
        
        const response = await fetch(`/api/card-points?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error(`Error fetching points history: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (!result.success || !result.data) {
          throw new Error('Failed to fetch points history')
        }
        
        // Transform data
        const formattedData = formatPointsData(result.data)
        setData(formattedData)
      } catch (err) {
        console.error('Error fetching points history:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        // Use empty array if fetch fails
        setData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPointsHistory()
  }, [cardId])
  
  // Format the data from the API into the format expected by the chart
  function formatPointsData(pointsEntries: CardPointsEntry[]): { date: string; value: number }[] {
    // If no data, return empty array
    if (!pointsEntries || pointsEntries.length === 0) {
      return []
    }
    
    // Map month numbers to abbreviations
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    // Convert the API data to the format needed for the chart
    return pointsEntries.map(entry => ({
      date: monthNames[entry.month - 1], // Convert 1-based month to 0-based array index
      value: entry.pointsBalance
    }))
  }

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading points history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Error loading points history: {error}</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No points history available</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Points</span>
                        <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                        <span className="font-bold">{payload[0].payload.date}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#ff6b00" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
