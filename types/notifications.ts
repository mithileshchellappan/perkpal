// Notification type enum
export type NotificationType = 'new_offer' | 'transfer_bonus' | 'merchant_offer' | 'seasonal_promotion';

// Basic notification structure
export interface Notification {
  id: string;
  notification_id: string;
  card_issuer: string;
  card_name: string;
  notification_type: NotificationType;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  read: boolean;
  created_at: string;
}

// API response for getting notifications
export interface GetNotificationsResponse {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
}

// Request for marking notifications as read
export interface MarkAsReadRequest {
  notificationIds?: string[];
  markAllAsRead?: boolean;
}

// Response for marking notifications as read
export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

// Perplexity API offer response
export interface CardOfferResult {
  type: NotificationType;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
} 