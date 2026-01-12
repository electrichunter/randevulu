"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import dynamic from 'next/dynamic';
import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getCityCoordinates } from "@/lib/city-coordinates";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

interface Business {
    id: string;
    name: string;
    settings: {
        description?: string;
        phone?: string;
        address?: string;
        city?: string;
        district?: string;
        working_hours?: any;
    };
}

interface Service {
    id: string;
    name: string;
    duration_minutes: number;
    price: number;
    currency: string;
}

export default function ShopPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const shopId = resolvedParams.id;
    const [business, setBusiness] = useState<Business | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                // Fetch tenant/business data
                const { data: tenant, error: tenantError } = await supabase
                    .from('tenants')
                    .select('*')
                    .eq('id', shopId)
                    .single();

                if (tenantError || !tenant) {
                    setLoading(false);
                    return;
                }

                setBusiness(tenant);

                // Fetch services
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('*')
                    .eq('tenant_id', shopId)
                    .order('created_at', { ascending: true });

                setServices(servicesData || []);
            } catch (error) {
                console.error("Error fetching business:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, [shopId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-600">Yükleniyor...</p>
            </div>
        );
    }

    if (!business) {
        return notFound();
    }

    // Get coordinates based on city/district or use default
    const cityName = business.settings?.city || 'Ankara';
    const districtName = business.settings?.district;
    const { lat, lng } = getCityCoordinates(cityName, districtName);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <main className="pb-20 flex-1 container mx-auto px-4 py-12 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Sol Kolon: Bilgiler */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{business.name}</h1>
                            <div className="flex items-center text-slate-600 mb-6">
                                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                                {business.settings?.address || "Adres bilgisi yok"}, {business.settings?.district || ""}/{business.settings?.city || "Ankara"}
                            </div>

                            <div className="flex gap-4 mb-8">
                                <Link href={`/book?shopId=${shopId}`}>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Calendar className="mr-2 h-4 w-4" /> Hızlı Randevu Al
                                    </Button>
                                </Link>
                                {business.settings?.phone && (
                                    <Button variant="outline">
                                        <Phone className="mr-2 h-4 w-4" /> {business.settings.phone}
                                    </Button>
                                )}
                            </div>

                            <div className="border-t pt-6">
                                <h2 className="text-lg font-bold mb-4">Hakkında</h2>
                                <p className="text-slate-600">
                                    {business.settings?.description ||
                                        `${business.name}, ${business.settings?.district || "bölgesinde"} kaliteli hizmet vermektedir.`}
                                </p>
                            </div>
                        </div>

                        {/* Hizmetler */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                                Hizmetler ve Fiyatlar
                            </h2>
                            {services.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">Henüz hizmet eklenmemiş.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {services.map((service) => (
                                        <li key={service.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                                            <div>
                                                <span className="font-medium">{service.name}</span>
                                                <span className="text-sm text-gray-500 ml-2">({service.duration_minutes} dk)</span>
                                            </div>
                                            <span className="font-semibold">{service.price} {service.currency}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Sağ Kolon: Harita */}
                    <div className="space-y-6">
                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                            <div className="p-4 pb-2">
                                <h2 className="text-lg font-bold">Konum</h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    {business.settings?.address || "Adres bilgisi mevcut değil"}
                                </p>
                            </div>
                            <Map pos={[lat, lng]} popupText={business.name} />
                            <div className="p-4 text-center">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                                    target="_blank"
                                    className="text-sm text-blue-600 hover:underline font-medium"
                                >
                                    Google Haritalar'da Aç ↗
                                </a>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-2">Çalışma Saatleri</h3>
                            <div className="text-sm text-blue-800 space-y-1">
                                <div className="flex justify-between"><span>Hafta İçi:</span> <span>09:00 - 20:00</span></div>
                                <div className="flex justify-between"><span>Cumartesi:</span> <span>09:00 - 21:00</span></div>
                                <div className="flex justify-between"><span>Pazar:</span> <span>Kapalı</span></div>
                            </div>
                            <p className="text-xs text-blue-600 mt-3 italic">* Çalışma saatleri işletme tarafından güncellenebilir.</p>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
