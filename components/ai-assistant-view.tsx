"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowUp, PenSquare, Bot, Copy, RefreshCw, ExternalLink, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { useUserCards } from "@/hooks/use-user-cards"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import ContentWithCitations from "./content-with-citation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



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
  const { toast } = useToast()
  const [selectedCards, setSelectedCards] = useState<string[]>(["all"])

  // Get selected cards for the system prompt
  const getSelectedCardsForPrompt = () => {
    if (selectedCards.includes("all")) {
      return cards
    }
    return cards.filter(card => selectedCards.includes(`${card.issuer}-${card.name}`))
  }

  const selectedCardsForPrompt = getSelectedCardsForPrompt()

  const { messages: aiMessages, reload, handleInputChange: handleAiInputChange, append, isLoading, } = useChat({
    api: "/api/chat",
    body: {
      system: `You are a helpful credit card points and rewards assistant.

Your role:
- Provide accurate, up-to-date information about credit cards, points systems, and rewards programs.
- Help users maximize their rewards and points based on their specific cards and location.
- Be concise, direct, and helpful.

User context:
- The user has the following cards: ${selectedCardsForPrompt.map(card =>
        `${card.issuer} ${card.name} (Points Balance: ${card.pointsBalance}, Status: ${card.status}, Rewards Rate: ${card.rewardsRate ?? 0}%)`
      ).join("\n")}.
- The user is located in ${selectedCardsForPrompt[0]?.country ?? "India"}.
- The current date is ${new Date().toLocaleString()}.

Instructions:
- Answer questions about the user's cards, points, and rewards.
- Recommend the best strategies to earn and redeem points.
- If the user asks for a strategy, provide a brief summary followed by a step-by-step list.
- If the user asks for information, provide a concise and direct answer.
- Your answer should be relevant to the user's cards and location.
- Keep your answers short and concise.
- Ensure your answers are always related to the user's card and location.
- Do not provide citations inside tables, alw
    `
    },
    onFinish(message, options) {
      console.log("onFinish", message, options)
    },
  })


  useEffect(() => {
    const checkMobileAndViewport = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)


      const vh = window.innerHeight
      setViewportHeight(vh)


      if (isMobileDevice && mainContainerRef.current) {
        mainContainerRef.current.style.height = `${vh}px`
      }
    }

    checkMobileAndViewport()


    if (mainContainerRef.current) {
      mainContainerRef.current.style.height = isMobile ? `${viewportHeight}px` : "100%"
    }


    window.addEventListener("resize", checkMobileAndViewport)

    return () => {
      window.removeEventListener("resize", checkMobileAndViewport)
    }
  }, [isMobile, viewportHeight])


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


  useEffect(() => {
    if (textareaRef.current && !isMobile) {
      textareaRef.current.focus()
    }
  }, [isMobile])


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

    if (
      e.target === e.currentTarget ||
      (e.currentTarget === inputContainerRef.current && !(e.target as HTMLElement).closest("button"))
    ) {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }


  const sampleQuestions = [
    "Which card should I use to book flights?",
    "Which card should I use to pay my taxes?",
    "How can I maximize my points this month?",
    "What's the best way to redeem my points?",
    "Are there any bonus categories active right now?"
  ]


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
      try {
        navigator.vibrate?.(50)
      } catch (e) {
        
      }
      setInputValue("")
      setHasTyped(false)

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }

      if (!isMobile) {
        focusTextarea()
      } else {
        if (textareaRef.current) {
          textareaRef.current.blur()
        }
      }
      append({ content: inputValue, role: "user" })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

    if (!isLoading && e.key === "Enter" && e.metaKey) {
      e.preventDefault()
      handleSubmit(e)
      return
    }


    if (!isLoading && !isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSampleQuestionClick = (question: string) => {
    setInputValue(question)
    setHasTyped(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.max(24, Math.min(textareaRef.current.scrollHeight, 80))
      textareaRef.current.style.height = `${newHeight}px`


      if (!isMobile) {
        textareaRef.current.focus()
      }
    }
  }

  const { user } = useUser()

  const handleCardSelection = (cardId: string) => {
    if (cardId === "all") {
      setSelectedCards(["all"])
    } else {
      setSelectedCards(prev => {
        const newSelection = prev.filter(id => id !== "all")
        if (newSelection.includes(cardId)) {
          const filtered = newSelection.filter(id => id !== cardId)
          return filtered.length === 0 ? ["all"] : filtered
        } else {
          return [...newSelection, cardId]
        }
      })
    }
  }

  const removeCard = (cardId: string) => {
    setSelectedCards(prev => {
      const filtered = prev.filter(id => id !== cardId)
      return filtered.length === 0 ? ["all"] : filtered
    })
  }

  const getSelectedCardsDisplay = () => {
    if (selectedCards.includes("all")) {
      return "All Cards"
    }
    return selectedCards.length
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Message content has been copied to clipboard.",
          duration: 2000,
        })
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        toast({
          title: "Failed to copy",
          description: "Could not copy the message to clipboard.",
          variant: "destructive",
          duration: 2000,
        })
      })
  }

  return (
    <div ref={mainContainerRef} className="flex pt-4 flex-col h-full w-full">
      <header className="sticky top-0 h-12 flex items-center px-4 z-20 border-b">
        <div className="w-full flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h1 className="text-2xl font-medium">Assistant</h1>
          </div>
        </div>
      </header>

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto px-4 py-4"
        style={{ height: "calc(100% - 12rem)" }}
      >
        {aiMessages.length > 0 ? (
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
                      <div className="prose prose-sm dark:prose-invert max-w-none text-white prose-headings:text-white prose-strong:text-white prose-a:text-blue-400 relative group">
                        <ContentWithCitations content={message.content} sources={message.parts.map((part) => part.type === "source" ? part.source : null).filter((source) => source !== null)} />
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          hidden={isLoading}
                          onClick={() => handleCopyToClipboard(message.content)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full ml-2"
                          hidden={isLoading}
                          onClick={() => reload()}
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Regenerate</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto -mt-16">
            <h2 className="text-3xl font-semibold mb-6">How can I help you, {user?.firstName}? </h2>
            <div className="flex flex-col space-y-4 w-full">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleQuestionClick(question)}
                  className="w-full rounded-md py-2 text-sm text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 p-4 mt-auto">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div
            ref={inputContainerRef}
            className={cn(
              "relative w-full rounded-3xl border p-2 cursor-text",
              isLoading && "opacity-80",
            )}
            onClick={handleInputContainerClick}
          >
            <div className="pt-3 pb-8">
              <Textarea
                ref={textareaRef}
                placeholder={isLoading ? "Waiting for response..." : "Ask anything about your cards and points..."}
                className="min-h-[24px] max-h-[80px] w-full rounded-3xl border-0 bg-transparent placeholder:text-muted-foreground placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-2 pr-4 pt-0 pb-0 resize-none overflow-y-auto leading-tight"
                value={inputValue}
                onChange={handleLocalInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {

                  if (textareaRef.current) {
                    textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                }}
                disabled={isLoading}
              />
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-2">
                {/* Card Selection Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full h-8 w-8 border-0 bg-muted hover:bg-muted/80 flex-shrink-0"
                    >
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Select cards</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem
                      onClick={() => handleCardSelection("all")}
                      className={cn(
                        "cursor-pointer",
                        selectedCards.includes("all") && "bg-accent"
                      )}
                    >
                      All Cards
                      {selectedCards.includes("all") && (
                        <span className="ml-auto text-xs text-muted-foreground">✓</span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {cards.map((card) => {
                      const cardId = `${card.issuer}-${card.name}`
                      const isSelected = selectedCards.includes(cardId)
                      return (
                        <DropdownMenuItem
                          key={cardId}
                          onClick={() => handleCardSelection(cardId)}
                          className={cn(
                            "cursor-pointer",
                            isSelected && "bg-accent"
                          )}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{card.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {card.pointsBalance} points
                            </span>
                          </div>
                          {isSelected && (
                            <span className="ml-auto text-xs text-muted-foreground">✓</span>
                          )}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex-1 overflow-x-auto">
                  {selectedCards.includes("all") ? (
                    <div className="flex items-center px-2">
                      <span className="text-xs text-muted-foreground">All Cards are added in context</span>
                    </div>
                  ) : selectedCards.length > 0 ? (
                    <div className="flex gap-1">
                      {selectedCards.map((cardId) => {
                        const card = cards.find(c => `${c.issuer}-${c.name}` === cardId)
                        if (!card) return null
                        return (
                          <div
                            key={cardId}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs whitespace-nowrap flex-shrink-0"
                          >
                            <span>{card.name.replace("Card", "").replace("Credit", "").replace(card.issuer, "")}</span>
                            <button
                              type="button"
                              onClick={() => removeCard(cardId)}
                              className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </div>

                {/* Submit Button */}
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
