"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { createCustomer } from "@/app/actions/customers";
import { approveAppointment, rejectAppointment, deleteAppointment } from "@/app/actions/appointments";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { BusinessDashboard } from "@/components/dashboard/BusinessDashboard";

export default function DashboardPage() {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);
    const [loading, setLoading] = useState(true);
    const [realCustomers, setRealCustomers] = useState<any[]>([]);
    const [realAppointments, setRealAppointments] = useState<any[]>([]);
    const [stats, setStats] = useState({ active: 0, today: 0, pending: 0 });

    const fetchRealData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserName(user.user_metadata.full_name || user.email?.split('@')[0] || 'Kullanıcı');
            setIsEmailConfirmed(!!user.email_confirmed_at);

            // Use maybeSingle to avoid PGRST116 if profile doesn't exist yet
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('tenant_id, role')
                .eq('id', user.id)
                .maybeSingle();

            if (profileError) {
                console.error("Profile fetch error:", profileError);
                // Fallback role logic if profile fetch fails
                setUserRole('individual');
            } else if (!profile) {
                // If no profile found, default to individual
                setUserRole('individual');
            } else {
                const role = profile.role === 'owner' ? 'business' : (profile.role === 'customer' ? 'individual' : 'individual');
                setUserRole(role);

                const tenantId = profile.tenant_id;

                if (role === 'individual') {
                    const { data } = await supabase
                        .from('appointments')
                        .select('*, tenants(name), services(name)')
                        .eq('created_by', user.id)
                        .order('start_time', { ascending: true });
                    setRealAppointments(data || []);
                    setStats(prev => ({ ...prev, active: data?.filter(a => a.status === 'confirmed').length || 0 }));
                } else if (tenantId) {
                    // Fetch appointments for business
                    const { data: appts } = await supabase
                        .from('appointments')
                        .select('*, customers(full_name), services(name)')
                        .eq('tenant_id', tenantId)
                        .order('start_time', { ascending: true });
                    setRealAppointments(appts || []);

                    // Fetch customers for business
                    const { data: custs } = await supabase
                        .from('customers')
                        .select('*')
                        .eq('tenant_id', tenantId)
                        .order('full_name', { ascending: true });
                    setRealCustomers(custs || []);

                    const todayStr = new Date().toISOString().split('T')[0];
                    setStats({
                        active: appts?.filter(a => a.status === 'confirmed').length || 0,
                        today: appts?.filter(a => a.start_time.startsWith(todayStr)).length || 0,
                        pending: appts?.filter(a => a.status === 'pending').length || 0
                    });
                }
            }
        } catch (err) {
            console.error("Dashboard data fetch error:", err);
            toast.error("Veriler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRealData();
    }, []);

    const handleAddCustomer = async () => {
        if (!customerName || !customerPhone) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
            .from('profiles')
            .select('tenant_id')
            .eq('id', user.id)
            .maybeSingle();

        const tenantId = profile?.tenant_id;
        if (!tenantId) return toast.error("İşletme yetkiniz bulunamadı.");

        try {
            await createCustomer({
                tenant_id: tenantId,
                full_name: customerName,
                phone: customerPhone
            });
            setCustomerName("");
            setCustomerPhone("");
            toast.success("Müşteri başarıyla eklendi.");
            fetchRealData();
        } catch (error) {
            console.error("Failed to add customer:", error);
            toast.error("Müşteri eklenirken hata oluştu.");
        }
    };

    const handleDeleteAppointment = async (id: string) => {
        if (confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
            try {
                await deleteAppointment(id);
                toast.success("Randevu silindi.");
                fetchRealData();
            } catch (error) {
                toast.error("Randevu silinirken hata oluştu.");
            }
        }
    };

    const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled') => {
        try {
            if (status === 'confirmed') await approveAppointment(id);
            else await rejectAppointment(id);
            toast.success("Randevu durumu güncellendi.");
            fetchRealData();
        } catch (error) {
            toast.error("Hata oluştu.");
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="text-blue-600 font-medium animate-pulse">Yükleniyor...</div>
        </div>
    );

    if (userRole === 'individual') {
        return (
            <CustomerDashboard
                userName={userName}
                isEmailConfirmed={isEmailConfirmed}
                stats={stats}
                appointments={realAppointments}
                onStatusUpdate={handleStatusUpdate}
            />
        );
    }

    return (
        <BusinessDashboard
            userName={userName}
            isEmailConfirmed={isEmailConfirmed}
            stats={stats}
            customers={realCustomers}
            appointments={realAppointments}
            customerName={customerName}
            customerPhone={customerPhone}
            setCustomerName={setCustomerName}
            setCustomerPhone={setCustomerPhone}
            onAddCustomer={handleAddCustomer}
            onStatusUpdate={handleStatusUpdate}
            onDeleteAppointment={handleDeleteAppointment}
        />
    );
}
