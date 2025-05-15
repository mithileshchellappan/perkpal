"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import type { Card } from "@/lib/types"
import { CreditCard } from "./credit-card"
import { motion } from "framer-motion"

interface CreditCardCarouselProps {
  cards: Card[]
  onSelectCard: (card: Card) => void
  onAddCard: () => void
  onDeleteCard: (id: string) => void
}

export function CreditCardCarousel({ cards, onSelectCard, onAddCard, onDeleteCard }: CreditCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [cardsPerPage, setCardsPerPage] = useState(1)
  const totalPages = Math.ceil((cards.length + 1) / cardsPerPage) // +1 for the Add Card button

  const nextPage = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0))
    setScrollLeft(carouselRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2 // Scroll speed multiplier
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    // Snap to nearest card after dragging
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / cardsPerPage
      const scrollPosition = carouselRef.current.scrollLeft
      const newIndex = Math.round(scrollPosition / cardWidth)
      setCurrentIndex(Math.min(Math.max(newIndex, 0), totalPages - 1))
    }
  }

  // Update scroll position when currentIndex changes
  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / cardsPerPage
      carouselRef.current.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth",
      })
    }
  }, [currentIndex, cardsPerPage])

  useEffect(() => {
    // Function to update cardsPerPage based on window width
    const updateCardsPerPage = () => {
      setCardsPerPage(window.innerWidth >= 1024 ? 2 : 1)
    }
    updateCardsPerPage()
    window.addEventListener("resize", updateCardsPerPage)
    return () => window.removeEventListener("resize", updateCardsPerPage)
  }, [])

  // Calculate visible cards and whether to show the Add Card button
  const startIdx = currentIndex * cardsPerPage
  const visibleCards = cards.slice(startIdx, startIdx + cardsPerPage)
  const showAddCardButton =
    visibleCards.length < cardsPerPage ||
    (startIdx + cardsPerPage >= cards.length && (cards.length % cardsPerPage !== 0 || currentIndex === totalPages - 1))

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <motion.div
          className="flex space-x-4 min-w-full"
          initial={false}
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {cards.map((card) => (
            <div key={card.id} className={`${cardsPerPage === 1 ? "w-full" : "w-1/2"} flex-shrink-0`}>
              <CreditCard card={card} onClick={() => onSelectCard(card)} onDelete={() => onDeleteCard(card.id)} />
            </div>
          ))}

          <div className={`${cardsPerPage === 1 ? "w-full" : "w-1/2"} flex-shrink-0`}>
            <button
              onClick={onAddCard}
              className="h-40 w-full rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Plus className="h-8 w-8 mb-2" />
                <span>Add Card</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {totalPages > 1 && (
        <div className="absolute right-0 -top-12 flex space-x-2">
          <button
            onClick={prevPage}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-gray-700 disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextPage}
            disabled={currentIndex === totalPages - 1}
            className="p-2 rounded-full bg-gray-700 disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`mx-1 h-2 w-2 rounded-full ${currentIndex === index ? "bg-white" : "bg-gray-600"}`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
