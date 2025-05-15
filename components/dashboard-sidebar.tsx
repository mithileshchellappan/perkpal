"use client"

import { Home, CreditCard, MessageSquare, BarChart2, Mail, Settings } from "lucide-react"

interface DashboardSidebarProps {
  activeView: string
  onChangeView: (view: string) => void
}

export function DashboardSidebar({ activeView, onChangeView }: DashboardSidebarProps) {
  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-8 border-r border-gray-800">
      <div className="w-10 h-10 bg-green-500 rounded-full mb-8"></div>

      <nav className="flex flex-col items-center space-y-6 flex-1">
        <button
          className={`p-3 rounded-lg ${activeView === "dashboard" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"}`}
          onClick={() => onChangeView("dashboard")}
          aria-label="Dashboard"
        >
          <Home className="h-5 w-5" />
        </button>

        <button
          className={`p-3 rounded-lg ${activeView === "charts" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"}`}
          onClick={() => onChangeView("charts")}
          aria-label="Charts"
        >
          <BarChart2 className="h-5 w-5" />
        </button>

        <button
          className={`p-3 rounded-lg ${activeView === "cards" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"}`}
          onClick={() => onChangeView("cards")}
          aria-label="Cards"
        >
          <CreditCard className="h-5 w-5" />
        </button>

        <button
          className={`p-3 rounded-lg ${activeView === "chat" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"}`}
          onClick={() => onChangeView("chat")}
          aria-label="Chat"
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        <button
          className={`p-3 rounded-lg ${activeView === "mail" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"}`}
          onClick={() => onChangeView("mail")}
          aria-label="Mail"
        >
          <Mail className="h-5 w-5" />
        </button>
      </nav>

      <button
        className="p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  )
}
