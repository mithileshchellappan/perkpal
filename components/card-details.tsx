"use client"

import { useState } from "react"
import type { Card } from "@/lib/types"
import { Edit, Trash2, X, Plus } from "lucide-react"
import { EditCardForm } from "./edit-card-form"
import { AnimatePresence, motion } from "framer-motion"

interface CardDetailsProps {
  card: Card | null
  onClose: () => void
  onEdit: (card: Card) => void
  onDelete: (id: string) => void
}

export function CardDetails({ card, onClose, onEdit, onDelete }: CardDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (!card) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Details card</h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-700">
              <Plus className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Select a card to view details</p>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Card</h2>
            <button onClick={() => setIsEditing(false)} className="p-2 rounded-full bg-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <EditCardForm
            card={card}
            onSubmit={(updatedCard) => {
              onEdit(updatedCard)
              setIsEditing(false)
            }}
            onCancel={() => setIsEditing(false)}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Card Details</h2>
          <div className="flex space-x-2">
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
              <Edit className="h-5 w-5" />
            </button>
            <button onClick={() => onDelete(card.id)} className="p-2 rounded-full bg-gray-700 hover:bg-red-600">
              <Trash2 className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="p-2 rounded-full bg-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className={`${card.color} rounded-lg p-4 mb-6 aspect-[1.6/1]`}>
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

          <div className="mt-auto">
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
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs text-gray-500 uppercase mb-2">Card Number</h3>
            <p className="text-lg font-semibold">8465 3481 4985 4080</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2">Expire Date</h3>
              <p className="font-semibold">08/28</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2">CVV</h3>
              <p className="font-semibold">848</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2">Level</h3>
              <p className="font-semibold">02</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs text-gray-500 uppercase mb-2">Points Balance</h3>
            <p className="text-xl font-bold">{card.points.toLocaleString()} pts</p>
            <p className="text-sm text-green-400">≈ ${card.value.toLocaleString()}</p>
          </div>

          <div>
            <h3 className="text-xs text-gray-500 uppercase mb-2">Spending limits</h3>
            <p className="text-sm text-gray-500 uppercase mb-2">Daily Transaction Limit</p>

            <div className="mb-2">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-1/5"></div>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <p>$400.00 spent of $2,000.00</p>
              <p>20%</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
