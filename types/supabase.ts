export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Existing tables
      user_cards: {
        Row: {
          id: string
          user_id: string
          name: string
          issuer: string
          type: string | null
          last_four: string | null
          country: string | null
          rewards_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          issuer: string
          type?: string | null
          last_four?: string | null
          country?: string | null
          rewards_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          issuer?: string
          type?: string | null
          last_four?: string | null
          country?: string | null
          rewards_type?: string | null
          created_at?: string
        }
      }
      // New notification tables
      notifications: {
        Row: {
          id: string
          card_issuer: string
          card_name: string
          notification_type: 'new_offer' | 'transfer_bonus' | 'merchant_offer' | 'seasonal_promotion'
          title: string
          description: string
          start_date: string
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          card_issuer: string
          card_name: string
          notification_type: 'new_offer' | 'transfer_bonus' | 'merchant_offer' | 'seasonal_promotion'
          title: string
          description: string
          start_date: string
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          card_issuer?: string
          card_name?: string
          notification_type?: 'new_offer' | 'transfer_bonus' | 'merchant_offer' | 'seasonal_promotion'
          title?: string
          description?: string
          start_date?: string
          end_date?: string | null
          created_at?: string
        }
      }
      user_notifications: {
        Row: {
          id: string
          user_id: string
          notification_id: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notification_id: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notification_id?: string
          read?: boolean
          created_at?: string
        }
      }
    }
    Functions: {
      get_user_notifications: {
        Args: {
          p_user_id: string
          p_limit?: number
          p_offset?: number
          p_unread_only?: boolean
        }
        Returns: {
          id: string
          notification_id: string
          card_issuer: string
          card_name: string
          notification_type: 'new_offer' | 'transfer_bonus' | 'merchant_offer' | 'seasonal_promotion'
          title: string
          description: string
          start_date: string
          end_date: string | null
          read: boolean
          created_at: string
        }[]
      }
      is_similar_notification: {
        Args: {
          p_card_issuer: string
          p_card_name: string
          p_title: string
          p_type: 'new_offer' | 'transfer_bonus' | 'merchant_offer' | 'seasonal_promotion'
        }
        Returns: string | null
      }
    }
    Enums: {
      notification_type: 'new_offer' | 'transfer_bonus' | 'merchant_offer' | 'seasonal_promotion'
    }
  }
} 