"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowUp, PenSquare, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { useUserCards } from "@/hooks/use-user-cards"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import type { Components } from 'react-markdown'

type MessageType = "user" | "system"

interface Message {
  id: string
  content: string
  type: MessageType
  completed?: boolean
  newSection?: boolean
}

export function AiAssistantView() {
  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [hasTyped, setHasTyped] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const shouldFocusAfterStreamingRef = useRef(false)
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const { cards } = useUserCards()
  // Initialize useChat hook
  const { messages: aiMessages, handleInputChange: handleAiInputChange,  append, isLoading, } = useChat({
    api: "/api/chat",
    body: {
      system: `You are a helpful credit card points and rewards assistant.

Your role:
- Provide accurate, up-to-date information about credit cards, points systems, and rewards programs.
- Help users maximize their rewards and points based on their specific cards and location.
- Be concise, direct, and helpful.

User context:
- The user has the following cards: ${cards.map(card =>
        `${card.issuer} ${card.name} (Points Balance: ${card.pointsBalance}, Status: ${card.status}, Rewards Rate: ${card.rewardsRate ?? 0}%)`
      ).join("\n")}.
- The user is located in ${cards[0]?.country ?? "US"}.
- The current date is ${new Date().toLocaleString()}.

Instructions:
- Answer questions about the user's cards, points, and rewards.
- Recommend the best strategies to earn and redeem points.
- If the user asks for a strategy, provide a brief summary followed by a step-by-step list.
- If the user asks for information, provide a concise and direct answer.
- Your answer should be relevant to the user's cards and location.
- Keep your answers short and concise.
    `
    },
    onFinish(message, options) {
      console.log("onFinish", message, options)
    },
  })

  // Check if device is mobile and get viewport height
  useEffect(() => {
    const checkMobileAndViewport = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)

      // Capture the viewport height
      const vh = window.innerHeight
      setViewportHeight(vh)

      // Apply fixed height to main container on mobile
      if (isMobileDevice && mainContainerRef.current) {
        mainContainerRef.current.style.height = `${vh}px`
      }
    }

    checkMobileAndViewport()

    // Set initial height
    if (mainContainerRef.current) {
      mainContainerRef.current.style.height = isMobile ? `${viewportHeight}px` : "100%"
    }

    // Update on resize
    window.addEventListener("resize", checkMobileAndViewport)

    return () => {
      window.removeEventListener("resize", checkMobileAndViewport)
    }
  }, [isMobile, viewportHeight])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (aiMessages.length > 0) {
      setTimeout(() => {
        const scrollContainer = chatContainerRef.current
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
          })
        }
      }, 100)
    }
  }, [aiMessages])

  // Focus the textarea on component mount (only on desktop)
  useEffect(() => {
    if (textareaRef.current && !isMobile) {
      textareaRef.current.focus()
    }
  }, [isMobile])

  // Set focus back to textarea after streaming ends (only on desktop)
  useEffect(() => {
    if (!isLoading && shouldFocusAfterStreamingRef.current && !isMobile) {
      focusTextarea()
      shouldFocusAfterStreamingRef.current = false
    }
  }, [isLoading, isMobile])

  const focusTextarea = () => {
    if (textareaRef.current && !isMobile) {
      textareaRef.current.focus()
    }
  }

  const handleInputContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only focus if clicking directly on the container, not on buttons or other interactive elements
    if (
      e.target === e.currentTarget ||
      (e.currentTarget === inputContainerRef.current && !(e.target as HTMLElement).closest("button"))
    ) {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  // Use our local input state combined with AI hook
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    handleAiInputChange(e)

    if (newValue.trim() !== "" && !hasTyped) {
      setHasTyped(true)
    } else if (newValue.trim() === "" && hasTyped) {
      setHasTyped(false)
    }

    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const newHeight = Math.max(24, Math.min(textarea.scrollHeight, 80))
      textarea.style.height = `${newHeight}px`
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (inputValue.trim() && !isLoading) {
      // Add vibration when message is submitted
      try {
        navigator.vibrate?.(50)
      } catch (e) {
        // Ignore vibration errors
      }

      // Reset input before starting the AI response
      setInputValue("")
      setHasTyped(false)

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }

      // Only focus the textarea on desktop, not on mobile
      if (!isMobile) {
        focusTextarea()
      } else {
        // On mobile, blur the textarea to dismiss the keyboard
        if (textareaRef.current) {
          textareaRef.current.blur()
        }
      }
      append({ content: inputValue, role: "user" })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Cmd+Enter on both mobile and desktop
    if (!isLoading && e.key === "Enter" && e.metaKey) {
      e.preventDefault()
      handleSubmit(e)
      return
    }

    // Only handle regular Enter key (without Shift) on desktop
    if (!isLoading && !isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div ref={mainContainerRef} className="flex pt-4 flex-col h-full w-full bg-background">
      <header className="sticky top-0 h-12 flex items-center px-4 z-20 bg-background border-b">
        <div className="w-full flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h1 className="text-2xl font-medium">Perplexity</h1>
          </div>
        </div>
      </header>

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto px-4 py-4"
        style={{ height: "calc(100% - 12rem)" }}
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {aiMessages.map((message) => (
            <div
              key={message.id}
              className={cn("flex flex-col", message.role === "user" ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2 rounded-2xl",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "text-foreground rounded-bl-none",
                )}
              >
                {message.role === "user" ? (
                  <span>{message.content}</span>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-white prose-headings:text-white prose-strong:text-white prose-a:text-blue-400">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 p-4 bg-background border-t mt-auto">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div
            ref={inputContainerRef}
            className={cn(
              "relative w-full rounded-3xl border bg-background p-2 cursor-text",
              isLoading && "opacity-80",
            )}
            onClick={handleInputContainerClick}
          >
            <div className="pb-6">
              <Textarea
                ref={textareaRef}
                placeholder={isLoading ? "Waiting for response..." : "Ask anything about your cards and points..."}
                className="min-h-[24px] max-h-[80px] w-full rounded-3xl border-0 bg-transparent placeholder:text-muted-foreground placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-2 pr-4 pt-0 pb-0 resize-none overflow-y-auto leading-tight"
                value={inputValue}
                onChange={handleLocalInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  // Ensure the textarea is scrolled into view when focused
                  if (textareaRef.current) {
                    textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                }}
                disabled={isLoading}
              />
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center justify-end">
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full h-8 w-8 border-0 flex-shrink-0 transition-all duration-200",
                    hasTyped ? "bg-primary scale-110" : "bg-muted",
                  )}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <ArrowUp
                    className={cn(
                      "h-4 w-4 transition-colors",
                      hasTyped ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                  />
                  <span className="sr-only">Submit</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
