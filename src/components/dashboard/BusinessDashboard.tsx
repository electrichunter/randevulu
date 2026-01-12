"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Users, Calendar, TrendingUp, Plus, Clock } from "lucide-react";
import Link from "next/link";
import { CustomAlert } from "@/components/custom-alert";

interface BusinessDashboardProps {
    userName: string | null;
    isEmailConfirmed: boolean;
    stats: { active: number; today: number; pending: number };
    customers: any[];
    appointments: any[];
    customerName: string;
    customerPhone: string;
    setCustomerName: (name: string) => void;
    setCustomerPhone: (phone: string) => void;
    onAddCustomer: () => Promise<any>;
    onStatusUpdate: (id: string, status: 'confirmed' | 'cancelled') => Promise<any>;
    onDeleteAppointment: (id: string) => Promise<any>;
}

export function BusinessDashboard({
    userName,
    isEmailConfirmed,
    stats,
    customers,
    appointments,
    customerName,
    customerPhone,
    setCustomerName,
    setCustomerPhone,
    onAddCustomer,
    onStatusUpdate,
    onDeleteAppointment
}: BusinessDashboardProps) {
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
                            <div className="text-2xl font-bold text-slate-900">{stats.today}</div>
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
                                {stats.pending}
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
                                <Button onClick={onAddCustomer} className="w-full bg-blue-600 hover:bg-blue-700">
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
                                                {customer.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm text-slate-900">{customer.full_name}</div>
                                                <div className="text-xs text-gray-500">{customer.phone}</div>
                                            </div>
                                        </div>
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
                                        <p className="text-sm text-gray-500 mt-1">Gerçekleşen veya bekleyen randevularınız burada görünecek.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {appointments?.map((apt) => {
                                            return (
                                                <div key={apt.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-50 rounded-lg border border-blue-100 text-blue-700">
                                                            <span className="text-xs font-bold uppercase">{new Date(apt.start_time).toLocaleString('tr-TR', { month: 'short' })}</span>
                                                            <span className="text-lg font-bold">{new Date(apt.start_time).getDate()}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{apt.customers?.full_name || "Bilinmeyen Müşteri"}</h4>
                                                            <p className="text-sm text-gray-500">{apt.services?.name || "Hizmet belirtilmedi"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm font-medium text-slate-600">
                                                            {new Date(apt.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {apt.status === 'pending' ? 'Bekliyor' : apt.status}
                                                            </span>
                                                            {apt.status === 'pending' && (
                                                                <div className="flex gap-1">
                                                                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => onStatusUpdate(apt.id, 'confirmed')}>Onayla</Button>
                                                                    <Button size="sm" variant="outline" className="h-7 text-[10px] text-red-500" onClick={() => onStatusUpdate(apt.id, 'cancelled')}>Reddet</Button>
                                                                </div>
                                                            )}
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => onDeleteAppointment(apt.id)}>
                                                                <Clock className="h-4 w-4 rotate-45" />
                                                            </Button>
                                                        </div>
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
