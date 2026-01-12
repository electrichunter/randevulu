"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Star, Search, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { CustomAlert } from "@/components/custom-alert";

interface CustomerDashboardProps {
    userName: string | null;
    isEmailConfirmed: boolean;
    stats: { active: number };
    appointments: any[];
    onStatusUpdate: (id: string, status: 'confirmed' | 'cancelled') => Promise<any>;
}

export function CustomerDashboard({
    userName,
    isEmailConfirmed,
    stats,
    appointments,
    onStatusUpdate
}: CustomerDashboardProps) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Hoşgeldin, {userName} 👋</h1>
                        <p className="text-slate-500 text-sm">Güzellik ve bakım takvimin burada.</p>
                    </div>
                    <Link href="/explore">
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
                                <h3 className="text-2xl font-bold text-blue-700">{stats.active}</h3>
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
                        {appointments.length === 0 ? (
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
                        ) : (
                            <div className="space-y-4">
                                {appointments.map(apt => (
                                    <Card key={apt.id} className="border-gray-100 shadow-sm">
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-50 rounded-lg text-blue-700">
                                                    <span className="text-xs font-bold uppercase">{new Date(apt.start_time).toLocaleString('tr-TR', { month: 'short' })}</span>
                                                    <span className="text-lg font-bold">{new Date(apt.start_time).getDate()}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{apt.tenants?.name}</h4>
                                                    <p className="text-sm text-gray-500">{apt.services?.name || "Hizmet seçilmedi"}</p>
                                                    <p className="text-xs text-blue-600">
                                                        {new Date(apt.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
                                                    }`}>
                                                    {apt.status === 'pending' ? 'Bekliyor' : apt.status}
                                                </span>
                                                {apt.status === 'pending' && (
                                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onStatusUpdate(apt.id, 'cancelled')}>
                                                        İptal
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
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
