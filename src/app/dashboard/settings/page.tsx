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
                .select('tenant_id')
                .eq('id', session.user.id)
                .single();

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

                setAlert({ type: "success", title: "Kurulum Tamamlandı", message: "İşletmeniz başarıyla oluşturuldu ve veritabanına bağlandı." });
                setLoading(false);
                return;
            }

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

            setAlert({ type: "success", title: "Kaydedildi", message: "İşletme bilgileriniz başarıyla güncellendi." });

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
                    <h1 className="text-3xl font-bold text-slate-900">İşletme Yönetimi</h1>
                    <p className="text-slate-500">Dükkanınızın görünürlüğünü ve ayarlarını yönetin.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === "profile"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <Building className="inline h-4 w-4 mr-2" />
                        Profil Bilgileri
                    </button>
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

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-green-600" />
                                    Ödeme Yöntemleri
                                </CardTitle>
                                <CardDescription>Kabul ettiğiniz ödeme tiplerini işaretleyin.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {PAYMENT_METHODS.map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => toggleMethod(method.id)}
                                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedMethods.includes(method.id)
                                                ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                                                : "hover:bg-gray-50 border-gray-200 text-slate-600"
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${selectedMethods.includes(method.id)
                                                ? "bg-blue-600 border-blue-600"
                                                : "border-gray-400 bg-white"
                                                }`}>
                                                {selectedMethods.includes(method.id) && <span className="text-white text-xs font-bold">✓</span>}
                                            </div>
                                            <span className="text-sm font-medium">{method.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end sticky bottom-6 z-10">
                            <Button size="lg" onClick={handleSaveProfile} disabled={loading} className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8">
                                <Save className="mr-2 h-4 w-4" />
                                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === "services" && (
                    <div className="grid gap-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Hizmet Ekle</CardTitle>
                                <CardDescription>İşletmenizde sunduğunuz hizmetleri tanımlayın.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <Input
                                        placeholder="Hizmet Adı"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Süre (dakika)"
                                        value={newService.duration_minutes}
                                        onChange={(e) => setNewService({ ...newService, duration_minutes: parseInt(e.target.value) || 0 })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Fiyat (₺)"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <Button onClick={handleAddService} className="bg-green-600 hover:bg-green-700">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Hizmet Ekle
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Mevcut Hizmetler</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {services.length === 0 ? (
                                    <p className="text-slate-500 text-center py-8">Henüz hizmet eklenmemiş.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {services.map((service) => (
                                            <div key={service.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                                                <div>
                                                    <h4 className="font-medium text-slate-900">{service.name}</h4>
                                                    <p className="text-sm text-slate-500">
                                                        {service.duration_minutes} dakika • {service.price} {service.currency}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteService(service.id)}
                                                    className="text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

            </main>
        </div>
    );
}
