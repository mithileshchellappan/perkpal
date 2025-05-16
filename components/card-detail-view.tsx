"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreditCard } from "@/components/credit-card-carousel"
import { CardNetworkLogo } from "@/components/card-network-logo"
import { Skeleton } from "@/components/ui/skeleton"
import type { CreditCardType } from "@/lib/types"
import { Award, DollarSign, Gift, Lightbulb, RefreshCw, Shield } from "lucide-react"

// Sample card details based on the provided JSON
const cardDetailsData = {
  "Infinia Credit Card": {
    card_name: "Infinia Credit Card",
    issuing_bank: "HDFC Bank",
    base_value: 1,
    base_value_currency: "INR",
    earning_rewards: [
      {
        category:
          "All retail spends (except fuel, rent, property management, government spends, EasyEMI, e-wallet reloads)",
        multiplier_description: "5 Reward Points per Rs. 150 spent",
        multiplier_value_int: 5,
        notes: "Includes insurance, utilities, and education spends, which are often excluded on other cards[3][5].",
      },
      {
        category: "SmartBuy portal (travel and shopping)",
        multiplier_description: "Up to 10X Reward Points",
        multiplier_value_int: 10,
        notes: "Accelerated rewards capped at 15,000 points per month[5].",
      },
      {
        category: "All categories (monthly cap)",
        multiplier_description: "Maximum 2 lakh points per month across all categories",
        multiplier_value_int: null,
        notes: "No specific capping on SmartBuy, but overall monthly cap applies[3].",
      },
    ],
    redemption_options: [
      {
        type: "Flight and hotel bookings via SmartBuy",
        value_per_point_cents: 1,
        value_description: "1 Reward Point = Re. 1[5].",
      },
      {
        type: "Airmiles transfer (select partners)",
        value_per_point_cents: 1,
        value_description: "1 Reward Point = 1 Airmile (1:1 ratio)[3].",
      },
      {
        type: "Products and vouchers via NetBanking/SmartBuy",
        value_per_point_cents: 0.5,
        value_description: "1 Reward Point = Rs. 0.50[5].",
      },
      {
        type: "Apple and Tanishq vouchers",
        value_per_point_cents: 1,
        value_description: "1 Reward Point = Re. 1[5].",
      },
      {
        type: "Cashback (statement credit)",
        value_per_point_cents: 0.3,
        value_description: "1 Reward Point = Rs. 0.30[5].",
      },
    ],
    strategic_insights: [
      {
        strategy_title: "Maximize SmartBuy Spends",
        description:
          "Use the card for travel and shopping via the SmartBuy portal to earn up to 10X points, maximizing the effective reward rate.",
        value_proposition:
          "Potential to earn up to 33% value back on SmartBuy spends when redeeming for travel bookings[5].",
      },
      {
        strategy_title: "Leverage Airmiles Transfer",
        description:
          "Transfer points to airline partners at a 1:1 ratio for potentially higher value, especially for premium cabin redemptions.",
        value_proposition: "Frequent flyers can extract significant value by converting points to airmiles[3].",
      },
      {
        strategy_title: "Redeem for High-Value Vouchers",
        description: "Redeem points for Apple or Tanishq vouchers at 1:1 value for non-travel high-value redemptions.",
        value_proposition: "Ensures full value of Re. 1 per point even if not redeeming for travel[5].",
      },
    ],
    fees: {
      joining_amount: "₹12,500",
      renewal_amount: "₹12,500",
      forex_percentage: "2.0",
      apr_description: "~3.6% per month (43.2% annualized)",
      addon_card_amount: "Nil",
      reward_redemption_description: "No fee for most redemptions; some catalog items may have delivery charges[5].",
    },
    milestone_benefits: [
      {
        spend_level_description: "Annual spends of ₹10 lakh",
        benefit_description: ["Renewal fee waived for next year[5]."],
      },
      {
        spend_level_description: "On card issuance",
        benefit_description: [
          "Complimentary Taj Epicure and Club Marriott membership (renewable based on annual spend)[4].",
        ],
      },
    ],
  },
}

// Helper function to get card details or use default
const getCardDetails = (cardName: string) => {
  return cardDetailsData[cardName] || null
}

interface CardDetailViewProps {
  card: CreditCardType
  onClose: () => void
}

export function CardDetailView({ card, onClose }: CardDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [cardDetails, setCardDetails] = useState<any>(null)

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)

    const timer = setTimeout(() => {
      setCardDetails(getCardDetails(card.name))
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [card.name])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Card Details</h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          Back to Cards
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-center mb-4">
                <CreditCard card={card} isActive={true} hideDetails={false} />
              </div>

              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Card Network</span>
                  <div className="flex items-center gap-2">
                    {card.network && <CardNetworkLogo network={card.network} className="h-6 w-6" />}
                    <span className="font-medium capitalize">{card.network}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Points Balance</span>
                  <span className="font-medium">{card.pointsBalance.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cash Value</span>
                  <span className="font-medium">${card.cashValue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Annual Fee</span>
                  <span className="font-medium">${card.annualFee}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Expiry Date</span>
                  <span className="font-medium">{card.expiryDate}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={card.status === "Active" ? "default" : "secondary"}>{card.status}</Badge>
                </div>

                {!isLoading && cardDetails && (
                  <>
                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Base Value</span>
                      <span className="font-medium">
                        {cardDetails.base_value} {cardDetails.base_value_currency}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{card.name}</CardTitle>
              <CardDescription>Issued by {card.issuer}</CardDescription>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="earning">Earning</TabsTrigger>
                  <TabsTrigger value="redeeming">Redeeming</TabsTrigger>
                  <TabsTrigger value="fees">Fees</TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="p-6">
                    {isLoading ? (
                      <div className="space-y-6">
                        <div>
                          <Skeleton className="h-6 w-48 mb-4" />
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <Card key={i}>
                                <div className="h-2 bg-gradient-to-r">
                                  <Skeleton className="h-full w-full" />
                                </div>
                                <CardHeader className="pb-2">
                                  <Skeleton className="h-5 w-48" />
                                </CardHeader>
                                <CardContent>
                                  <Skeleton className="h-4 w-full mb-4" />
                                  <Skeleton className="h-16 w-full rounded-md" />
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Skeleton className="h-6 w-48 mb-4" />
                          <div className="space-y-4">
                            {[1, 2].map((i) => (
                              <Card key={i}>
                                <CardHeader className="pb-2">
                                  <Skeleton className="h-5 w-48" />
                                </CardHeader>
                                <CardContent>
                                  <Skeleton className="h-4 w-full mb-2" />
                                  <Skeleton className="h-4 w-full mb-2" />
                                  <Skeleton className="h-4 w-full" />
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <TabsContent value="overview" className="mt-0">
                          <div className="space-y-6">
                            {cardDetails ? (
                              <>
                                <div>
                                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                                    <Lightbulb className="h-5 w-5 text-primary" /> Strategic Insights
                                  </h3>

                                  <div className="space-y-4">
                                    {cardDetails.strategic_insights.map((insight, index) => (
                                      <Card key={index} className="overflow-hidden">
                                        <div
                                          className="h-2 bg-gradient-to-r"
                                          style={{
                                            backgroundImage: `linear-gradient(to right, ${card.color || "#ff6b00"}, ${
                                              card.secondaryColor || "#cc5500"
                                            })`,
                                          }}
                                        />
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-base">{insight.strategy_title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-sm mb-4">{insight.description}</p>
                                          <div className="bg-muted/50 p-3 rounded-md">
                                            <p className="text-sm font-medium">Value Proposition</p>
                                            <p className="text-sm">{insight.value_proposition}</p>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>

                                {cardDetails.milestone_benefits.length > 0 && (
                                  <div>
                                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                                      <Award className="h-5 w-5 text-primary" /> Milestone Benefits
                                    </h3>

                                    <div className="space-y-4">
                                      {cardDetails.milestone_benefits.map((milestone, index) => (
                                        <Card key={index}>
                                          <CardHeader className="pb-2">
                                            <CardTitle className="text-base">
                                              {milestone.spend_level_description}
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <ul className="space-y-2">
                                              {Array.isArray(milestone.benefit_description) ? (
                                                milestone.benefit_description.map((benefit, i) => (
                                                  <li key={i} className="flex items-start gap-2">
                                                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                                      <span className="text-xs text-primary font-medium">{i + 1}</span>
                                                    </div>
                                                    <span>{benefit}</span>
                                                  </li>
                                                ))
                                              ) : (
                                                <li className="flex items-start gap-2">
                                                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <span className="text-xs text-primary font-medium">1</span>
                                                  </div>
                                                  <span>{milestone.benefit_description}</span>
                                                </li>
                                              )}
                                            </ul>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                  Detailed information not available for this card.
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="earning" className="mt-0">
                          <div className="space-y-6">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <Gift className="h-5 w-5 text-primary" /> Earning Rewards
                            </h3>

                            {cardDetails ? (
                              <div className="space-y-4">
                                {cardDetails.earning_rewards.map((reward, index) => (
                                  <Card key={index}>
                                    <CardHeader className="pb-2">
                                      <div className="flex justify-between items-start">
                                        <CardTitle className="text-base">{reward.category}</CardTitle>
                                        {reward.multiplier_value_int && (
                                          <Badge className="bg-primary">{reward.multiplier_value_int}x</Badge>
                                        )}
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-sm font-medium mb-2">{reward.multiplier_description}</p>
                                      {reward.notes && <p className="text-sm text-muted-foreground">{reward.notes}</p>}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                  Earning information not available for this card.
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="redeeming" className="mt-0">
                          <div className="space-y-6">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <RefreshCw className="h-5 w-5 text-primary" /> Redemption Options
                            </h3>

                            {cardDetails ? (
                              <div className="space-y-4">
                                {cardDetails.redemption_options.map((option, index) => (
                                  <Card key={index}>
                                    <CardHeader className="pb-2">
                                      <div className="flex justify-between items-start">
                                        <CardTitle className="text-base">{option.type}</CardTitle>
                                        <Badge variant="outline">
                                          {option.value_per_point_cents}{" "}
                                          {cardDetails.base_value_currency === "INR" ? "paise" : "cents"}/point
                                        </Badge>
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-sm">{option.value_description}</p>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                  Redemption information not available for this card.
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="fees" className="mt-0">
                          <div className="space-y-6">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-primary" /> Fees & Charges
                            </h3>

                            {cardDetails ? (
                              <>
                                <Card>
                                  <CardContent className="p-6">
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">Joining Fee</span>
                                        <span>{cardDetails.fees.joining_amount}</span>
                                      </div>

                                      <Separator />

                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">Annual Fee</span>
                                        <span>{cardDetails.fees.renewal_amount}</span>
                                      </div>

                                      <Separator />

                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">Foreign Transaction Fee</span>
                                        <span>{cardDetails.fees.forex_percentage}%</span>
                                      </div>

                                      {cardDetails.fees.apr_description && (
                                        <>
                                          <Separator />
                                          <div className="flex justify-between items-center">
                                            <span className="font-medium">APR</span>
                                            <span>{cardDetails.fees.apr_description}</span>
                                          </div>
                                        </>
                                      )}

                                      {cardDetails.fees.addon_card_amount && (
                                        <>
                                          <Separator />
                                          <div className="flex justify-between items-center">
                                            <span className="font-medium">Add-on Card Fee</span>
                                            <span>{cardDetails.fees.addon_card_amount}</span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>

                                {cardDetails.fees.reward_redemption_description && (
                                  <div className="bg-muted/30 rounded-lg p-4">
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                      <Shield className="h-4 w-4 text-muted-foreground" /> Reward Redemption Fees
                                    </h4>
                                    <p className="text-sm">{cardDetails.fees.reward_redemption_description}</p>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">Fee information not available for this card.</p>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
