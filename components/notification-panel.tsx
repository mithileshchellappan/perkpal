"use client"

import { useState, useMemo } from "react"
import { Bell, Check, Info, AlertTriangle, TrendingUp, Gift, CreditCard, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/use-notifications"
import { Loader2 } from "lucide-react"
import type { Notification as NotificationType } from "@/types/notifications"

interface NotificationPanelProps {
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

export function NotificationPanel({ className }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    refresh
  } = useNotifications({
    limit: 20,
    refreshInterval: 60000 * 5, // 5 minutes
    autoRefresh: true
  })

  // Handle marking all as read
  const handleMarkAllAsRead = async () => {
    await markAsRead()
  }

  // Handle marking a single notification as read
  const handleMarkAsRead = async (id: string) => {
    await markAsRead([id])
  }

  // Handle removing a notification (just mark it as read for now)
  const handleRemoveNotification = async (id: string) => {
    await markAsRead([id])
  }

  // Get the appropriate icon based on notification type
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
      default:
        return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  // When the dropdown is opened, refresh notifications
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      refresh()
    }
  }

  // Create a sorted version of notifications (most recent first)
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [notifications])

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 md:w-96 bg-background border-border" forceMount>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">Notifications</h3>
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

          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sortedNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No notifications</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(80vh-8rem)] max-h-80">
              <div className="flex flex-col gap-1 p-1">
                {sortedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted",
                      !notification.read && "bg-muted/50",
                    )}
                  >
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</h4>
                        <div className="flex items-center gap-1">
                          <time className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.created_at)}
                          </time>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                            onClick={() => handleRemoveNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Dismiss</span>
                          </Button>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{notification.description}</p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-auto p-0 text-xs text-muted-foreground"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-xs text-muted-foreground"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
