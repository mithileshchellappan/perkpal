"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpCircle, FileText, BarChart, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { CreditCardType } from "@/lib/types"

interface StatementUploadProps {
  cards: CreditCardType[]
}

export function StatementUpload({ cards }: StatementUploadProps) {
  const [selectedCard, setSelectedCard] = useState<string | undefined>()
  const [fileUploaded, setFileUploaded] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Mock analysis results
  const analysisResults = {
    totalSpend: 56789,
    totalPoints: 2450,
    categories: [
      { name: "Dining", spend: 12450, points: 623, pointsPerRupee: 0.05 },
      { name: "Travel", spend: 18950, points: 948, pointsPerRupee: 0.05 },
      { name: "Shopping", spend: 9800, points: 490, pointsPerRupee: 0.05 },
      { name: "Grocery", spend: 7600, points: 228, pointsPerRupee: 0.03 },
      { name: "Utilities", spend: 4350, points: 87, pointsPerRupee: 0.02 },
      { name: "Other", spend: 3639, points: 74, pointsPerRupee: 0.02 },
    ],
    month: "April 2025",
  }

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId)
    if (fileUploaded) {
      handleUpload()
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === "application/pdf") {
        setFileUploaded(file)
        if (selectedCard) {
          handleUpload()
        }
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === "application/pdf") {
        setFileUploaded(file)
        if (selectedCard) {
          handleUpload()
        }
      }
    }
  }

  const handleUpload = () => {
    if (!selectedCard || !fileUploaded) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setIsAnalyzing(true)

          // Simulate analysis time
          setTimeout(() => {
            setIsAnalyzing(false)
            setAnalysisComplete(true)
          }, 3500)
          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  const resetUpload = () => {
    setFileUploaded(null)
    setUploadProgress(0)
    setIsUploading(false)
    setIsAnalyzing(false)
    setAnalysisComplete(false)
  }

  // Show loading skeleton when analyzing
  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Statement Analysis</CardTitle>
                <CardDescription>Analyzing your statement...</CardDescription>
              </div>
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>{fileUploaded?.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={resetUpload}>
                  Cancel
                </Button>
              </div>

              <div className="space-y-4 pt-4">
                <Skeleton className="h-10 w-full" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                </div>

                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show analysis results when complete
  if (analysisComplete) {
    const selectedCardData = cards.find((card) => card.id === selectedCard)

    // Calculate category percentages for the chart
    const totalSpend = analysisResults.categories.reduce((sum, cat) => sum + cat.spend, 0)
    let startPercentage = 0
    const categoryChartData = analysisResults.categories.map((category) => {
      const percentage = (category.spend / totalSpend) * 100
      const start = startPercentage
      startPercentage += percentage
      return {
        ...category,
        percentage,
        start,
        end: startPercentage,
      }
    })

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Statement Analysis</CardTitle>
                <CardDescription>
                  {selectedCardData?.name} ({selectedCardData?.issuer}) - {analysisResults.month}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={resetUpload}>
                Analyze Another Statement
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="points">Points Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Total Spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">₹{analysisResults.totalSpend.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">For {analysisResults.month}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Points Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{analysisResults.totalPoints.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Reward points</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Avg. Points/₹</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {(analysisResults.totalPoints / analysisResults.totalSpend).toFixed(3)}
                      </p>
                      <p className="text-sm text-muted-foreground">Points per rupee</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <BarChart className="h-4 w-4" /> Spending by Category
                  </h3>

                  <div className="h-4 w-full rounded-full overflow-hidden mb-6">
                    {categoryChartData.map((category, index) => (
                      <div
                        key={index}
                        className="h-full inline-block"
                        style={{
                          width: `${category.percentage}%`,
                          background: getCategoryColor(category.name, index),
                        }}
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    {analysisResults.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(category.name, index) }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <div className="flex gap-6">
                          <span>₹{category.spend.toLocaleString()}</span>
                          <span className="text-muted-foreground w-16 text-right">
                            {((category.spend / totalSpend) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="categories">
                <div className="space-y-4">
                  {analysisResults.categories.map((category, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: getCategoryColor(category.name, index) }}
                            />
                            <CardTitle className="text-base">{category.name}</CardTitle>
                          </div>
                          <span className="text-sm font-medium">
                            {((category.spend / totalSpend) * 100).toFixed(1)}% of total
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Spend</p>
                            <p className="text-lg font-semibold">₹{category.spend.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Points Earned</p>
                            <p className="text-lg font-semibold">{category.points.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Points per Rupee</p>
                            <p className="text-lg font-semibold">{category.pointsPerRupee.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="points">
                <div className="rounded-lg border p-4 mb-6">
                  <h3 className="font-medium mb-4">Points Earning Efficiency</h3>

                  {analysisResults.categories.map((category, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm">{category.pointsPerRupee.toFixed(2)} pts/₹</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${(category.pointsPerRupee / 0.05) * 100}%`,
                            background: getCategoryColor(category.name, index),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Points Optimization Suggestions</CardTitle>
                    <CardDescription>How to maximize your reward points</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2">Use another card for Utilities</h4>
                      <p className="text-sm">
                        Your current earnings on Utilities (0.02 pts/₹) are below average. Consider using the HDFC
                        Regalia card which offers 0.04 pts/₹ on utility payments.
                      </p>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2">Maximize points on Grocery spending</h4>
                      <p className="text-sm">
                        You could earn up to 380 additional points by using a specialized grocery card like Amazon Pay
                        ICICI card for your monthly grocery spending of ₹7,600.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default upload screen
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Statement</CardTitle>
          <CardDescription>Analyze your credit card statement to see rewards breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="card-select">Select Card</Label>
              <Select value={selectedCard} onValueChange={handleCardSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a card" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.issuer} {card.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isUploading ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>{fileUploaded?.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetUpload} disabled={uploadProgress >= 100}>
                    Cancel
                  </Button>
                </div>
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{uploadProgress}% uploaded</p>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
                  !selectedCard && "opacity-50 pointer-events-none",
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => {
                  if (selectedCard) {
                    document.getElementById("statement-upload")?.click()
                  }
                }}
              >
                <input
                  id="statement-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={!selectedCard}
                />
                <ArrowUpCircle className="h-10 w-10 text-muted-foreground/60 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">Upload Statement PDF</h3>
                <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
                <p className="text-xs text-muted-foreground">Only PDF files are supported</p>

                {!selectedCard && <p className="mt-4 text-sm text-amber-500">Please select a card first</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How Statement Analysis Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4 list-decimal list-inside text-sm">
            <li>
              <span className="font-medium">Upload your statement:</span>
              <p className="ml-6 text-muted-foreground">
                PerkPal accepts PDF statements from most major banks and credit card issuers.
              </p>
            </li>
            <li>
              <span className="font-medium">AI analysis:</span>
              <p className="ml-6 text-muted-foreground">
                Our AI engine extracts and categorizes transactions, calculating rewards earned per category.
              </p>
            </li>
            <li>
              <span className="font-medium">Optimization recommendations:</span>
              <p className="ml-6 text-muted-foreground">
                Get personalized suggestions on how to maximize rewards based on your spending patterns.
              </p>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
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
  const categoryColors: Record<string, string> = {
    Dining: "#f97316",
    Travel: "#2563eb",
    Shopping: "#ec4899",
    Grocery: "#84cc16",
    Utilities: "#8b5cf6",
    Other: "#6b7280",
  }

  return categoryColors[category] || colors[index % colors.length]
}
