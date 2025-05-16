"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"
import { generateColorFromString } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CardNetworkLogo } from "@/components/card-network-logo"

// Sample card recommendations
const cardRecommendations = [
  {
    id: "1",
    name: "Sapphire Reserve",
    issuer: "Chase",
    annualFee: 550,
    rewardsRate: 3,
    signupBonus: "60,000 points after spending $4,000 in 3 months",
    network: "visa",
    benefits: [
      "3x points on travel and dining",
      "$300 annual travel credit",
      "50% more value when redeeming for travel",
      "Priority Pass lounge access",
    ],
  },
  {
    id: "2",
    name: "Platinum Card",
    issuer: "American Express",
    annualFee: 695,
    rewardsRate: 5,
    signupBonus: "100,000 points after spending $6,000 in 6 months",
    network: "amex",
    benefits: [
      "5x points on flights and hotels",
      "$200 airline fee credit",
      "$200 hotel credit",
      "Global lounge access",
      "Uber credits",
    ],
  },
  {
    id: "3",
    name: "Venture X",
    issuer: "Capital One",
    annualFee: 395,
    rewardsRate: 2,
    signupBonus: "75,000 miles after spending $4,000 in 3 months",
    network: "visa",
    benefits: [
      "10x miles on hotels and rental cars",
      "5x miles on flights",
      "2x miles on everything else",
      "$300 annual travel credit",
      "Priority Pass and Capital One lounge access",
    ],
  },
  {
    id: "4",
    name: "Freedom Flex",
    issuer: "Chase",
    annualFee: 0,
    rewardsRate: 5,
    signupBonus: "$200 cash back after spending $500 in 3 months",
    network: "mastercard",
    benefits: [
      "5% cash back on rotating quarterly categories",
      "3% cash back on dining and drugstores",
      "1% cash back on everything else",
      "0% intro APR for 15 months",
    ],
  },
]

function adjustColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        ("0" + Math.min(255, Math.max(0, Number.parseInt(color, 16) + amount)).toString(16)).substr(-2),
      )
  )
}

export function NewCardView() {
  const [cardType, setCardType] = useState("")
  const [spendingCategory, setSpendingCategory] = useState("")
  const [additionalPreference, setAdditionalPreference] = useState("")
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFindCards = () => {
    if (cardType && spendingCategory) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setShowRecommendations(true)
        setIsLoading(false)
      }, 1500)
    }
  }

  const filteredCards = cardRecommendations

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Search className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">Find Your Next Card</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Card Preferences</CardTitle>
            <CardDescription>Tell us what you're looking for in a new card</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-cards">Current Cards</Label>
              <Input id="current-cards" value="Chase Sapphire Preferred, Amex Gold" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value="United States" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-type">Desired Card Type</Label>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger id="card-type">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Travel Rewards</SelectItem>
                  <SelectItem value="cashback">Cash Back</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="secured">Secured</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="spending-category">Primary Spending Category</Label>
              <Select value={spendingCategory} onValueChange={setSpendingCategory}>
                <SelectTrigger id="spending-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="online-shopping">Online Shopping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional-preference">Additional Preference</Label>
              <Input
                id="additional-preference"
                placeholder="e.g., low annual fee, airport lounges, etc."
                value={additionalPreference}
                onChange={(e) => setAdditionalPreference(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFindCards} disabled={!cardType || !spendingCategory || isLoading} className="w-full">
              {isLoading ? "Finding Cards..." : "Find Cards"}
            </Button>
          </CardFooter>
        </Card>

        <div>
          {!showRecommendations && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Search className="h-16 w-16 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-2">Find Your Perfect Card</h2>
              <p className="text-muted-foreground max-w-md">
                Select your preferences and click "Find Cards" to see personalized recommendations.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-[300px] rounded-xl" />
                <Skeleton className="h-[300px] rounded-xl" />
                <Skeleton className="h-[300px] rounded-xl" />
                <Skeleton className="h-[300px] rounded-xl" />
              </div>
            </div>
          )}

          {showRecommendations && !isLoading && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Recommended Cards</h2>
                <p className="text-muted-foreground">
                  Based on your {cardType} preference and {spendingCategory} spending
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {filteredCards.map((card) => {
                  const baseColor = generateColorFromString(`${card.name}-${card.issuer}`)
                  const secondaryColor = adjustColor(baseColor, 5)
                  const accentColor = adjustColor(baseColor, -8)

                  return (
                    <div key={card.id} className="mb-4">
                      <Card className="overflow-hidden">
                        <div
                          className="h-32 relative"
                          style={{
                            background: `linear-gradient(135deg, ${baseColor} 0%, ${secondaryColor} 100%)`,
                            boxShadow: `inset 0 0 60px rgba(0, 0, 0, 0.3)`,
                          }}
                        >
                          {/* Add subtle pattern overlay */}
                          <div
                            className="absolute inset-0 opacity-10 mix-blend-overlay"
                            style={{
                              backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor} 1px, transparent 1px)`,
                              backgroundSize: "20px 20px",
                            }}
                          />

                          {/* Add subtle highlight */}
                          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/10 to-transparent" />

                          <div className="absolute top-2 right-2">
                            <CardNetworkLogo network={card.network || "other"} className="h-8 w-12" />
                          </div>
                          <div className="absolute bottom-2 left-4">
                            <h3 className="font-bold text-white">{card.name}</h3>
                            <p className="text-sm text-white/80">{card.issuer}</p>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Annual Fee</p>
                              <p className="font-medium">{card.annualFee ? `$${card.annualFee}` : "No Fee"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Welcome Bonus</p>
                              <p className="font-medium">
                                {card.signupBonus ? `${card.signupBonus.toLocaleString()} pts` : "None"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">APR</p>
                              <p className="font-medium">N/A</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Foreign Transaction</p>
                              <p className="font-medium">None</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground">Top Categories</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {card.benefits?.slice(0, 3).map((category) => (
                                <Badge key={category} variant="outline">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button className="w-full mt-4" variant="outline">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
