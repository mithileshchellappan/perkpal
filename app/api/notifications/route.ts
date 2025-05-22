import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch user notifications
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)
  const unreadOnly = searchParams.get('unread_only') === 'true'

  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: userNotifications, error: userNotificationsError } = await supabase
      .from('user_notifications')
      .select('*, notifications(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

      if (userNotificationsError) {
      console.error('Error fetching notifications:', userNotificationsError)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch notifications' },
        { status: 500 }
      )
    }

    const notifications = userNotifications.map(un => ({
      id: un.id,
      notification_id: un.notification_id,
      card_issuer: un.notifications.card_issuer,
      card_name: un.notifications.card_name,
      notification_type: un.notifications.notification_type,
      title: un.notifications.title,
      description: un.notifications.description,
      start_date: un.notifications.start_date,
      end_date: un.notifications.end_date,
      read: un.read,
      created_at: un.created_at
    }))

    const { count, error: countError } = await supabase
      .from('user_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (countError) {
      console.error('Error counting unread notifications:', countError)
    }

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: count || 0
    })
  } catch (error) {
    console.error('Unexpected error in notifications API:', error)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request: Request) {
  try {
    // Get userId from Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Handle marking all as read
    if (body.markAllAsRead) {
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) {
        console.error('Error marking all notifications as read:', error)
        return NextResponse.json(
          { success: false, message: 'Failed to mark notifications as read' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }
    
    // Handle marking specific notification(s) as read
    if (body.notificationIds && Array.isArray(body.notificationIds)) {
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .in('id', body.notificationIds)

      if (error) {
        console.error('Error marking notifications as read:', error)
        return NextResponse.json(
          { success: false, message: 'Failed to mark notifications as read' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: 'Notifications marked as read' })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Unexpected error in notifications API:', error)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 