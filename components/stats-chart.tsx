"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { date: "Jan", value: 1200 },
  { date: "Feb", value: 1350 },
  { date: "Mar", value: 1500 },
  { date: "Apr", value: 1650 },
  { date: "May", value: 1800 },
  { date: "Jun", value: 2000 },
  { date: "Jul", value: 2200 },
  { date: "Aug", value: 2400 },
  { date: "Sep", value: 2600 },
  { date: "Oct", value: 2800 },
  { date: "Nov", value: 3000 },
  { date: "Dec", value: 3200 },
]

export function StatsChart() {
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
