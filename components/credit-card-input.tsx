"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Card types and their logos
type CardType = "visa" | "mastercard" | "discover" | null

interface CardDetails {
  type: CardType
  gradient: string
}

interface CreditCardInputProps {
  onCardNumberChange: (cardNumber: string) => void
  onExpiryChange: (month: string, year: string) => void
  onNext: () => void
}

export default function CreditCardInput({ onCardNumberChange, onExpiryChange, onNext }: CreditCardInputProps) {
  const [cardNumber, setCardNumber] = useState(["", ""])
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null)
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [cvv, setCvv] = useState("")
  const firstInputRef = useRef<HTMLInputElement>(null)
  const secondInputRef = useRef<HTMLInputElement>(null)

  // Simulate API fetch for card details based on first digits
  useEffect(() => {
    if (cardNumber[0].length > 0) {
      // This would be replaced with an actual API call
      const firstDigit = cardNumber[0][0]

      if (firstDigit === "4") {
        setCardDetails({
          type: "visa",
          gradient: "bg-gradient-to-r from-[#52B6FE] to-[#6154FE]",
        })
      } else if (firstDigit === "5") {
        setCardDetails({
          type: "mastercard",
          gradient: "bg-gradient-to-r from-[#042843] to-[#726E9E]",
        })
      } else if (firstDigit === "6") {
        setCardDetails({
          type: "discover",
          gradient: "bg-gradient-to-r from-[#FF974B] to-[#FF94A1]",
        })
      } else {
        setCardDetails(null)
      }
    } else {
      setCardDetails(null)
    }
  }, [cardNumber])

  const handleCardNumberChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    const newCardNumber = [...cardNumber]
    newCardNumber[index] = cleanValue
    setCardNumber(newCardNumber)

    // Call parent callback with the updated card number
    onCardNumberChange(`${index === 0 ? cleanValue : cardNumber[0]}${index === 1 ? cleanValue : cardNumber[1]}`)

    // Auto-focus to next input when first input is filled
    if (index === 0 && cleanValue.length === 4 && secondInputRef.current) {
      secondInputRef.current.focus()
    }
  }

  const handleMonthChange = (value: string) => {
    setMonth(value)
    if (year) {
      onExpiryChange(value, year)
    }
  }

  const handleYearChange = (value: string) => {
    setYear(value)
    if (month) {
      onExpiryChange(month, value)
    }
  }

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the card click from triggering
    setIsFlipped(true)
  }

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the card click from triggering
    setIsFlipped(false)
  }

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault()
    if (month && year && cvv) {
      onNext()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative w-full aspect-[1.58/1] perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
        >
          {/* Front of the card */}
          <div
            className={`absolute w-full h-full rounded-2xl shadow-lg backface-hidden ${
              cardDetails?.gradient || "bg-gradient-to-r from-[#282828] to-[#0B0B0B]"
            }`}
            onClick={() => firstInputRef.current?.focus()}
          >
            <div className="p-6 flex flex-col justify-between h-full text-white">
              <div className="flex justify-between items-start">
                <span className="text-sm opacity-90 font-['Ubuntu']">Credit</span>
                {cardDetails?.type && (
                  <div className="h-12 w-12 flex items-center justify-center">
                    {cardDetails.type === "visa" && <span className="text-xl font-bold tracking-tighter">VISA</span>}
                    {cardDetails.type === "mastercard" && (
                      <div className="relative">
                        <div className="absolute w-6 h-6 bg-[#EB001B] rounded-full left-0 opacity-90"></div>
                        <div className="absolute w-6 h-6 bg-[#F79E1B] rounded-full left-3 opacity-90"></div>
                        <div className="absolute w-3 h-3 bg-[#FF5F00] rounded-full left-1.5 top-1.5 opacity-90"></div>
                      </div>
                    )}
                    {cardDetails.type === "discover" && (
                      <span className="text-sm font-bold tracking-tighter">DISCOVER</span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <div className="font-['IBM_Plex_Mono'] text-base md:text-xl">
                  <div className="flex space-x-1 md:space-x-2">
                    <div className="relative inline-flex items-center">
                      <input
                        ref={firstInputRef}
                        type="text"
                        value={cardNumber[0]}
                        onChange={(e) => handleCardNumberChange(0, e.target.value)}
                        className="w-[4ch] bg-transparent outline-none font-mono"
                        placeholder=""
                        maxLength={4}
                      />
                      {!cardNumber[0] && (
                        <span className="absolute inset-0 pointer-events-none flex items-center text-white/50">
                          ••••
                        </span>
                      )}
                    </div>
                    <div className="relative inline-flex items-center">
                      <input
                        ref={secondInputRef}
                        type="text"
                        value={cardNumber[1]}
                        onChange={(e) => handleCardNumberChange(1, e.target.value)}
                        className="w-[4ch] bg-transparent outline-none font-mono"
                        placeholder=""
                        maxLength={4}
                      />
                      {!cardNumber[1] && (
                        <span className="absolute inset-0 pointer-events-none flex items-center text-white/50">
                          ••••
                        </span>
                      )}
                    </div>
                    <span className="inline-block w-[4ch]">XXXX</span>
                    <span className="inline-block w-[4ch]">XXXX</span>
                  </div>
                </div>
              </div>

              <button
                className="absolute bottom-6 right-6 text-white border-b border-white/30 hover:border-white transition-colors text-sm flex items-center"
                onClick={handleNextClick}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Back of the card */}
          <div
            className={`absolute w-full h-full rounded-2xl shadow-lg backface-hidden rotate-y-180 ${
              cardDetails?.gradient || "bg-gradient-to-r from-[#282828] to-[#0B0B0B]"
            }`}
          >
            <div className="p-6 flex flex-col justify-between h-full text-white">
              <div className="w-full h-10 bg-black/50 mt-4"></div>

              <div className="mt-4 space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="month" className="text-white/80 text-sm font-['Ubuntu']">
                    Expiration Month
                  </Label>
                  <Select onValueChange={handleMonthChange}>
                    <SelectTrigger
                      id="month"
                      className="bg-transparent border-white/30 focus:border-white/70 text-white"
                    >
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const monthNum = i + 1
                        const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`
                        return (
                          <SelectItem key={monthStr} value={monthStr}>
                            {monthStr}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="year" className="text-white/80 text-sm font-['Ubuntu']">
                    Expiration Year
                  </Label>
                  <Select onValueChange={handleYearChange}>
                    <SelectTrigger
                      id="year"
                      className="bg-transparent border-white/30 focus:border-white/70 text-white"
                    >
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cvv" className="text-white/80 text-sm font-['Ubuntu']">
                    CVV
                  </Label>
                  <Select onValueChange={(value) => setCvv(value)}>
                    <SelectTrigger id="cvv" className="bg-transparent border-white/30 focus:border-white/70 text-white">
                      <SelectValue placeholder="CVV" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="123">•••</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  className="text-white border-b border-white/30 hover:border-white transition-colors text-sm"
                  onClick={handleBackClick}
                >
                  Back to front
                </button>
                <button
                  className={`text-white border-b ${
                    month && year && cvv ? "border-white hover:border-white" : "border-white/30"
                  } transition-colors text-sm flex items-center`}
                  onClick={handleContinue}
                  disabled={!month || !year || !cvv}
                >
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
