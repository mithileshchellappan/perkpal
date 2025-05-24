"use client"

import { useState, useMemo } from "react"
import { Check, Info, AlertTriangle, TrendingUp, TrendingDown, Gift, CreditCard, X, DollarSign, Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/use-notifications"
import { Loader2 } from "lucide-react"
import type { Notification as NotificationType } from "@/types/notifications"

interface NotificationsContainerProps {
  className?: string
}

// Function to format a timestamp relative to now
function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
}

export function NotificationsContainer({ className }: NotificationsContainerProps) {
  const [selectedCard, setSelectedCard] = useState<string>("all")
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    refresh
  } = useNotifications({
    limit: 20,
    refreshInterval: 60000 * 5,
    autoRefresh: true,
  })

  const handleMarkAllAsRead = async () => {
    await markAsRead()
  }

  const handleMarkAsRead = async (id: string) => {
    await markAsRead([id])
  }

  const handleRemoveNotification = async (id: string) => {
    await markAsRead([id])
  }

  const getNotificationIcon = (type: NotificationType['notification_type']) => {
    switch (type) {
      case "new_offer":
        return <Gift className="h-4 w-4 text-purple-400" />
      case "transfer_bonus":
        return <TrendingUp className="h-4 w-4 text-primary" />
      case "merchant_offer":
        return <CreditCard className="h-4 w-4 text-gray-400" />
      case "seasonal_promotion":
        return <Info className="h-4 w-4 text-blue-400" />
      case "lounge_access_removal":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "rewards_rate_reduction":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      case "annual_fee_increase":
        return <DollarSign className="h-4 w-4 text-orange-400" />
      case "benefits_discontinued":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "program_changes":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />
      case "expiring_offers":
        return <Clock className="h-4 w-4 text-yellow-400" />
      default:
        return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  const uniqueCards = useMemo(() => {
    const cardSet = new Set<string>()
    notifications.forEach(notification => {
      const cardKey = `${notification.card_issuer}|${notification.card_name}`
      cardSet.add(cardKey)
    })
    return Array.from(cardSet).map(cardKey => {
      const [issuer, name] = cardKey.split('|')
      return { key: cardKey, issuer, name }
    })
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    let filtered = notifications
    
    if (selectedCard !== "all") {
      const [selectedIssuer, selectedName] = selectedCard.split('|')
      filtered = notifications.filter(notification => 
        notification.card_issuer === selectedIssuer && notification.card_name === selectedName
      )
    }
    
    return filtered.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [notifications, selectedCard])


  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Your Card Updates
            {unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {uniqueCards.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    {selectedCard === "all" 
                      ? "All Cards" 
                      : `${uniqueCards.find(card => card.key === selectedCard)?.name?.replace("Credit Card", "").replace("Card", "").trim() || "Selected Card"}`
                    }
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => setSelectedCard("all")}
                    className={cn(selectedCard === "all" && "bg-accent")}
                  >
                    All Cards
                  </DropdownMenuItem>
                  {uniqueCards.map((card) => (
                    <DropdownMenuItem 
                      key={card.key}
                      onClick={() => setSelectedCard(card.key)}
                      className={cn(selectedCard === card.key && "bg-accent")}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {card.name.replace(card.issuer.replace("Bank", ""), "").replace("Credit Card", "").replace("Card", "").trim()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {card.issuer.replace("Bank", "").trim()}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground"
                onClick={handleMarkAllAsRead}
              >
                <Check className="mr-1 h-3 w-3" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            <ScrollArea className="h-[300px]">
              <div className="flex flex-col gap-2 pr-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted border",
                      !notification.read && "bg-muted/50 border-primary/20",
                      notification.source_url && "cursor-pointer hover:bg-muted/70"
                    )}
                    onClick={() => {
                      if (notification.source_url) {
                        window.open(notification.source_url, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</h5>
                        <div className="flex items-center gap-1">
                          <time className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.created_at)}
                          </time>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Dismiss</span>
                          </Button>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{notification.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-muted-foreground"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Mark as read
                            </Button>
                          )}
                        </div>
                        {selectedCard === "all" && (
                          <span className="text-xs text-muted-foreground font-medium">
                            {notification.card_name.replace("Credit Card", "").replace("Card", "").trim()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 