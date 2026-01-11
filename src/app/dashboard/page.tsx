"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, Users, Calendar, TrendingUp, Search, Plus, Clock, MapPin, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CustomAlert } from "@/components/custom-alert"; // EKLENDI

export default function DashboardPage() {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isEmailConfirmed, setIsEmailConfirmed] = useState(true); // Varsayılan true
    const [loading, setLoading] = useState(true);

    // Kullanıcı rolünü kontrol et
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserRole(user.user_metadata.role || 'business');
                setUserName(user.user_metadata.full_name || 'Kullanıcı');

                // Mail doğrulama kontrolü: Eğer confirmed_at null ise doğrulanmamış demektir.
                // Not: Supabase ayarlarından "Confirm email" açık olmalı.
                setIsEmailConfirmed(!!user.email_confirmed_at);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Live query to fetch customers
    const customers = useLiveQuery(() => db.customers.toArray());
    const appointments = useLiveQuery(() => db.appointments.toArray());

    const addCustomer = async () => {
        if (!customerName || !customerPhone) return;
        try {
            await db.customers.add({
                id: crypto.randomUUID(),
                name: customerName,
                phone: customerPhone,
                createdAt: new Date(),
            });
            setCustomerName("");
            setCustomerPhone("");
        } catch (error) {
            console.error("Failed to add customer:", error);
        }
    };

    const addAppointment = async (customerId: string) => {
        try {
            await db.appointments.add({
                id: crypto.randomUUID(),
                customerId,
                title: "Yeni Randevu",
                date: new Date(),
                status: 'pending',
                createdAt: new Date(),
            });
        } catch (error) {
            console.error("Failed to add appointment:", error);
        }
    }

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="text-blue-600 font-medium animate-pulse">Yükleniyor...</div>
        </div>
    );

    // BİREYSEL MÜŞTERİ DASHBOARD
    if (userRole === 'individual') {
        return (
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
                {/* Header */}
                <header className="bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Hoşgeldin, {userName} 👋</h1>
                            <p className="text-slate-500 text-sm">Güzellik ve bakım takvimin burada.</p>
                        </div>
                        <Link href="/book">
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow-md">
                                <Plus className="mr-2 h-4 w-4" /> Yeni Randevu
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* UYARI BANDI */}
                {!isEmailConfirmed && (
                    <div className="container mx-auto px-4 mt-6">
                        <CustomAlert
                            type="warning"
                            title="E-posta Adresinizi Doğrulayın"
                            message="Hesabınızın güvenliği ve randevu bildirimleri için lütfen e-posta adresinizi doğrulayın. Spam klasörünü kontrol etmeyi unutmayın."
                        />
                    </div>
                )}

                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* İstatistik / Durum */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-gray-100 shadow-sm bg-blue-50 border-blue-100">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Aktif Randevu</p>
                                    <h3 className="text-2xl font-bold text-blue-700">0</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                                    <Star className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Favori İşletme</p>
                                    <h3 className="text-2xl font-bold text-gray-900">0</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <Link href="/explore">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-3 bg-green-100 rounded-xl text-green-600 group-hover:bg-green-200 transition-colors">
                                        <Search className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Yeni Keşfet</p>
                                        <h3 className="text-lg font-bold text-gray-900">İşletme Ara &rarr;</h3>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Yaklaşan Randevular */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900">Yaklaşan Randevularım</h2>
                            </div>
                            <Card className="border-gray-100 shadow-sm">
                                <CardContent className="p-12 text-center">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
                                        <Calendar className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">Henüz randevun yok</h3>
                                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                        Kendine bir iyilik yap ve bakımın için harika bir işletmeden randevu al.
                                    </p>
                                    <Link href="/explore">
                                        <Button variant="outline" className="mt-6 bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">Hemen Keşfet</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Önerilenler */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Popüler İşletmeler</h2>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 flex gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900">Örnek Kuaför {i}</h4>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <MapPin className="h-3 w-3 mr-1" /> Ankara, Çankaya
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // İŞLETME SAHİBİ DASHBOARD
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                            {userName ? userName.charAt(0).toUpperCase() : "R"}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">{userName || "İşletme Paneli"}</h1>
                            <p className="text-xs text-green-600 font-medium flex items-center">
                                <span className="block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Online
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Link href="/dashboard/settings" className="w-full md:w-auto">
                            <Button variant="outline" className="w-full border-gray-200 bg-white hover:bg-gray-50 text-gray-700">
                                <Settings className="h-4 w-4 mr-2" /> Ayarlar
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* UYARI BANDI */}
            {!isEmailConfirmed && (
                <div className="container mx-auto px-4 mt-6">
                    <CustomAlert
                        type="warning"
                        title="E-posta Adresinizi Doğrulayın"
                        message="Müşterilerinizin size ulaşabilmesi ve hesabınızın onaylanması için e-posta doğrulamanız gerekmektedir."
                    />
                </div>
            )}

            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* İstatistik Kartları */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Users className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium text-gray-500">Müşteriler</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{customers?.length || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium text-gray-500">Bugün</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">0</div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium text-gray-500">Bekleyen</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">
                                {appointments?.filter(a => a.status === 'pending').length || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium text-gray-500">Kazanç</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">₺0</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* CUSTOMER SECTION */}
                    <div className="md:col-span-1 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center justify-between">
                            Hızlı Müşteri Ekle
                        </h2>
                        <Card className="border-gray-100 shadow-sm">
                            <CardContent className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Ad Soyad Giriniz"
                                        className="bg-gray-50 border-gray-200"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Telefon Numarası"
                                        className="bg-gray-50 border-gray-200"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                    />
                                </div>
                                <Button onClick={addCustomer} className="w-full bg-blue-600 hover:bg-blue-700">
                                    <div className="flex items-center justify-center">
                                        <Plus className="mr-2 h-4 w-4" /> Müşteriyi Kaydet
                                    </div>
                                </Button>
                            </CardContent>
                        </Card>

                        <h2 className="text-lg font-bold text-slate-900 mt-8">Son Müşteriler</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                                {customers?.map((customer) => (
                                    <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors group flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm text-slate-900">{customer.name}</div>
                                                <div className="text-xs text-gray-500">{customer.phone}</div>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => addAppointment(customer.id)}>
                                            <Calendar className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {customers?.length === 0 && (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        Listeniz boş.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* APPOINTMENT SECTION */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Randevu Listesi</h2>
                        <Card className="border-gray-100 shadow-sm bg-white">
                            <CardContent className="p-0">
                                {appointments?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="p-4 bg-blue-50 rounded-full mb-4">
                                            <Calendar className="h-8 w-8 text-blue-300" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900">Hiç randevu yok</h3>
                                        <p className="text-sm text-gray-500 mt-1">Sol taraftaki müşterilerden randevu oluşturabilirsiniz.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {appointments?.map((apt) => {
                                            const customer = customers?.find(c => c.id === apt.customerId);
                                            return (
                                                <div key={apt.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-50 rounded-lg border border-blue-100 text-blue-700">
                                                            <span className="text-xs font-bold uppercase">{new Date(apt.date).toLocaleString('tr-TR', { month: 'short' })}</span>
                                                            <span className="text-lg font-bold">{new Date(apt.date).getDate()}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{customer?.name || "Bilinmeyen Müşteri"}</h4>
                                                            <p className="text-sm text-gray-500">{apt.title}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm font-medium text-slate-600">
                                                            {new Date(apt.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {apt.status === 'pending' ? 'Bekliyor' : apt.status}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={async () => {
                                                                if (confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
                                                                    await db.appointments.delete(apt.id);
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            Sil
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
