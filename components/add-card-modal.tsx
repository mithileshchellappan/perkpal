"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { X } from "lucide-react"
import type { Card } from "@/lib/types"
import CreditCardInput from "./credit-card-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddCardModalProps {
  onClose: () => void
  onAdd: (card: Card) => void
  existingIds: string[]
}

export function AddCardModal({ onClose, onAdd, existingIds }: AddCardModalProps) {
  const [formData, setFormData] = useState<Omit<Card, "id">>({
    name: "",
    number: "",
    expiry: "",
    type: "VISA",
    color: "bg-green-200",
    points: 0,
    value: 0,
  })
  const [step, setStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCardNumberChange = useCallback((cardNumber: string) => {
    setFormData((prev) => ({
      ...prev,
      number: cardNumber,
    }))

    // Determine card type based on first digit
    if (cardNumber.startsWith("4")) {
      setFormData((prev) => ({ ...prev, type: "VISA", color: "bg-blue-200" }))
    } else if (cardNumber.startsWith("5")) {
      setFormData((prev) => ({ ...prev, type: "MASTERCARD", color: "bg-purple-200" }))
    } else if (cardNumber.startsWith("6")) {
      setFormData((prev) => ({ ...prev, type: "DISCOVER", color: "bg-amber-200" }))
    }
  }, [])

  const handleExpiryChange = useCallback((month: string, year: string) => {
    setFormData((prev) => ({
      ...prev,
      expiry: `${month}/${year.slice(-2)}`,
    }))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a new ID
    const newId = (Math.max(...existingIds.map((id) => Number.parseInt(id)), 0) + 1).toString()

    onAdd({
      id: newId,
      ...formData,
      points: Number(formData.points),
      value: Number(formData.value),
    })
  }

  const handleNext = useCallback(() => {
    setStep(2)
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Card</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <CreditCardInput
              onCardNumberChange={handleCardNumberChange}
              onExpiryChange={handleExpiryChange}
              onNext={handleNext}
            />
            <div className="mt-4">
              <p className="text-sm text-gray-400 text-center">
                Enter your card details above, then click "Continue" to proceed
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium mb-1">
                Card Name
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="points" className="block text-sm font-medium mb-1">
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  className="w-full bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  required
                />
              </div>

              <div>
                <Label htmlFor="value" className="block text-sm font-medium mb-1">
                  Value ($)
                </Label>
                <Input
                  id="value"
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  className="w-full bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 border-gray-600"
              >
                Back
              </Button>
              <Button type="submit" className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                Add Card
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
