'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { serviceSchema, uuidSchema } from '@/lib/validations'

export interface Service {
    id: string
    tenant_id: string
    name: string
    duration_minutes: number
    price: number
    currency: string
    created_at: string
}

export async function getServicesByTenant(tenantId: string) {
    uuidSchema.parse(tenantId)
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data as Service[]
}

export async function createService(tenantId: string, service: {
    name: string
    duration_minutes: number
    price: number
    currency?: string
}) {
    try {
        // Validate inputs
        uuidSchema.parse(tenantId)
        const validated = serviceSchema.parse(service)

        const { data, error } = await supabase
            .from('services')
            .insert({
                tenant_id: tenantId,
                ...validated
            })
            .select()
            .maybeSingle()

        if (error) {
            console.error("Create service error:", error);
            throw new Error(`Hizmet oluşturulamadı: ${error.message}`);
        }

        revalidatePath('/dashboard/settings')
        return data as Service
    } catch (err: any) {
        console.error("Critical error in createService:", err);
        throw err;
    }
}

export async function updateService(serviceId: string, updates: {
    name?: string
    duration_minutes?: number
    price?: number
}) {
    try {
        // Validate inputs
        uuidSchema.parse(serviceId)
        // Partial validation for updates
        const validated = serviceSchema.partial().parse(updates)

        const { data, error } = await supabase
            .from('services')
            .update(validated)
            .eq('id', serviceId)
            .select()
            .maybeSingle()

        if (error) {
            console.error("Update service error:", error);
            throw new Error(`Hizmet güncellenemedi: ${error.message}`);
        }

        if (!data) throw new Error("Hizmet bulunamadı.");

        revalidatePath('/dashboard/settings')
        return data as Service
    } catch (err: any) {
        console.error("Critical error in updateService:", err);
        throw err;
    }
}

export async function deleteService(serviceId: string) {
    uuidSchema.parse(serviceId)
    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

    if (error) throw error

    revalidatePath('/dashboard/settings')
}
