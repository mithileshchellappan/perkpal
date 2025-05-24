import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import type { 
  Notification, 
  GetNotificationsResponse, 
  MarkAsReadResponse 
} from '@/types/notifications'

interface UseNotificationsOptions {
  limit?: number;
  refreshInterval?: number;
  autoRefresh?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { limit = 10, refreshInterval = 60000, autoRefresh = true } = options
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { isSignedIn } = useAuth()

  const fetchNotifications = useCallback(async (unreadOnly: boolean = false) => {
    if (!isSignedIn) {
      setNotifications([])
      setUnreadCount(0)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/notifications?limit=${limit}&unread_only=${unreadOnly}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data: GetNotificationsResponse = await response.json()
      console.log('data', data)
      if (data.success) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      } else {
        throw new Error(data.success ? 'Failed to parse notifications' : 'Failed to fetch notifications')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      console.error('Error fetching notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isSignedIn, limit])

  const markAsRead = useCallback(async (notificationIds?: string[]) => {
    if (!isSignedIn) return false

    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds,
          markAllAsRead: !notificationIds,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read')
      }

      const data: MarkAsReadResponse = await response.json()

      if (data.success) {
        // Update local state to mark the notifications as read
        if (notificationIds) {
          setNotifications(prev =>
            prev.map(notification =>
              notificationIds.includes(notification.id)
                ? { ...notification, read: true }
                : notification
            )
          )
          // Update unread count
          const markedCount = notificationIds.length
          setUnreadCount(prev => Math.max(0, prev - markedCount))
        } else {
          // Mark all as read
          setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
          )
          setUnreadCount(0)
        }
        return true
      } else {
        throw new Error('Failed to mark notifications as read')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      console.error('Error marking notifications as read:', err)
      toast.error(errorMessage)
      return false
    }
  }, [isSignedIn])

  // Initial fetch
  useEffect(() => {
    if (isSignedIn) {
      fetchNotifications(true)
    }
  }, [isSignedIn, fetchNotifications])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !isSignedIn) return undefined

    const intervalId = setInterval(() => {
      fetchNotifications()
    }, refreshInterval)

    return () => clearInterval(intervalId)
  }, [fetchNotifications, refreshInterval, autoRefresh, isSignedIn])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    refresh: () => fetchNotifications(),
    fetchUnreadOnly: () => fetchNotifications(true),
  }
} 