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
import type { ComprehensiveCardAnalysisResponse } from "@/types/cards"

interface CardDetailViewProps {
  card: CreditCardType
  onClose: () => void
}

export function CardDetailView({ card, onClose }: CardDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [cardDetails, setCardDetails] = useState<ComprehensiveCardAnalysisResponse | null>(null)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setCardDetails(card.cardAnalysisData || null)
      console.log("cardDetails", card)
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [card.cardAnalysisData])

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Card Details</h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          Back to Cards
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        <div className="md:col-span-1">
          <Card className="h-fit">
            <CardContent className="p-4">
              <CreditCard card={card} isActive={true} hideDetails={true} />

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
                  <span className="font-medium">{card.cashValue?.toLocaleString(undefined,{
                    currency: card.currency,
                    style: "currency",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Annual Fee</span>
                  <span className="font-medium">{cardDetails?.fees?.renewal_amount?.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={card.status === "Active" ? "default" : "secondary"}>{card.status}</Badge>
                </div>

                {!isLoading && cardDetails?.base_value != null && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Base Value</span>
                      <span className="font-medium">
                        {cardDetails.base_value?.toLocaleString(undefined,{
                          currency: card.currency,
                          style: "currency",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>{card.name}</CardTitle>
              <CardDescription>Issued by {card.issuer}</CardDescription>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1">
              <div className="px-6">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="earning">Earning</TabsTrigger>
                  <TabsTrigger value="redeeming">Redeeming</TabsTrigger>
                  <TabsTrigger value="fees">Fees</TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
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
                                    {cardDetails.strategic_insights?.map((insight, index) => (
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

                                {cardDetails.milestone_benefits && cardDetails.milestone_benefits.length > 0 && (
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

                            {cardDetails?.fees ? (
                              <>
                                <Card>
                                  <CardContent className="p-6">
                                    <div className="space-y-4">
                                      {cardDetails.fees?.joining_amount != null && (
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Joining Fee</span>
                                          <span>{cardDetails.fees.joining_amount}</span>
                                        </div>
                                      )}

                                      {cardDetails.fees?.joining_amount != null && <Separator />}

                                      {cardDetails.fees?.renewal_amount != null && (
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Annual Fee</span>
                                          <span>{cardDetails.fees.renewal_amount}</span>
                                        </div>
                                      )}

                                      {cardDetails.fees?.renewal_amount != null && <Separator />}

                                      {cardDetails.fees?.forex_percentage != null && (
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Foreign Transaction Fee</span>
                                          <span>{cardDetails.fees.forex_percentage}%</span>
                                        </div>
                                      )}

                                      {cardDetails.fees?.apr_description != null && (
                                        <>
                                          {cardDetails.fees?.forex_percentage != null && <Separator />}
                                          <div className="flex justify-between items-center">
                                            <span className="font-medium">APR</span>
                                            <span>{cardDetails.fees.apr_description}</span>
                                          </div>
                                        </>
                                      )}

                                      {cardDetails.fees?.addon_card_amount != null && (
                                        <>
                                          {(cardDetails.fees?.apr_description != null || cardDetails.fees?.forex_percentage != null) && <Separator />}
                                          <div className="flex justify-between items-center">
                                            <span className="font-medium">Add-on Card Fee</span>
                                            <span>{cardDetails.fees.addon_card_amount}</span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>

                                {cardDetails.fees?.reward_redemption_description != null && (
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
