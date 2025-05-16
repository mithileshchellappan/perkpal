"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Utensils, Plane, Home, Car, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { EcommerceRewardsView } from "./ecommerce-rewards-view"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"

interface RewardCategory {
  name: string
  icon: React.ReactNode
  earned: number
  potential: number
  color: string
  cards: {
    name: string
    issuer: string
    points: number
  }[]
}

// Monthly data for rewards
const monthlyRewardsData: Record<string, RewardCategory[]> = {
  "January 2025": [
    {
      name: "Dining",
      icon: <Utensils className="h-4 w-4" />,
      earned: 10250,
      potential: 12000,
      color: "#ff6b00",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 5200 },
        { name: "Gold Card", issuer: "American Express", points: 3850 },
        { name: "Venture X", issuer: "Capital One", points: 1200 },
      ],
    },
    {
      name: "Travel",
      icon: <Plane className="h-4 w-4" />,
      earned: 18680,
      potential: 22000,
      color: "#0f4c81",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 8500 },
        { name: "Venture X", issuer: "Capital One", points: 7180 },
        { name: "Gold Card", issuer: "American Express", points: 3000 },
      ],
    },
    {
      name: "Shopping",
      icon: <ShoppingBag className="h-4 w-4" />,
      earned: 7250,
      potential: 9000,
      color: "#2e7d32",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 3500 },
        { name: "Gold Card", issuer: "American Express", points: 2250 },
        { name: "Venture X", issuer: "Capital One", points: 1500 },
      ],
    },
    {
      name: "Groceries",
      icon: <Home className="h-4 w-4" />,
      earned: 4320,
      potential: 6500,
      color: "#c99c00",
      cards: [
        { name: "Gold Card", issuer: "American Express", points: 2800 },
        { name: "Freedom Unlimited", issuer: "Chase", points: 1520 },
      ],
    },
    {
      name: "Gas",
      icon: <Car className="h-4 w-4" />,
      earned: 2800,
      potential: 4000,
      color: "#9c27b0",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 1500 },
        { name: "Venture X", issuer: "Capital One", points: 1300 },
      ],
    },
  ],
  "February 2025": [
    {
      name: "Dining",
      icon: <Utensils className="h-4 w-4" />,
      earned: 11450,
      potential: 13000,
      color: "#ff6b00",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 5800 },
        { name: "Gold Card", issuer: "American Express", points: 4250 },
        { name: "Venture X", issuer: "Capital One", points: 1400 },
      ],
    },
    {
      name: "Travel",
      icon: <Plane className="h-4 w-4" />,
      earned: 21680,
      potential: 25000,
      color: "#0f4c81",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 9500 },
        { name: "Venture X", issuer: "Capital One", points: 8180 },
        { name: "Gold Card", issuer: "American Express", points: 4000 },
      ],
    },
    {
      name: "Shopping",
      icon: <ShoppingBag className="h-4 w-4" />,
      earned: 6750,
      potential: 8500,
      color: "#2e7d32",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 3200 },
        { name: "Gold Card", issuer: "American Express", points: 2050 },
        { name: "Venture X", issuer: "Capital One", points: 1500 },
      ],
    },
    {
      name: "Groceries",
      icon: <Home className="h-4 w-4" />,
      earned: 4820,
      potential: 6800,
      color: "#c99c00",
      cards: [
        { name: "Gold Card", issuer: "American Express", points: 3100 },
        { name: "Freedom Unlimited", issuer: "Chase", points: 1720 },
      ],
    },
    {
      name: "Gas",
      icon: <Car className="h-4 w-4" />,
      earned: 3100,
      potential: 4500,
      color: "#9c27b0",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 1700 },
        { name: "Venture X", issuer: "Capital One", points: 1400 },
      ],
    },
  ],
  "March 2025": [
    {
      name: "Dining",
      icon: <Utensils className="h-4 w-4" />,
      earned: 12450,
      potential: 15000,
      color: "#ff6b00",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 6200 },
        { name: "Gold Card", issuer: "American Express", points: 4850 },
        { name: "Venture X", issuer: "Capital One", points: 1400 },
      ],
    },
    {
      name: "Travel",
      icon: <Plane className="h-4 w-4" />,
      earned: 24680,
      potential: 30000,
      color: "#0f4c81",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 10500 },
        { name: "Venture X", issuer: "Capital One", points: 9180 },
        { name: "Gold Card", issuer: "American Express", points: 5000 },
      ],
    },
    {
      name: "Shopping",
      icon: <ShoppingBag className="h-4 w-4" />,
      earned: 8750,
      potential: 10000,
      color: "#2e7d32",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 4500 },
        { name: "Gold Card", issuer: "American Express", points: 2750 },
        { name: "Venture X", issuer: "Capital One", points: 1500 },
      ],
    },
    {
      name: "Groceries",
      icon: <Home className="h-4 w-4" />,
      earned: 5320,
      potential: 7500,
      color: "#c99c00",
      cards: [
        { name: "Gold Card", issuer: "American Express", points: 3500 },
        { name: "Freedom Unlimited", issuer: "Chase", points: 1820 },
      ],
    },
    {
      name: "Gas",
      icon: <Car className="h-4 w-4" />,
      earned: 3200,
      potential: 5000,
      color: "#9c27b0",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 1800 },
        { name: "Venture X", issuer: "Capital One", points: 1400 },
      ],
    },
  ],
  "April 2025": [
    {
      name: "Dining",
      icon: <Utensils className="h-4 w-4" />,
      earned: 13250,
      potential: 16000,
      color: "#ff6b00",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 6800 },
        { name: "Gold Card", issuer: "American Express", points: 5050 },
        { name: "Venture X", issuer: "Capital One", points: 1400 },
      ],
    },
    {
      name: "Travel",
      icon: <Plane className="h-4 w-4" />,
      earned: 26780,
      potential: 32000,
      color: "#0f4c81",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 11500 },
        { name: "Venture X", issuer: "Capital One", points: 10280 },
        { name: "Gold Card", issuer: "American Express", points: 5000 },
      ],
    },
    {
      name: "Shopping",
      icon: <ShoppingBag className="h-4 w-4" />,
      earned: 9150,
      potential: 11000,
      color: "#2e7d32",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 4800 },
        { name: "Gold Card", issuer: "American Express", points: 2850 },
        { name: "Venture X", issuer: "Capital One", points: 1500 },
      ],
    },
    {
      name: "Groceries",
      icon: <Home className="h-4 w-4" />,
      earned: 5720,
      potential: 8000,
      color: "#c99c00",
      cards: [
        { name: "Gold Card", issuer: "American Express", points: 3800 },
        { name: "Freedom Unlimited", issuer: "Chase", points: 1920 },
      ],
    },
    {
      name: "Gas",
      icon: <Car className="h-4 w-4" />,
      earned: 3500,
      potential: 5200,
      color: "#9c27b0",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 2000 },
        { name: "Venture X", issuer: "Capital One", points: 1500 },
      ],
    },
  ],
  "May 2025": [
    {
      name: "Dining",
      icon: <Utensils className="h-4 w-4" />,
      earned: 12450,
      potential: 15000,
      color: "#ff6b00",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 6200 },
        { name: "Gold Card", issuer: "American Express", points: 4850 },
        { name: "Venture X", issuer: "Capital One", points: 1400 },
      ],
    },
    {
      name: "Travel",
      icon: <Plane className="h-4 w-4" />,
      earned: 24680,
      potential: 30000,
      color: "#0f4c81",
      cards: [
        { name: "Sapphire Preferred", issuer: "Chase", points: 10500 },
        { name: "Venture X", issuer: "Capital One", points: 9180 },
        { name: "Gold Card", issuer: "American Express", points: 5000 },
      ],
    },
    {
      name: "Shopping",
      icon: <ShoppingBag className="h-4 w-4" />,
      earned: 8750,
      potential: 10000,
      color: "#2e7d32",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 4500 },
        { name: "Gold Card", issuer: "American Express", points: 2750 },
        { name: "Venture X", issuer: "Capital One", points: 1500 },
      ],
    },
    {
      name: "Groceries",
      icon: <Home className="h-4 w-4" />,
      earned: 5320,
      potential: 7500,
      color: "#c99c00",
      cards: [
        { name: "Gold Card", issuer: "American Express", points: 3500 },
        { name: "Freedom Unlimited", issuer: "Chase", points: 1820 },
      ],
    },
    {
      name: "Gas",
      icon: <Car className="h-4 w-4" />,
      earned: 3200,
      potential: 5000,
      color: "#9c27b0",
      cards: [
        { name: "Freedom Unlimited", issuer: "Chase", points: 1800 },
        { name: "Venture X", issuer: "Capital One", points: 1400 },
      ],
    },
  ],
}

// Get available months
const availableMonths = Object.keys(monthlyRewardsData)

export function RewardsView() {
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[2]) // Default to March 2025
  const [rewardCategories, setRewardCategories] = useState<RewardCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)

    const timer = setTimeout(() => {
      setRewardCategories(monthlyRewardsData[selectedMonth])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [selectedMonth])

  const handlePreviousMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth)
    if (currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1])
    }
  }

  const handleNextMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth)
    if (currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1])
    }
  }

  return (
    <Tabs defaultValue="categories">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Rewards & Offers</h2>
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="categories" className="space-y-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              disabled={selectedMonth === availableMonths[0] || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={isLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              disabled={selectedMonth === availableMonths[availableMonths.length - 1] || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {isLoading ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-2 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {rewardCategories.map((category) => (
                <Card key={category.name}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full" style={{ backgroundColor: `${category.color}30` }}>
                          {category.icon}
                        </div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                              <Info className="h-3.5 w-3.5" />
                              <span className="sr-only">Category Details</span>
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Points by Card</h4>
                              <div className="space-y-1">
                                {category.cards.map((card, index) => (
                                  <div key={index} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium">{card.name}</span>
                                      <span className="text-xs text-muted-foreground">({card.issuer})</span>
                                    </div>
                                    <span>{card.points.toLocaleString()} pts</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((category.earned / category.potential) * 100)}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress
                        value={(category.earned / category.potential) * 100}
                        className="h-2"
                        indicatorClassName={`bg-[${category.color}]`}
                      />
                      <div className="flex justify-between text-sm">
                        <span>{category.earned.toLocaleString()} pts earned</span>
                        <span className="text-muted-foreground">
                          {category.potential.toLocaleString()} pts potential
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Rewards Summary - {selectedMonth}</CardTitle>
                <CardDescription>Your rewards earning performance for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Points Earned</span>
                    <span className="font-bold">
                      {rewardCategories.reduce((sum, cat) => sum + cat.earned, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Potential Points</span>
                    <span className="font-bold">
                      {rewardCategories.reduce((sum, cat) => sum + cat.potential, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Missed Opportunities</span>
                    <span className="font-bold text-amber-500">
                      {rewardCategories.reduce((sum, cat) => sum + (cat.potential - cat.earned), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Efficiency Rate</span>
                    <span className="font-bold">
                      {Math.round(
                        (rewardCategories.reduce((sum, cat) => sum + cat.earned, 0) /
                          rewardCategories.reduce((sum, cat) => sum + cat.potential, 0)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </TabsContent>

      <TabsContent value="ecommerce" className="space-y-4">
        <EcommerceRewardsView />
      </TabsContent>
    </Tabs>
  )
}
