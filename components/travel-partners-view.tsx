"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plane, Hotel, ArrowRight, Star, Info, Infinity } from "lucide-react"
import { CreditCardCarousel } from "@/components/credit-card-carousel"
import { Skeleton } from "@/components/ui/skeleton"
import type { CreditCardType } from "@/lib/types"

interface TravelPartner {
  id: string
  name: string
  type: "airline" | "hotel"
  transferRatio: string
  bonusMultiplier: number | null
  featuredPromo: string | null
  logo: string
}

interface LoungeAccess {
  domestic: number
  international: number
}

// Updated cards with lounge access information
const cardsWithLoungeAccess: Record<string, LoungeAccess> = {
  "Sapphire Preferred": { domestic: 0, international: 0 },
  "Gold Card": { domestic: 10, international: 2 },
  "Venture X": { domestic: -1, international: -1 }, // Infinite access
  "Freedom Unlimited": { domestic: 0, international: 0 },
  "Atlas Credit Card": { domestic: 8, international: 4 },
  "Infinia Credit Card": { domestic: -1, international: -1 }, // Infinite access
}

const travelPartners: TravelPartner[] = [
  {
    id: "1",
    name: "Delta SkyMiles",
    type: "airline",
    transferRatio: "1:1",
    bonusMultiplier: 1.3,
    featuredPromo: "30% transfer bonus until June 30",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "United MileagePlus",
    type: "airline",
    transferRatio: "1:1",
    bonusMultiplier: null,
    featuredPromo: null,
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Marriott Bonvoy",
    type: "hotel",
    transferRatio: "1:1.2",
    bonusMultiplier: 1.25,
    featuredPromo: "25% bonus on all transfers",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Hilton Honors",
    type: "hotel",
    transferRatio: "1:2",
    bonusMultiplier: null,
    featuredPromo: null,
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "American Airlines",
    type: "airline",
    transferRatio: "1:0.8",
    bonusMultiplier: null,
    featuredPromo: null,
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Hyatt",
    type: "hotel",
    transferRatio: "1:1",
    bonusMultiplier: 1.1,
    featuredPromo: "10% bonus on transfers over 10,000 points",
    logo: "/placeholder.svg?height=40&width=40",
  },
]

interface TravelPartnersViewProps {
  cards: CreditCardType[]
}

export function TravelPartnersView({ cards }: TravelPartnersViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "airline" | "hotel">("all")
  const [selectedCard, setSelectedCard] = useState<CreditCardType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filteredPartners, setFilteredPartners] = useState<TravelPartner[]>([])

  useEffect(() => {
    // Filter partners based on search term and type
    const filtered = travelPartners.filter((partner) => {
      const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || partner.type === filterType
      return matchesSearch && matchesType
    })

    setFilteredPartners(filtered)
  }, [searchTerm, filterType])

  // Helper function to format lounge access display
  const formatLoungeAccess = (count: number) => {
    if (count === -1) {
      return (
        <div className="flex items-center">
          <Infinity className="h-4 w-4 mr-1" />
          <span>Unlimited</span>
        </div>
      )
    }
    return count
  }

  const handleSelectCard = (card: CreditCardType) => {
    setIsLoading(true)
    // Simulate loading data
    setTimeout(() => {
      setSelectedCard(card)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Travel Partners</h2>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select a Card</CardTitle>
          <CardDescription>Choose a card to view available transfer partners</CardDescription>
        </CardHeader>
        <CardContent>
          <CreditCardCarousel
            cards={cards}
            onSelectCard={handleSelectCard}
            showAddButton={false}
            title="Your Cards"
            selectedCardId={selectedCard?.id}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <>
          <Card className="mb-4">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>

                <Skeleton className="h-10 w-full" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : selectedCard ? (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Lounge Access</CardTitle>
              <CardDescription>Available airport lounge access with your {selectedCard.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-2">Domestic Lounges</h3>
                    <div className="text-2xl font-bold">
                      {formatLoungeAccess(cardsWithLoungeAccess[selectedCard.name]?.domestic || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Visits per year</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-2">International Lounges</h3>
                    <div className="text-2xl font-bold">
                      {formatLoungeAccess(cardsWithLoungeAccess[selectedCard.name]?.international || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Visits per year</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Your Points</CardTitle>
              <CardDescription>
                Transfer your {selectedCard.name} points to these travel partners for maximum value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search partners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setFilterType("all")}
                    className={filterType === "all" ? "bg-primary/10" : ""}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFilterType("airline")}
                    className={filterType === "airline" ? "bg-primary/10" : ""}
                  >
                    <Plane className="h-4 w-4 mr-2" />
                    Airlines
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFilterType("hotel")}
                    className={filterType === "hotel" ? "bg-primary/10" : ""}
                  >
                    <Hotel className="h-4 w-4 mr-2" />
                    Hotels
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Transfer Ratio</TableHead>
                      <TableHead>Current Bonus</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img
                              src={partner.logo || "/placeholder.svg"}
                              alt={partner.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <div>
                              <div className="font-medium">{partner.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {partner.type === "airline" ? (
                              <Plane className="h-3 w-3 mr-1" />
                            ) : (
                              <Hotel className="h-3 w-3 mr-1" />
                            )}
                            {partner.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{partner.transferRatio}</TableCell>
                        <TableCell>
                          {partner.bonusMultiplier ? (
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                              {((partner.bonusMultiplier - 1) * 100).toFixed(0)}% Bonus
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" className="gap-1">
                            Transfer <ArrowRight className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Transfer Opportunities</CardTitle>
              <CardDescription>Limited-time offers with enhanced value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {travelPartners
                  .filter((partner) => partner.featuredPromo)
                  .map((partner) => (
                    <Card key={partner.id} className="border border-primary/20">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <img
                              src={partner.logo || "/placeholder.svg"}
                              alt={partner.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <CardTitle className="text-base">{partner.name}</CardTitle>
                          </div>
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm">{partner.featuredPromo}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Transfer ratio</span>
                            <span className="font-bold">
                              {partner.transferRatio}
                              {partner.bonusMultiplier && (
                                <span className="text-green-500">
                                  {" "}
                                  (+{((partner.bonusMultiplier - 1) * 100).toFixed(0)}%)
                                </span>
                              )}
                            </span>
                          </div>
                          <Button size="sm" className="w-full mt-2">
                            Transfer Points
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="p-6 text-center">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">Select a Card to View Transfer Partners</h3>
          <p className="text-muted-foreground">
            Choose a card from above to see available travel partners and transfer options.
          </p>
        </Card>
      )}
    </div>
  )
}
