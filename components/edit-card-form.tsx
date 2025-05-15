"use client"

import type React from "react"

import { useState } from "react"
import type { Card } from "@/lib/types"

interface EditCardFormProps {
  card: Card
  onSubmit: (card: Card) => void
  onCancel: () => void
}

export function EditCardForm({ card, onSubmit, onCancel }: EditCardFormProps) {
  const [formData, setFormData] = useState<Card>({ ...card })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      points: Number(formData.points),
      value: Number(formData.value),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Card Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <input
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          className="w-full bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input
            type="text"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            placeholder="MM/YY"
            className="w-full bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Card Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          >
            <option value="VISA">VISA</option>
            <option value="MASTERCARD">MASTERCARD</option>
            <option value="AMEX">AMEX</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Card Color</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            "bg-green-200",
            "bg-blue-200",
            "bg-purple-200",
            "bg-amber-200",
            "bg-red-200",
            "bg-pink-200",
            "bg-indigo-200",
            "bg-cyan-200",
          ].map((color) => (
            <button
              key={color}
              type="button"
              className={`h-8 w-full rounded-md ${color} ${formData.color === color ? "ring-2 ring-white" : ""}`}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Points</label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Value ($)</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
          Save Changes
        </button>
      </div>
    </form>
  )
}
