export interface Transaction {
  date: string
  amount: number
  category: string
  points: number
}

export interface Card {
  id: string
  name: string
  number: string
  expiry: string
  type: string
  color: string
  points: number
  value: number
  transactions?: Transaction[]
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  component?: string
}
