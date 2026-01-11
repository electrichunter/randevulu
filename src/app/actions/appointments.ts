'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

export interface Appointment {
    id: string
    tenant_id: string
    customer_id: string
    service_id: string | null
    start_time: string
    end_time: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    notes: string | null
    created_at: string
    created_by: string | null
}

export async function getAppointmentsByTenant(tenantId: string) {
    const { data, error } = await supabase
        .from('appointments')
        .select(`
      *,
      customers (full_name, phone),
      services (name, duration_minutes, price)
    `)
        .eq('tenant_id', tenantId)
        .order('start_time', { ascending: true })

    if (error) throw error
    return data
}

export async function getAppointmentsByUser(userId: string) {
    // Müşteri kendi randevularını görür
    const { data, error } = await supabase
        .from('appointments')
        .select(`
      *,
      tenants (name),
      services (name, duration_minutes, price)
    `)
        .eq('created_by', userId)
        .order('start_time', { ascending: true })

    if (error) throw error
    return data
}

export async function createAppointment(appointment: {
    tenant_id: string
    customer_id: string
    service_id?: string
    start_time: string
    end_time: string
    notes?: string
    created_by: string
}) {
    const { data, error } = await supabase
        .from('appointments')
        .insert({
            ...appointment,
            status: 'pending'
        })
        .select()
        .single()

    if (error) throw error

    // Create notification for business owner
    // (İşletme sahibine randevu talebi bildirimi gönder)
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('tenant_id', appointment.tenant_id)
        .eq('role', 'owner')
        .single()

    if (profile) {
        await createNotification({
            user_id: profile.id,
            type: 'appointment_created',
            title: 'Yeni Randevu Talebi',
            message: 'Yeni bir randevu talebi aldınız. Onaylamak için randevular bölümüne gidin.',
            related_appointment_id: data.id
        })
    }

    revalidatePath('/dashboard/appointments')
    return data as Appointment
}

export async function approveAppointment(appointmentId: string) {
    const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId)
        .select()
        .single()

    if (error) throw error

    // Create notification for customer
    if (data.created_by) {
        await createNotification({
            user_id: data.created_by,
            type: 'appointment_approved',
            title: 'Randevu Onaylandı',
            message: 'Randevunuz onaylandı! Takvim sayfanızdan detayları görebilirsiniz.',
            related_appointment_id: appointmentId
        })
    }

    revalidatePath('/dashboard/appointments')
    revalidatePath('/dashboard/calendar')
    return data as Appointment
}

export async function rejectAppointment(appointmentId: string, reason?: string) {
    const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .select()
        .single()

    if (error) throw error

    // Create notification for customer
    if (data.created_by) {
        await createNotification({
            user_id: data.created_by,
            type: 'appointment_rejected',
            title: 'Randevu Reddedildi',
            message: reason || 'Randevunuz red edildi. Lütfen başka bir saat seçiniz.',
            related_appointment_id: appointmentId
        })
    }

    revalidatePath('/dashboard/appointments')
    revalidatePath('/dashboard/calendar')
    return data as Appointment
}

export async function cancelAppointment(appointmentId: string) {
    const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .select()
        .single()

    if (error) throw error

    revalidatePath('/dashboard/appointments')
    revalidatePath('/dashboard/calendar')
    return data as Appointment
}
