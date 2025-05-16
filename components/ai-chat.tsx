"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, X, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AiChat() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your credit card points assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you maximize your credit card points! Would you like some tips?",
        "Based on your cards, you could earn more points by using your Sapphire card for dining and travel.",
        "Did you know you can transfer your points to airline partners for better value?",
        "Your points are worth approximately $2,623.42 at current redemption rates.",
        "I recommend redeeming your points for travel to get the best value.",
      ]

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isMinimized])

  return (
    <Card className="fixed bottom-4 right-4 w-[400px] shadow-lg border-primary/20 overflow-hidden">
      <CardHeader className="p-3 flex flex-row items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-[350px] p-4">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-3 max-w-[90%]", message.role === "user" ? "ml-auto" : "mr-auto")}
                  >
                    {message.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={cn("space-y-1", message.role === "user" ? "text-right" : "text-left")}>
                      <p className="text-xs text-muted-foreground">
                        {message.role === "user" ? "You" : "AI Assistant"}
                      </p>
                      <div className={cn("text-sm", message.role === "user" ? "text-foreground" : "text-foreground")}>
                        {message.content}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 max-w-[90%]">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">AI Assistant</p>
                      <div className="flex gap-1 items-center h-6">
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                        <span
                          className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <div className="flex w-full gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your points..."
                className="flex-1 bg-background/50 border-primary/20 focus-visible:ring-primary/30"
              />
              <Button size="icon" onClick={handleSend} disabled={!input.trim() || isTyping} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
