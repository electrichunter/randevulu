'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface Notification {
    id: string
    user_id: string
    type: string
    title: string
    message: string
    related_appointment_id: string | null
    read: boolean
    created_at: string
}

export async function getNotificationsByUser(userId: string) {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as Notification[]
}

export async function getUnreadCount(userId: string) {
    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)

    if (error) throw error
    return count || 0
}

export async function createNotification(notification: {
    user_id: string
    type: string
    title: string
    message: string
    related_appointment_id?: string
}) {
    const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single()

    if (error) throw error

    revalidatePath('/dashboard/notifications')
    return data as Notification
}

export async function markAsRead(notificationId: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

    if (error) throw error

    revalidatePath('/dashboard/notifications')
}

export async function markAllAsRead(userId: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

    if (error) throw error

    revalidatePath('/dashboard/notifications')
}
