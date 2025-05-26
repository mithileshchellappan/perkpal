"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Trash2, AlertCircle } from "lucide-react"
import type { CreditCardType } from "@/lib/types"
import { cn, generateColorFromString, adjustColor } from "@/lib/utils"
import { CardNetworkLogo } from "@/components/card-network-logo"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CreditCardCarouselProps {
  cards: CreditCardType[]
  onSelectCard: (card: CreditCardType) => void
  onRemoveCard?: (cardId: string) => void
  onAddCard?: () => void
  showAddButton?: boolean
  title?: string
  selectedCardId?: string
}

export function CreditCardCarousel({
  cards,
  onSelectCard,
  onRemoveCard,
  onAddCard,
  showAddButton = true,
  title = "Your Credit Cards",
  selectedCardId,
}: CreditCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsPerView = 2
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - cardsPerView))
    }
  }

  const handleNext = () => {
    if (currentIndex < cards.length - cardsPerView) {
      setCurrentIndex(Math.min(cards.length - cardsPerView, currentIndex + cardsPerView))
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.offsetWidth / cardsPerView
      setTranslateX(-currentIndex * cardWidth)
    }
  }, [currentIndex, cardsPerView])

  useEffect(() => {
    if (selectedCardId) {
      const selectedIndex = cards.findIndex((card) => card.id === selectedCardId)
      if (selectedIndex >= 0) {
        const pageIndex = Math.floor(selectedIndex / cardsPerView) * cardsPerView
        setCurrentIndex(pageIndex)
      }
    }
  }, [selectedCardId, cards, cardsPerView])

  const confirmCardRemoval = (cardId: string) => {
    setCardToDelete(cardId)
  }

  const handleCardRemoval = () => {
    if (cardToDelete && onRemoveCard) {
      onRemoveCard(cardToDelete)
      setCardToDelete(null)
    }
  }

  const cancelCardRemoval = () => {
    setCardToDelete(null)
  }

  if (cards.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p>No credit cards added yet. Add your first card to get started!</p>
        {showAddButton && onAddCard && (
          <Button onClick={onAddCard} className="mt-4">
            Add Card
          </Button>
        )}
      </Card>
    )
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {showAddButton && onAddCard && (
          <Button size="sm" onClick={onAddCard} className="gap-2">
            Add New Card
          </Button>
        )}
      </div>

      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {cards.map((card, index) => (
            <div key={card.id} className="min-w-[calc(50%-8px)] md:min-w-[calc(50%-8px)] px-2">
              <div className="relative">
                <CreditCard
                  card={card}
                  isActive={
                    (index >= currentIndex && index < currentIndex + cardsPerView) ||
                    (selectedCardId && card.id === selectedCardId)
                  }
                  isSelected={selectedCardId === card.id}
                  onClick={() => onSelectCard(card)}
                />

                {onRemoveCard && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      confirmCardRemoval(card.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: Math.ceil(cards.length / cardsPerView) }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-colors cursor-pointer",
                Math.floor(currentIndex / cardsPerView) === index ? "bg-primary" : "bg-muted",
              )}
              onClick={() => setCurrentIndex(index * cardsPerView)}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex >= cards.length - cardsPerView}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={!!cardToDelete} onOpenChange={(open) => !open && setCardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Card Removal
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this card? This action cannot be undone, and all associated data will be
              lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelCardRemoval}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCardRemoval}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Card
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface CreditCardProps {
  card: CreditCardType
  isActive: boolean
  isSelected?: boolean
  hideDetails?: boolean
  onClick?: () => void
}

export function CreditCard({ card, isActive, isSelected = false, hideDetails = false, onClick }: CreditCardProps) {
  const baseColor = generateColorFromString(`${card.name}-${card.issuer}`)
  const secondaryColor = adjustColor(baseColor, 5)
  const accentColor = adjustColor(baseColor, -8)

  return (
    <Card
      className={cn(
        "p-6 h-56 relative overflow-hidden transition-all duration-300 cursor-pointer",
        isActive ? "scale-100" : "scale-95 opacity-70",
        isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "",
      )}
      style={{
        background: `linear-gradient(135deg, ${baseColor} 0%, ${secondaryColor} 100%)`,
        boxShadow: `inset 0 0 60px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.15)`,
      }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/10 to-transparent" />

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-white/80">Card Issuer</p>
            <p className="font-bold text-white">{card.issuer}</p>
          </div>
          {card.network && (
            <div className="h-8 w-12">
              <CardNetworkLogo network={card.network} />
            </div>
          )}
        </div>

        {!hideDetails && (
          <div className="mt-4">
            <p className="text-xs text-white/80">Card Number</p>
            {card.number ? (
              <p className="font-mono text-white">
                {card.number.toString().slice(0, 4)} {card.number.toString().slice(4, 8)} •••• ••••
              </p>
            ) : (
              <p className="font-mono text-white">•••• •••• •••• ••••</p>
            )}
          </div>
        )}

        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-xs text-white/80">Card Name</p>
            <p className="font-bold text-white">{card.name.replace(card.issuer.replace('Bank', ''), '').replace('Card', '').replace('Credit', '')}</p>
          </div>
          {!hideDetails && card.pointsBalance > 0 && (
            <div className="text-right">
              <p className="text-xs text-white/80">Points</p>
              <p className="font-bold text-white">{card.pointsBalance.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
