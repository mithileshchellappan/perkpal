"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Utensils, Plane, Home, Car, ChevronLeft, ChevronRight, Info, Loader2 } from "lucide-react"
import { EcommerceRewardsView } from "./ecommerce-rewards-view"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import type { CardStatementAnalysisResponse } from "@/types/cards"

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

// Helper function to get an icon for a category
function getCategoryIcon(category: string): React.ReactNode {
  const categoryLower = category.toLowerCase()
  if (categoryLower.includes('dining')) return <Utensils className="h-4 w-4" />
  if (categoryLower.includes('travel')) return <Plane className="h-4 w-4" />
  if (categoryLower.includes('shopping')) return <ShoppingBag className="h-4 w-4" />
  if (categoryLower.includes('groceries')) return <Home className="h-4 w-4" />
  if (categoryLower.includes('fuel') || categoryLower.includes('gas')) return <Car className="h-4 w-4" />

  // Default icon
  return <ShoppingBag className="h-4 w-4" />
}

// Function to get a color for a category
function getCategoryColor(category: string, index: number): string {
  const colors = [
    "#2563eb", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f97316", // orange
    "#14b8a6", // teal
    "#84cc16", // lime
    "#4ade80", // green
  ]

  // Generate color based on category name for consistency
  const categoryLower = category.toLowerCase()
  const categoryColors: Record<string, string> = {
    dining: "#f97316",
    travel: "#2563eb",
    shopping: "#ec4899",
    groceries: "#84cc16",
    utilities: "#8b5cf6",
    fuel: "#14b8a6",
    entertainment: "#8b5cf6",
    other: "#6b7280",
  }

  return categoryColors[categoryLower] || colors[index % colors.length]
}

export function RewardsView() {
  const { userId, isSignedIn } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [availableMonths, setAvailableMonths] = useState<string[]>([])
  const [rewardCategories, setRewardCategories] = useState<RewardCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [analysesByMonth, setAnalysesByMonth] = useState<Record<string, CardStatementAnalysisResponse[]>>({})

  // Fetch statement analyses when component mounts
  useEffect(() => {
    if (!isSignedIn || !userId) return

    async function fetchStatementAnalyses() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/statement-analysis?userId=${userId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch statement analyses')
        }

        const data = await response.json()

        if (data.success && data.analyses && data.analyses.length > 0) {
          // Group analyses by statement period
          const groupedAnalyses: Record<string, CardStatementAnalysisResponse[]> = {}

          data.analyses.forEach((analysis: CardStatementAnalysisResponse) => {
            if (!groupedAnalyses[analysis.statementPeriod]) {
              groupedAnalyses[analysis.statementPeriod] = []
            }
            groupedAnalyses[analysis.statementPeriod].push(analysis)
          })

          setAnalysesByMonth(groupedAnalyses)

          // Set available months from the analyses
          const periods = Object.keys(groupedAnalyses)
          setAvailableMonths(periods)

          // Set the most recent month as selected
          if (periods.length > 0) {
            setSelectedMonth(periods[0])
          }
        } else {
          setAvailableMonths([])
          setRewardCategories([])
        }
      } catch (error) {
        console.error('Error fetching statement analyses:', error)
        toast.error('Failed to load rewards data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatementAnalyses()
  }, [userId, isSignedIn])

  // Update reward categories when selected month changes
  useEffect(() => {
    if (!selectedMonth || !analysesByMonth[selectedMonth]) {
      setRewardCategories([])
      return
    }

    const analyses = analysesByMonth[selectedMonth]

    // Convert analyses to reward categories format
    const categoryMap = new Map<string, RewardCategory>()

    analyses.forEach(analysis => {
      analysis.categories.forEach(category => {
        const categoryName = category.category
        const categoryKey = categoryName.toLowerCase()

        if (!categoryMap.has(categoryKey)) {
          categoryMap.set(categoryKey, {
            name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
            icon: getCategoryIcon(categoryName),
            earned: 0,
            potential: 0,
            color: getCategoryColor(categoryName, 0),
            cards: []
          })
        }

        const existing = categoryMap.get(categoryKey)!
        existing.earned += category.points_earned
        existing.potential += category.potential_points

        // Add card info
        existing.cards.push({
          name: analysis.cardName,
          issuer: analysis.issuingBank,
          points: category.points_earned
        })
      })
    })

    setRewardCategories(Array.from(categoryMap.values()))
  }, [selectedMonth, analysesByMonth])

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
              disabled={!selectedMonth || selectedMonth === availableMonths[0] || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={isLoading || availableMonths.length === 0}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
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
              disabled={!selectedMonth || selectedMonth === availableMonths[availableMonths.length - 1] || isLoading}
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
        ) : availableMonths.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <Info className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Reward Data Available</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Upload your statement PDFs to see your rewards performance.
              </p>
              <Button variant="outline" asChild>
                <a href="/statement-upload">Upload a Statement</a>
              </Button>
            </div>
          </Card>
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
                        {category.potential ? Math.round((category.earned / category.potential) * 100) : 0}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${category.potential ? (category.earned / category.potential) * 100 : 0}%`,
                            background: category.color
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{category.earned ?? 0} pts earned</span>
                        <span className="text-muted-foreground">
                          {category.potential ?? 0} pts potential
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
                      {(() => {
                        const earned = rewardCategories.reduce((sum, cat) => sum + cat.earned, 0);
                        const potential = rewardCategories.reduce((sum, cat) => sum + cat.potential, 0);
                        
                        // Check if potential is zero or the calculation would result in NaN/Infinite
                        if (!potential || isNaN(earned / potential)) {
                          return '0%';
                        }
                        
                        return `${Math.round((earned / potential) * 100)}%`;
                      })()}
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
