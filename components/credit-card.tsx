"use client"

import type { Card } from "@/lib/types"
import { Trash2 } from "lucide-react"

interface CreditCardProps {
  card: Card
  onClick: () => void
  onDelete: () => void
}

export function CreditCard({ card, onClick, onDelete }: CreditCardProps) {
  return (
    <div
      className={`${card.color} rounded-lg p-4 h-40 flex flex-col justify-between cursor-pointer relative group`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-700 uppercase">NAME</p>
          <p className="font-medium">{card.name}</p>
        </div>
        <div className="w-8 h-6">
          <div className="w-6 h-6 bg-gray-800 rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">{card.number}</p>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-xs text-gray-700">Exp {card.expiry}</p>
          </div>
          <div>
            <p className="font-bold text-lg">{card.type}</p>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
