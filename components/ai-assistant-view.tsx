"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowUp, PenSquare, Bot, Copy, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { useUserCards } from "@/hooks/use-user-cards"
import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm';
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"

type MessageType = "user" | "system"

interface Message {
  id: string
  content: string
  type: MessageType
  completed?: boolean
  newSection?: boolean
  sources?: Array<{ url: string; title?: string }>
}


function CitationButton({ 
  number, 
  source, 
  onClick 
}: { 
  number: number
  source?: { url: string; title?: string }
  onClick?: () => void 
}) {
  const handleClick = () => {
    if (source?.url) {
      window.open(source.url, '_blank', 'noopener,noreferrer')
    }
    onClick?.()
  }


  const getWebsiteInfo = (url: string) => {
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname
      const websiteName = domain.replace('www.', '').split('.')[0]
      const capitalizedName = websiteName.charAt(0).toUpperCase() + websiteName.slice(1)
      return {
        domain,
        name: capitalizedName,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
      }
    } catch {
      return {
        domain: url,
        name: 'Unknown Source',
        favicon: null
      }
    }
  }

  const websiteInfo = source?.url ? getWebsiteInfo(source.url) : null
  if (!source?.url) {

    return (
      <sup>
        <button
          onClick={handleClick}
          className="inline-flex items-center justify-center w-4 h-4 mx-0.5 text-[0.6rem] font-mono text-white dark:text-gray-900 bg-gray-800 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border rounded transition-colors duration-200 cursor-pointer"
          title={`Source ${number}`}
        >
          {number}
        </button>
      </sup>
    )
  }

  return (
    <sup>
      <HoverCard>
        <HoverCardTrigger asChild>
          <button
            onClick={handleClick}
            className="inline-flex items-center justify-center w-4 h-4 mx-0.5 text-[0.6rem] font-mono text-white dark:text-gray-900 bg-gray-800 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border rounded transition-colors duration-200 cursor-pointer"
            title={source?.title || source?.url || `Source ${number}`}
          >
            {number}
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-3" side="top">
          <div className="flex items-center space-x-3">
            {websiteInfo?.favicon && (
              <img 
                src={websiteInfo.favicon} 
                alt={`${websiteInfo.name} favicon`}
                className="w-4 h-4 flex-shrink-0"
                onError={(e) => {

                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {source.title || websiteInfo?.name || 'Source'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {websiteInfo?.domain}
              </p>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          </div>
        </HoverCardContent>
      </HoverCard>
    </sup>
  )
}


function ContentWithCitations({ 
  content, 
  sources = [] 
}: { 
  content: string
  sources?: Array<{ url: string; title?: string }>
}) {
  const components = {
    p: ({ children }: { children: React.ReactNode }) => {
      const textContent = React.Children.toArray(children).join('')
      
      if (typeof textContent === 'string' && /\[\d+\]/.test(textContent)) {
        return <div>{parseTextWithCitations(textContent)}</div>
      }
      
      return <p>{children}</p>
    },
    td: ({ children }: { children: React.ReactNode }) => {
      const textContent = React.Children.toArray(children).join('')
      
      if (typeof textContent === 'string' && /\[\d+\]/.test(textContent)) {
        return <td>{parseTextWithCitations(textContent)}</td>
      }
      
      return <td>{children}</td>
    },
    th: ({ children }: { children: React.ReactNode }) => {
      const textContent = React.Children.toArray(children).join('')
      
      if (typeof textContent === 'string' && /\[\d+\]/.test(textContent)) {
        return <th>{parseTextWithCitations(textContent)}</th>
      }
      
      return <th>{children}</th>
    }
  }

  const parseTextWithCitations = (text: string) => {
    const citationRegex = /\[(\d+)\]/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = citationRegex.exec(text)) !== null) {

      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index)
        if (beforeText) {
          parts.push(<span key={`text-${lastIndex}`}>{beforeText}</span>)
        }
      }


      const citationNumber = parseInt(match[1])
              const source = sources[citationNumber - 1]
      parts.push(
        <CitationButton
          key={`citation-${match.index}`}
          number={citationNumber}
          source={source}
        />
      )

      lastIndex = match.index + match[0].length
    }


    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex)
      if (remainingText) {
        parts.push(<span key={`text-${lastIndex}`}>{remainingText}</span>)
      }
    }

    return parts.length > 0 ? parts : text
  }

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
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
  const { toast } = useToast()

  const { messages: aiMessages, reload, handleInputChange: handleAiInputChange, append, isLoading, } = useChat({
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
- The user is located in ${cards[0]?.country ?? "India"}.
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

      <div className="sticky bottom-0 p-4 border-t mt-auto">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div
            ref={inputContainerRef}
            className={cn(
              "relative w-full rounded-3xl border p-2 cursor-text",
              isLoading && "opacity-80",
            )}
            onClick={handleInputContainerClick}
          >
            <div className="pt-3 pb-6">
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
