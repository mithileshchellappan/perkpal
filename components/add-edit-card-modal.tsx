"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CreditCardType } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { lookupBin, getNetworkGradient } from "@/lib/bin-lookup"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { CardNetworkLogo } from "@/components/card-network-logos"
import { generateColorFromString, adjustColor } from "@/lib/utils"

interface AddEditCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card?: CreditCardType
  onSave: (card: CreditCardType) => void
  addCardAction: (cardData: CreditCardType) => Promise<CreditCardType | null>
  isAddingCardAction?: boolean
  addCardErrorAction?: Error | null
}

type Step = "bin" | "card-details"

export function AddEditCardModal({
  open,
  onOpenChange,
  card,
  onSave,
  addCardAction,
  isAddingCardAction,
  addCardErrorAction,
}: AddEditCardModalProps) {
  const [step, setStep] = useState<Step>(card ? "card-details" : "bin")
  const [binNumber, setBinNumber] = useState(card?.number?.substring(0, 8) || "")
  const [binError, setBinError] = useState<string | null>(null)
  const [binResult, setBinResult] = useState<{
    bank: string
    country: string
    network: string
    cardTypes: string[]
  } | null>(null)

  const [formData, setFormData] = useState<CreditCardType>(
    card || {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      pointsBalance: 0,
      baseValue: 0,
      annualFee: 0,
      expiryDate: "",
      rewardsRate: 1,
      status: "Active",
      color: "#ff6b00",
      network: "other"
    },
  )

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (!card) {
        setStep("bin")
        setBinNumber("")
        setBinError(null)
        setBinResult(null)
        setFormData({
          id: crypto.randomUUID(),
          name: "",
          issuer: "",
          pointsBalance: 0,
          baseValue: 0,
          annualFee: 0,
          expiryDate: "",
          rewardsRate: 1,
          status: "Active",
          color: "#ff6b00",
          network: "other",
          number: ""
        })
      } else {
        setStep("card-details")
      }
    }
  }, [open, card])

  const handleBinLookup = async () => {
    if (binNumber.length < 8) {
      setBinError("Please enter at least 8 digits")
      return
    }

    try {
      const result = await lookupBin(binNumber)
      if (result) {
        const cardData = {
          ...formData,
          issuer: result.bank,
          network: result.network,
          number: binNumber,
          country: result.country
        }
        setBinResult(result)
        setFormData(cardData)
        setStep("card-details")
        setBinError(null)
      } else {
        setBinError("Card not found. Please check the number and try again.")
      }
    } catch (error) {
      setBinError("Error looking up card. Please try again.")
    }
  }

  const handleCardTypeSelect = (cardType: string) => {
    // Generate gradient colors based on network and card type
    const { primary, secondary } = getNetworkGradient(formData.network || "other", cardType)

    setFormData({
      ...formData,
      name: cardType,
      color: primary,
      secondaryColor: secondary,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Handle numeric values
    if (["pointsBalance"].includes(name)) {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === "bin") {
      handleBinLookup()
    } else {
      const baseColor = formData.color || generateColorFromString(formData.name || "")
      const saveData: CreditCardType = {
        ...formData,
        number: formData.number || binNumber,
        color: baseColor,
        secondaryColor: formData.secondaryColor || adjustColor(baseColor, 10),
      }

      if (card) {
        console.log("saveData for edit", saveData)
        onSave(saveData)
      } else {
        console.log("saveData for add", saveData)
        const addedCardResponse = await addCardAction(saveData)
        if (addedCardResponse) {
          onSave(addedCardResponse)
        } else {
          console.error("Failed to add card through hook", addCardErrorAction)
        }
      }
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-4">
      <div className={`h-2 w-2 rounded-full ${step === "bin" ? "bg-primary" : "bg-muted"}`} />
      <div className="h-px w-4 bg-muted" />
      <div className={`h-2 w-2 rounded-full ${step === "card-details" ? "bg-primary" : "bg-muted"}`} />
    </div>
  )

  const renderCardPreview = () => {
    if (!formData.name) return null

    return (
      <Card
        className="p-4 h-40 bg-gradient-to-br relative overflow-hidden mb-4"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${formData.color || "#ff6b00"}, ${formData.secondaryColor || "#cc5500"})`,
        }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full" />

        <div className="flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-white/70">Card Issuer</p>
              <p className="font-bold text-white">{formData.issuer}</p>
            </div>
            {formData.network && (
              <div className="h-8 w-12">
                <CardNetworkLogo network={formData.network} />
              </div>
            )}
          </div>

          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-xs text-white/70">Card Name</p>
              <p className="font-bold text-white">{formData.name}</p>
            </div>
            {formData.pointsBalance > 0 && (
              <div className="text-right">
                <p className="text-xs text-white/70">Points</p>
                <p className="font-bold text-white">{formData.pointsBalance.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{card ? "Edit Credit Card" : "Add New Credit Card"}</DialogTitle>
            <DialogDescription>
              {step === "bin" && "Enter the first 8 digits of your credit card for automatic identification."}
              {step === "card-details" && "Confirm your card details and enter your points balance."}
            </DialogDescription>
          </DialogHeader>

          {renderStepIndicator()}

          {step === "bin" && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="binNumber">First 8 digits of your card</Label>
                <Input
                  id="binNumber"
                  value={binNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 8)
                    setBinNumber(value)
                    if (binError) setBinError(null)
                  }}
                  placeholder="12345678"
                  className="font-mono text-lg tracking-wider"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  We'll use this to identify your card. We don't store your full card number.
                </p>
              </div>

              {binError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{binError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === "card-details" && (
            <div className="grid gap-4 py-4">
              {renderCardPreview()}

              <div className="space-y-2">
                <Label htmlFor="issuer">Card Issuer</Label>
                <Input
                  id="issuer"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  required
                  readOnly={!!binResult}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardType">Card Type</Label>
                {binResult && binResult.cardTypes.length > 0 ? (
                  <Select value={formData.name} onValueChange={(value) => handleCardTypeSelect(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      {binResult.cardTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pointsBalance">Points Balance</Label>
                <Input
                  id="pointsBalance"
                  name="pointsBalance"
                  type="number"
                  value={formData.pointsBalance}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {addCardErrorAction && step === "card-details" && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{addCardErrorAction.message}</AlertDescription>
                </Alert>
              )}
              {isAddingCardAction && step === "card-details" && (
                <div className="mt-4 text-center">Adding card...</div>
              )}
            </div>
          )}

          <DialogFooter>
            {step !== "bin" && (
              <Button type="button" variant="outline" onClick={() => setStep("bin")}>
                Back
              </Button>
            )}
            <Button type="submit">{step === "card-details" ? (card ? "Save Changes" : "Add Card") : "Continue"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
