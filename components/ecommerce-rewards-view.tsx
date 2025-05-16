"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Info, ExternalLink } from "lucide-react"

// E-commerce rewards data
const ecommerceRewardsData = {
  country: "India",
  recommendations: [
    {
      ecomm_partner_name: "Amazon India",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia offers a high base reward rate on all online spends, including Amazon purchases.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Check for limited-time bank offers during sales for extra discounts or cashback.",
    },
    {
      ecomm_partner_name: "Flipkart",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Flipkart_logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's high base reward rate applies to Flipkart purchases.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Look for special HDFC bank offers during Flipkart Big Billion Days and other sales.",
    },
    {
      ecomm_partner_name: "Myntra",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Myntra_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia provides the best reward rate for fashion purchases on Myntra.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Check for Myntra-specific bank offers during End of Reason Sale.",
    },
    {
      ecomm_partner_name: "Nykaa",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Nykaa_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate is superior for beauty and wellness purchases.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Look for HDFC bank offers during Nykaa Pink Friday and Hot Pink sales.",
    },
    {
      ecomm_partner_name: "MakeMyTrip",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/MakeMyTrip_Logo.png",
      cards_to_use: [
        {
          cardName: "Atlas",
          issuingBank: "Axis",
          rewardPoints: "2 EDGE Miles per ₹100 on OTA spends",
          reasoning: "Atlas offers 2 EDGE Miles per ₹100 on OTA bookings like MakeMyTrip.",
          source: "https://cardmaven.in/axis-bank-atlas-credit-card/",
        },
      ],
      additional_notes:
        "Direct airline/hotel bookings earn higher rewards, but for OTAs, Atlas is best among your cards.",
    },
    {
      ecomm_partner_name: "Swiggy",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate applies to food delivery platforms.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Check for HDFC or Axis bank offers on Swiggy for extra discounts.",
    },
    {
      ecomm_partner_name: "Zomato",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia provides the highest reward rate for Zomato orders.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Look for limited-time bank offers for additional savings.",
    },
    {
      ecomm_partner_name: "BigBasket",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/BigBasket_logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate is best for grocery platforms like BigBasket.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Check for HDFC or Axis bank offers during BigBasket sales.",
    },
    {
      ecomm_partner_name: "JioMart",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/JioMart_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia offers the highest reward rate for JioMart purchases.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Look for special bank offers during JioMart sales.",
    },
    {
      ecomm_partner_name: "Tata CLiQ",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Tata_Cliq_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate is best for Tata CLiQ purchases.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Check for Tata CLiQ-specific bank offers during sales.",
    },
    {
      ecomm_partner_name: "AJIO",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/AJIO_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia provides the best reward rate for fashion platforms like AJIO.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Look for HDFC or Axis bank offers during AJIO sales.",
    },
    {
      ecomm_partner_name: "BookMyShow",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/BookMyShow_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate applies to entertainment spends.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Check for HDFC or Axis bank offers for movie ticket discounts.",
    },
    {
      ecomm_partner_name: "Goibibo",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Goibibo_Logo.png",
      cards_to_use: [
        {
          cardName: "Atlas",
          issuingBank: "Axis",
          rewardPoints: "2 EDGE Miles per ₹100 on OTA spends",
          reasoning: "Atlas offers 2 EDGE Miles per ₹100 on OTA bookings like Goibibo.",
          source: "https://cardmaven.in/axis-bank-atlas-credit-card/",
        },
      ],
      additional_notes:
        "Direct airline/hotel bookings earn higher rewards, but for OTAs, Atlas is best among your cards.",
    },
    {
      ecomm_partner_name: "Cleartrip",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Cleartrip_Logo.png",
      cards_to_use: [
        {
          cardName: "Atlas",
          issuingBank: "Axis",
          rewardPoints: "2 EDGE Miles per ₹100 on OTA spends",
          reasoning: "Atlas offers 2 EDGE Miles per ₹100 on OTA bookings like Cleartrip.",
          source: "https://cardmaven.in/axis-bank-atlas-credit-card/",
        },
      ],
      additional_notes:
        "Direct airline/hotel bookings earn higher rewards, but for OTAs, Atlas is best among your cards.",
    },
    {
      ecomm_partner_name: "Pepperfry",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Pepperfry_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate is best for furniture and home decor platforms.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Check for HDFC or Axis bank offers during Pepperfry sales.",
    },
    {
      ecomm_partner_name: "Urban Company",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Urban_Company_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate applies to service platforms like Urban Company.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Check for HDFC or Axis bank offers for extra discounts.",
    },
    {
      ecomm_partner_name: "Netmeds",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Netmeds_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate is best for online pharmacy purchases.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Look for HDFC or Axis bank offers during Netmeds sales.",
    },
    {
      ecomm_partner_name: "Pharmeasy",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Pharmeasy_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate is best for online pharmacy purchases.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Look for HDFC or Axis bank offers during Pharmeasy sales.",
    },
    {
      ecomm_partner_name: "Lenskart",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Lenskart_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate is best for eyewear purchases.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Look for HDFC or Axis bank offers during Lenskart sales.",
    },
    {
      ecomm_partner_name: "FirstCry",
      ecomm_partner_logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/FirstCry_Logo.png",
      cards_to_use: [
        {
          cardName: "Infinia",
          issuingBank: "HDFC",
          rewardPoints: "3.3% reward rate (5 Reward Points per ₹150) on all spends",
          reasoning: "Infinia's base reward rate is best for baby and kids' products.",
          source: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition",
        },
      ],
      additional_notes: "Look for HDFC or Axis bank offers during FirstCry sales.",
    },
  ],
  overall_summary:
    "For most e-commerce platforms in India, the HDFC Infinia card offers the highest base reward rate among your cards. For travel bookings via OTAs like MakeMyTrip, Goibibo, and Cleartrip, the Axis Atlas card is preferable due to its EDGE Miles accrual. Always check for limited-time bank offers during major sales for additional savings.",
}

// Types for the data
interface CardToUse {
  cardName: string
  issuingBank: string
  rewardPoints: string
  reasoning: string
  source: string
}

interface EcommerceRecommendation {
  ecomm_partner_name: string
  ecomm_partner_logo_url: string
  cards_to_use: CardToUse[]
  additional_notes: string
}

interface EcommerceRewardsData {
  country: string
  recommendations: EcommerceRecommendation[]
  overall_summary: string
}

export function EcommerceRewardsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  // Get unique card names for filtering
  const uniqueCards = Array.from(
    new Set(
      ecommerceRewardsData.recommendations
        .flatMap((rec) => rec.cards_to_use)
        .map((card) => `${card.issuingBank} ${card.cardName}`),
    ),
  )

  // Filter recommendations based on search term and selected card
  const filteredRecommendations = ecommerceRewardsData.recommendations.filter((rec) => {
    const matchesSearch = rec.ecomm_partner_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCard = selectedCard
      ? rec.cards_to_use.some((card) => `${card.issuingBank} ${card.cardName}` === selectedCard)
      : true
    return matchesSearch && matchesCard
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">E-commerce Rewards</h2>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Maximize Your Rewards</CardTitle>
          <CardDescription>
            Find the best card to use for each e-commerce platform in {ecommerceRewardsData.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search platforms..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                value={selectedCard || ""}
                onChange={(e) => setSelectedCard(e.target.value || null)}
              >
                <option value="">All Cards</option>
                {uniqueCards.map((card) => (
                  <option key={card} value={card}>
                    {card}
                  </option>
                ))}
              </select>
            </div>

            <Card className="bg-muted/50 p-4">
              <div className="flex gap-2 items-start">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">{ecommerceRewardsData.overall_summary}</p>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <Badge variant="outline">
            {filteredRecommendations.length} of {ecommerceRewardsData.recommendations.length} platforms
          </Badge>
        </div>

        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.ecomm_partner_name} className="overflow-hidden">
                <div className="h-16 flex items-center justify-center bg-background border-b p-2">
                  <div className="relative h-full w-full max-w-[120px]">
                    <img
                      src={recommendation.ecomm_partner_logo_url || "/placeholder.svg"}
                      alt={recommendation.ecomm_partner_name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{recommendation.ecomm_partner_name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {recommendation.cards_to_use.map((card) => (
                    <div key={`${card.issuingBank}-${card.cardName}`} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-primary/10">
                          {card.issuingBank} {card.cardName}
                        </Badge>
                        <a
                          href={card.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          Source <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-sm font-medium">{card.rewardPoints}</p>
                      <p className="text-xs text-muted-foreground">{card.reasoning}</p>
                    </div>
                  ))}
                  <div className="pt-2 text-xs bg-muted/30 p-2 rounded-md">
                    <p className="font-medium mb-1">Additional Notes:</p>
                    <p>{recommendation.additional_notes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation) => (
                <Card key={recommendation.ecomm_partner_name}>
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-24 md:h-auto flex items-center justify-center p-4 bg-background border-b md:border-b-0 md:border-r">
                      <div className="relative h-full w-full max-w-[120px]">
                        <img
                          src={recommendation.ecomm_partner_logo_url || "/placeholder.svg"}
                          alt={recommendation.ecomm_partner_name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="text-lg font-semibold mb-2">{recommendation.ecomm_partner_name}</h3>
                      <div className="space-y-4">
                        {recommendation.cards_to_use.map((card) => (
                          <div key={`${card.issuingBank}-${card.cardName}`} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="bg-primary/10">
                                {card.issuingBank} {card.cardName}
                              </Badge>
                              <a
                                href={card.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                              >
                                Source <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            <p className="text-sm font-medium">{card.rewardPoints}</p>
                            <p className="text-sm text-muted-foreground">{card.reasoning}</p>
                          </div>
                        ))}
                        <div className="pt-2 text-sm bg-muted/30 p-3 rounded-md">
                          <p className="font-medium mb-1">Additional Notes:</p>
                          <p>{recommendation.additional_notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
