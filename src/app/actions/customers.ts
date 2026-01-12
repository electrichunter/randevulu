'use server'

import { supabase, supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { customerSchema, uuidSchema } from '@/lib/validations'

export async function getCustomersByTenant(tenantId: string) {
    uuidSchema.parse(tenantId)
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('full_name', { ascending: true })

    if (error) throw error
    return data
}

export async function createCustomer(customer: {
    tenant_id: string
    full_name: string
    phone?: string
    email?: string
    notes?: string
}) {
    try {
        // Validate inputs
        const validated = customerSchema.parse(customer)
        uuidSchema.parse(customer.tenant_id)

        const { data, error } = await supabaseAdmin
            .from('customers')
            .insert({
                tenant_id: customer.tenant_id,
                full_name: validated.full_name,
                phone: validated.phone,
                email: validated.email,
                notes: validated.notes
            })
            .select()
            .maybeSingle()

        if (error) {
            console.error("Create customer error:", error);
            throw new Error(`Müşteri kaydedilemedi: ${error.message}`);
        }

        if (!data) throw new Error("Müşteri oluşturulamadı veya Service Key eksik.");

        revalidatePath('/dashboard')
        return data
    } catch (err: any) {
        console.error("Critical error in createCustomer:", err);
        throw err;
    }
}

export async function deleteCustomer(customerId: string) {
    uuidSchema.parse(customerId)
    const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId)

    if (error) throw error

    revalidatePath('/dashboard')
    return true
}
