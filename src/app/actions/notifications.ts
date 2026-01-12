'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { notificationSchema, uuidSchema } from '@/lib/validations'

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
    uuidSchema.parse(userId)
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as Notification[]
}

export async function getUnreadCount(userId: string) {
    uuidSchema.parse(userId)
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
    type: 'appointment_approved' | 'appointment_rejected' | 'appointment_reminder' | 'appointment_created' | 'system'
    title: string
    message: string
    related_appointment_id?: string
}) {
    try {
        // Validate inputs
        const validated = notificationSchema.parse(notification)

        const { data, error } = await supabase
            .from('notifications')
            .insert(validated)
            .select()
            .maybeSingle()

        if (error) {
            console.error("Create notification error:", error);
            throw new Error(`Bildirim oluşturulamadı: ${error.message}`);
        }

        revalidatePath('/dashboard/notifications')
        return data as Notification
    } catch (err: any) {
        console.error("Critical error in createNotification:", err);
        throw err;
    }
}

export async function markAsRead(notificationId: string) {
    uuidSchema.parse(notificationId)
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

    if (error) throw error

    revalidatePath('/dashboard/notifications')
}

export async function markAllAsRead(userId: string) {
    uuidSchema.parse(userId)
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

    if (error) throw error

    revalidatePath('/dashboard/notifications')
}
