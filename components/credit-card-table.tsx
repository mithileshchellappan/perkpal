"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CreditCard, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import type { CreditCardType } from "@/lib/types"
import { AddEditCardModal } from "./add-edit-card-modal"

interface CreditCardTableProps {
  cards: CreditCardType[]
  onEdit: (card: CreditCardType) => void
  onDelete: (id: string) => void
}

export function CreditCardTable({ cards, onEdit, onDelete }: CreditCardTableProps) {
  const [editCard, setEditCard] = useState<CreditCardType | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEdit = (card: CreditCardType) => {
    setEditCard(card)
    setShowEditModal(true)
  }

  const handleSave = (card: CreditCardType) => {
    onEdit(card)
    setShowEditModal(false)
    setEditCard(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Card</TableHead>
            <TableHead>Points Balance</TableHead>
            <TableHead>Cash Value</TableHead>
            <TableHead>Annual Fee</TableHead>
            <TableHead>Rewards Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card) => (
            <TableRow key={card.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: card.color || "#ff6b00" }}
                  >
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{card.name}</div>
                    <div className="text-xs text-muted-foreground">{card.issuer}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{card.pointsBalance.toLocaleString()}</TableCell>
              <TableCell>${card.baseValue.toLocaleString()}</TableCell>
              <TableCell>${card.annualFee}</TableCell>
              <TableCell>{card.rewardsRate}x</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                    card.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {card.status}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(card)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(card.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editCard && (
        <AddEditCardModal open={showEditModal} onOpenChange={setShowEditModal} card={editCard} onSave={handleSave} />
      )}
    </>
  )
}
