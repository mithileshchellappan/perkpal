"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile, Sparkles } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { RecommendedCards } from "./ai-components/recommended-cards"
import { PointsAnalysis } from "./ai-components/points-analysis"
import { SpendingInsights } from "./ai-components/spending-insights"
import type { Message, Card } from "@/lib/types"

interface ChatViewProps {
  cards: Card[]
}

export function ChatView({ cards }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your credit card assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response based on user input
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: "",
      }

      if (input.toLowerCase().includes("recommend") || input.toLowerCase().includes("suggest")) {
        aiResponse.content = "Based on your spending habits, here are some card recommendations:"
        aiResponse.component = "RecommendedCards"
      } else if (input.toLowerCase().includes("points") || input.toLowerCase().includes("rewards")) {
        aiResponse.content = "Here's an analysis of your points across all cards:"
        aiResponse.component = "PointsAnalysis"
      } else if (input.toLowerCase().includes("spend") || input.toLowerCase().includes("transaction")) {
        aiResponse.content = "I've analyzed your recent spending patterns:"
        aiResponse.component = "SpendingInsights"
      } else {
        aiResponse.content =
          "I can help you manage your credit cards, analyze your points, or recommend new cards. Just let me know what you need!"
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold">Chat Assistant</h2>
        <p className="text-gray-400">Ask about your cards, points, or get recommendations</p>
      </div>

      {/* Chat container */}
      <div className="flex flex-col h-full">
        {/* Messages area */}
        <div className="flex-1 bg-gray-800 rounded-lg p-6 mb-4 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                renderComponent={(componentName) => {
                  switch (componentName) {
                    case "RecommendedCards":
                      return <RecommendedCards />
                    case "PointsAnalysis":
                      return <PointsAnalysis />
                    case "SpendingInsights":
                      return <SpendingInsights />
                    default:
                      return null
                  }
                }}
              />
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-700 text-white">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "600ms" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI assistant..."
                className="w-full bg-gray-700 rounded-lg pl-3 pr-10 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-600 text-white"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300">
                <Smile className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-lg bg-green-600 text-white disabled:opacity-50 hover:bg-green-500 transition-colors flex items-center space-x-1"
            >
              {isTyping ? <Sparkles className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 px-2">
            <p>Try asking: "Analyze my points" or "Recommend a new card"</p>
          </div>
        </div>
      </div>
    </div>
  )
}
