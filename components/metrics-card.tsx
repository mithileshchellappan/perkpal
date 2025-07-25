import { Card } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import type React from "react"

interface MetricsCardProps {
  title: string
  value: string
  change?: {
    value: string
    percentage: string
    isPositive: boolean
  }
  chart?: React.ReactNode
  icon?: React.ReactNode
}

export function MetricsCard({ title, value, change, chart, icon }: MetricsCardProps) {
  return (
    <Card className="p-4 bg-background/50 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm text-muted-foreground">{title}</h3>
        </div>
        {chart ? <ArrowUpRight className="h-4 w-4 text-muted-foreground" /> : null}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm">
                {change.isPositive ? "+" : ""}
                {change.value}
              </span>
              <span className={`text-sm ${change.isPositive ? "text-green-500" : "text-red-500"}`}>
                {change.percentage}
              </span>
            </div>
          )}
        </div>
        {chart}
      </div>
    </Card>
  )
}
