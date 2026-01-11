'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

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
    const { data, error } = await supabase
        .from('services')
        .insert({
            tenant_id: tenantId,
            name: service.name,
            duration_minutes: service.duration_minutes,
            price: service.price,
            currency: service.currency || 'TRY'
        })
        .select()
        .single()

    if (error) throw error

    revalidatePath('/dashboard/settings')
    return data as Service
}

export async function updateService(serviceId: string, updates: {
    name?: string
    duration_minutes?: number
    price?: number
}) {
    const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', serviceId)
        .select()
        .single()

    if (error) throw error

    revalidatePath('/dashboard/settings')
    return data as Service
}

export async function deleteService(serviceId: string) {
    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

    if (error) throw error

    revalidatePath('/dashboard/settings')
}
