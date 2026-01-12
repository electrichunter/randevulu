"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Building, CreditCard, List as ListIcon, Trash2, Plus, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CustomAlert } from "@/components/custom-alert";
import { logErrorToTerminal } from "@/app/actions/log-error";
import { getServicesByTenant, createService, updateService, deleteService, type Service } from "@/app/actions/services";
import { profileSchema } from "@/lib/validations";
import { Switch } from "@/components/ui/switch";

const PAYMENT_METHODS = [
    { id: "cash", label: "Nakit" },
    { id: "credit_card", label: "Kredi Kartı" },
    { id: "sodexo", label: "Sodexo" },
    { id: "multinet", label: "Multinet" },
    { id: "ticket", label: "Ticket / Edenred" },
    { id: "setcard", label: "Setcard" },
    { id: "metropol", label: "Metropol" },
];

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [alert, setAlert] = useState<{ type: "success" | "error", title: string, message: string } | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "services" | "hours">("profile");

    // Form Data
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [businessName, setBusinessName] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("Ankara");
    const [district, setDistrict] = useState("");
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

    // Personal Profile
    const [userFullName, setUserFullName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);

    // Services
    const [services, setServices] = useState<Service[]>([]);
    const [newService, setNewService] = useState({ name: "", duration_minutes: 30, price: 0 });

    // Working Hours
    const [workingHours, setWorkingHours] = useState({
        monday: { start: "09:00", end: "18:00", closed: false },
        tuesday: { start: "09:00", end: "18:00", closed: false },
        wednesday: { start: "09:00", end: "18:00", closed: false },
        thursday: { start: "09:00", end: "18:00", closed: false },
        friday: { start: "09:00", end: "18:00", closed: false },
        saturday: { start: "09:00", end: "18:00", closed: false },
        sunday: { start: "09:00", end: "18:00", closed: true },
    });

    useEffect(() => {
        fetchBusinessData();
    }, []);

    const fetchBusinessData = async () => {
        setPageLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('tenant_id, full_name, phone, role')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                setUserFullName(profile.full_name || "");
                setUserPhone(profile.phone || "");
                setUserRole(profile.role);
            }

            const authName = session.user.user_metadata.full_name || session.user.user_metadata.name || "";
            if (!businessName && authName) {
                setBusinessName(authName);
            }

            if (!profile?.tenant_id) {
                if (authName) setBusinessName(authName);
                const savedMethods = localStorage.getItem("payment_methods");
                if (savedMethods) setSelectedMethods(JSON.parse(savedMethods));
            } else {
                setTenantId(profile.tenant_id);

                const { data: tenant } = await supabase
                    .from('tenants')
                    .select('*')
                    .eq('id', profile.tenant_id)
                    .single();

                if (tenant) {
                    setBusinessName(tenant.name || authName);
                    const settings = tenant.settings || {};
                    setDescription(settings.description || "");
                    setPhone(settings.phone || "");
                    setAddress(settings.address || "");
                    setCity(settings.city || "Ankara");
                    setDistrict(settings.district || "");
                    setSelectedMethods(settings.payment_methods || []);

                    // Load working hours
                    if (settings.working_hours) {
                        setWorkingHours(settings.working_hours);
                    }
                }

                // Load services
                const servicesData = await getServicesByTenant(profile.tenant_id);
                setServices(servicesData);
            }

        } catch (error) {
            console.error("Veri çekme hatası:", error);
        } finally {
            setPageLoading(false);
        }
    };

    const toggleMethod = (id: string) => {
        setSelectedMethods(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setAlert(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setAlert({ type: "error", title: "Oturum Hatası", message: "Lütfen tekrar giriş yapın." });
                setLoading(false);
                return;
            }

            let currentTenantId = tenantId;

            // Branch logic based on role
            if (userRole === 'owner' || userRole === 'staff') {
                // BUSINESS USER LOGIC
                if (!currentTenantId) {
                    const { data: newTenant, error: tenantError } = await supabase
                        .from('tenants')
                        .insert({
                            name: businessName || "İsimsiz İşletme",
                            settings: {
                                description,
                                phone,
                                address,
                                city,
                                district,
                                payment_methods: selectedMethods,
                                working_hours: workingHours
                            }
                        })
                        .select()
                        .single();

                    if (tenantError) throw tenantError;
                    currentTenantId = newTenant.id;
                    setTenantId(newTenant.id);

                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: session.user.id,
                            tenant_id: newTenant.id,
                            role: 'owner',
                            full_name: session.user.user_metadata.full_name || session.user.email
                        });

                    if (profileError) throw profileError;
                    setUserRole('owner');
                } else {
                    const { error } = await supabase
                        .from('tenants')
                        .update({
                            name: businessName,
                            settings: {
                                description,
                                phone,
                                address,
                                city,
                                district,
                                payment_methods: selectedMethods,
                                working_hours: workingHours
                            }
                        })
                        .eq('id', currentTenantId);

                    if (error) throw error;
                }
            }

            // PERSONAL PROFILE UPDATE (For all users)
            const { error: personalError } = await supabase
                .from('profiles')
                .update({
                    full_name: userFullName,
                    phone: userPhone
                })
                .eq('id', session.user.id);

            if (personalError) throw personalError;

            setAlert({
                type: "success",
                title: "Kaydedildi",
                message: userRole === 'customer'
                    ? "Profil bilgileriniz başarıyla güncellendi."
                    : "İşletme ve profil bilgileriniz başarıyla güncellendi."
            });

        } catch (error: any) {
            console.error("Kayıt hatası:", error);
            await logErrorToTerminal(error);

            setAlert({
                type: "error",
                title: "Veritabanı Hatası",
                message: `Hata: ${error.message} (Detaylar terminale yazıldı)`
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = async () => {
        if (!tenantId || !newService.name) {
            setAlert({ type: "error", title: "Hata", message: "Lütfen hizmet adı giriniz." });
            return;
        }

        try {
            await createService(tenantId, newService);
            const servicesData = await getServicesByTenant(tenantId);
            setServices(servicesData);
            setNewService({ name: "", duration_minutes: 30, price: 0 });
            setAlert({ type: "success", title: "Başarılı", message: "Hizmet eklendi." });
        } catch (error: any) {
            setAlert({ type: "error", title: "Hata", message: error.message });
        }
    };

    const handleDeleteService = async (serviceId: string) => {
        try {
            await deleteService(serviceId);
            setServices(services.filter(s => s.id !== serviceId));
            setAlert({ type: "success", title: "Silindi", message: "Hizmet başarıyla silindi." });
        } catch (error: any) {
            setAlert({ type: "error", title: "Hata", message: error.message });
        }
    };

    if (pageLoading) {
        return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Panele Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">
                        {userRole === 'owner' || userRole === 'staff' ? "İşletme Yönetimi" : "Hesap Ayarları"}
                    </h1>
                    <p className="text-slate-500">
                        {userRole === 'owner' || userRole === 'staff'
                            ? "Dükkanınızın görünürlüğünü ve ayarlarını yönetin."
                            : "Kişisel profil bilgilerinizi güncelleyin."}
                    </p>
                </div>

                {/* Tabs - Only show all for business users */}
                <div className="flex gap-4 mb-6 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === "profile"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <Building className="inline h-4 w-4 mr-2" />
                        {userRole === 'owner' || userRole === 'staff' ? "Profil Bilgileri" : "Kişisel Profil"}
                    </button>
                    {(userRole === 'owner' || userRole === 'staff') && (
                        <>
                            <button
                                onClick={() => setActiveTab("services")}
                                className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === "services"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <ListIcon className="inline h-4 w-4 mr-2" />
                                Hizmetler
                            </button>
                            <button
                                onClick={() => setActiveTab("hours")}
                                className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === "hours"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <Clock className="inline h-4 w-4 mr-2" />
                                Çalışma Saatleri
                            </button>
                        </>
                    )}
                </div>

                {alert && (
                    <div className="mb-6">
                        <CustomAlert
                            type={alert.type}
                            title={alert.title}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="grid gap-6">
                        {(userRole === 'owner' || userRole === 'staff') && (
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5 text-blue-600" />
                                        Genel Bilgiler
                                    </CardTitle>
                                    <CardDescription>Müşterilerinizin göreceği temel bilgiler.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">İşletme Adı</Label>
                                            <Input
                                                id="name"
                                                placeholder="Örn: Gold Makas"
                                                value={businessName}
                                                onChange={(e) => setBusinessName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telefon</Label>
                                            <Input
                                                id="phone"
                                                placeholder="0212 555 55 55"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Hakkımızda (Açıklama)</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="İşletmenizi tanıtan kısa bir yazı yazın..."
                                            className="resize-none"
                                            rows={4}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <p className="text-xs text-slate-500 text-right">{description.length}/500</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Şehir</Label>
                                            <Input
                                                id="city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="district">İlçe</Label>
                                            <Input
                                                id="district"
                                                placeholder="Örn: Çankaya"
                                                value={district}
                                                onChange={(e) => setDistrict(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Açık Adres</Label>
                                        <Textarea
                                            id="address"
                                            placeholder="Mahalle, Cadde, No..."
                                            rows={2}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ListIcon className="h-5 w-5 text-purple-600" />
                                    Kişisel Profil
                                </CardTitle>
                                <CardDescription>Randevu alırken formun otomatik dolması için bilgilerinizi eksiksiz girin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="user_name">Ad Soyad</Label>
                                        <Input
                                            id="user_name"
                                            placeholder="Adınız ve Soyadınız"
                                            value={userFullName}
                                            onChange={(e) => setUserFullName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="user_phone">Kişisel Telefon</Label>
                                        <Input
                                            id="user_phone"
                                            placeholder="05xx xxx xx xx"
                                            value={userPhone}
                                            onChange={(e) => setUserPhone(e.target.value)}
                                        />
                                        {!userPhone && <p className="text-xs text-amber-600 font-medium">⚠️ Telefon numarası eksik! Randevu alırken bu numarayı girmek zorunda kalacaksınız.</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end sticky bottom-6 z-10">
                            <Button size="lg" onClick={handleSaveProfile} disabled={loading} className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8">
                                <Save className="mr-2 h-4 w-4" />
                                {loading ? "Kaydediliyor..." : "Tüm Bilgileri Kaydet"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Working Hours Tab */}
                {activeTab === "hours" && (
                    <div className="grid gap-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    Çalışma Saatlerini Düzenle
                                </CardTitle>
                                <CardDescription>Müşterilerinizin hangi gün ve saatlerde randevu alabileceğini belirleyin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    {(Object.keys(workingHours) as Array<keyof typeof workingHours>).map((day) => {
                                        const dayNames: { [key: string]: string } = {
                                            monday: "Pazartesi",
                                            tuesday: "Salı",
                                            wednesday: "Çarşamba",
                                            thursday: "Perşembe",
                                            friday: "Cuma",
                                            saturday: "Cumartesi",
                                            sunday: "Pazar"
                                        };

                                        return (
                                            <div key={day} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl transition-all ${workingHours[day].closed ? "bg-slate-50 border-slate-100 opacity-70" : "bg-white border-slate-200 shadow-sm"}`}>
                                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                    <div className="w-24 font-bold text-slate-700">{dayNames[day]}</div>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={!workingHours[day].closed}
                                                            onCheckedChange={(checked: boolean) => {
                                                                setWorkingHours(prev => ({
                                                                    ...prev,
                                                                    [day]: { ...prev[day], closed: !checked }
                                                                }));
                                                            }}
                                                        />
                                                        <span className="text-sm text-slate-500 w-16">
                                                            {!workingHours[day].closed ? "Açık" : "Kapalı"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {!workingHours[day].closed && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-slate-400" />
                                                            <Input
                                                                type="time"
                                                                className="w-24 h-9 p-2 text-sm"
                                                                value={workingHours[day].start}
                                                                onChange={(e) => {
                                                                    setWorkingHours(prev => ({
                                                                        ...prev,
                                                                        [day]: { ...prev[day], start: e.target.value }
                                                                    }));
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-slate-400 font-bold">-</span>
                                                        <Input
                                                            type="time"
                                                            className="w-24 h-9 p-2 text-sm"
                                                            value={workingHours[day].end}
                                                            onChange={(e) => {
                                                                setWorkingHours(prev => ({
                                                                    ...prev,
                                                                    [day]: { ...prev[day], end: e.target.value }
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                {workingHours[day].closed && (
                                                    <div className="text-sm font-medium text-slate-400 px-4 py-2 italic bg-slate-100/50 rounded-lg">
                                                        Bugün işletmeniz hizmet vermiyor.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <Button onClick={handleSaveProfile} disabled={loading} className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8">
                                        <Save className="mr-2 h-4 w-4" />
                                        {loading ? "Kaydediliyor..." : "Çalışma Saatlerini Kaydet"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

            </main>
        </div>
    );
}
