'use server'

import { supabase, supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'
import { appointmentSchema, uuidSchema } from '@/lib/validations'

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
    uuidSchema.parse(tenantId)
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
    uuidSchema.parse(userId)
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
    created_by?: string | null
}) {
    try {
        // Validate inputs
        const validated = appointmentSchema.parse({
            ...appointment,
            service_id: appointment.service_id || undefined,
            created_by: appointment.created_by || undefined
        })

        // Also validate IDs
        uuidSchema.parse(appointment.tenant_id)
        if (appointment.created_by) uuidSchema.parse(appointment.created_by)

        const { data, error } = await supabaseAdmin
            .from('appointments')
            .insert({
                tenant_id: appointment.tenant_id,
                customer_id: validated.customer_id,
                service_id: validated.service_id,
                start_time: validated.start_time.toISOString(),
                end_time: validated.end_time.toISOString(),
                notes: validated.notes,
                created_by: appointment.created_by || null,
                status: 'pending'
            })
            .select()
            .maybeSingle()

        if (error) {
            console.error("Create appointment error:", error);
            throw new Error(`Randevu oluşturulamadı: ${error.message}`);
        }

        if (!data) throw new Error("Randevu oluşturuldu ancak veri geri alınamadı.");

        // Create notification for business owner
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('tenant_id', appointment.tenant_id)
            .eq('role', 'owner')
            .maybeSingle()

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
    } catch (err: any) {
        console.error("Critical error in createAppointment:", err);
        throw err;
    }
}

export async function approveAppointment(appointmentId: string) {
    try {
        uuidSchema.parse(appointmentId)
        const { data, error } = await supabaseAdmin
            .from('appointments')
            .update({ status: 'confirmed' })
            .eq('id', appointmentId)
            .select()
            .maybeSingle()

        if (error) {
            console.error("Approve appointment error:", error);
            throw new Error(`Randevu onaylanamadı: ${error.message}`);
        }

        if (!data) {
            throw new Error("Randevu bulunamadı veya yetkiniz yok (Service Key eksik olabilir).");
        }

        // Create notification for customer
        if (data.created_by) {
            try {
                await createNotification({
                    user_id: data.created_by,
                    type: 'appointment_approved',
                    title: 'Randevu Onaylandı',
                    message: 'Randevunuz onaylandı! Takvim sayfanızdan detayları görebilirsiniz.',
                    related_appointment_id: appointmentId
                })
            } catch (notifyErr) {
                console.warn("Notification failed, but appointment updated:", notifyErr);
            }
        }

        revalidatePath('/dashboard/appointments')
        revalidatePath('/dashboard/calendar')
        revalidatePath('/dashboard')
        return data as Appointment
    } catch (err: any) {
        console.error("Critical error in approveAppointment:", err);
        throw err;
    }
}

export async function rejectAppointment(appointmentId: string, reason?: string) {
    try {
        uuidSchema.parse(appointmentId)
        const { data, error } = await supabaseAdmin
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', appointmentId)
            .select()
            .maybeSingle()

        if (error) {
            console.error("Reject appointment error:", error);
            throw new Error(`Randevu reddedilemedi: ${error.message}`);
        }

        if (!data) {
            throw new Error("Randevu bulunamadı veya yetkiniz yok (Service Key eksik olabilir).");
        }

        // Create notification for customer
        if (data.created_by) {
            try {
                await createNotification({
                    user_id: data.created_by,
                    type: 'appointment_rejected',
                    title: 'Randevu Reddedildi',
                    message: reason || 'Randevunuz red edildi. Lütfen başka bir saat seçiniz.',
                    related_appointment_id: appointmentId
                })
            } catch (notifyErr) {
                console.warn("Notification failed, but appointment updated:", notifyErr);
            }
        }

        revalidatePath('/dashboard/appointments')
        revalidatePath('/dashboard/calendar')
        revalidatePath('/dashboard')
        return data as Appointment
    } catch (err: any) {
        console.error("Critical error in rejectAppointment:", err);
        throw err;
    }
}

export async function cancelAppointment(appointmentId: string) {
    try {
        uuidSchema.parse(appointmentId)
        const { data, error } = await supabaseAdmin
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', appointmentId)
            .select()
            .maybeSingle()

        if (error) throw error
        if (!data) throw new Error("Randevu bulunamadı.");

        revalidatePath('/dashboard/appointments')
        revalidatePath('/dashboard/calendar')
        revalidatePath('/dashboard')
        return data as Appointment
    } catch (err: any) {
        console.error("Critical error in cancelAppointment:", err);
        throw err;
    }
}

export async function deleteAppointment(appointmentId: string) {
    try {
        uuidSchema.parse(appointmentId)
        const { error } = await supabaseAdmin
            .from('appointments')
            .delete()
            .eq('id', appointmentId)

        if (error) throw error

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/calendar')
        revalidatePath('/dashboard/appointments')
        return true
    } catch (err: any) {
        console.error("Critical error in deleteAppointment:", err);
        throw err;
    }
}
