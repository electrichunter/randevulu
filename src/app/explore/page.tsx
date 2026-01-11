"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Business {
    id: string;
    name: string;
    settings: {
        city?: string;
        district?: string;
        address?: string;
        description?: string;
    };
    created_at: string;
}

export default function ExplorePage() {
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [filteredShops, setFilteredShops] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch businesses from Supabase
    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const { data, error } = await supabase
                    .from('tenants')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setBusinesses(data || []);
                setFilteredShops(data || []);
            } catch (error) {
                console.error("Error fetching businesses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, []);

    // Türkçe karakter duyarlı arama fonksiyonu
    const turkishToLower = (str: string) => {
        return str.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
    };

    useEffect(() => {
        if (!city && !district) {
            setFilteredShops(businesses);
            return;
        }

        const results = businesses.filter(shop => {
            const cityInput = turkishToLower(city);
            const districtInput = turkishToLower(district);

            const shopCity = turkishToLower(shop.settings?.city || "");
            const shopDistrict = turkishToLower(shop.settings?.district || "");

            const matchCity = city.length >= 3 ? shopCity.includes(cityInput) : true;
            const matchDistrict = district.length >= 3 ? shopDistrict.includes(districtInput) : true;

            return matchCity && matchDistrict;
        });

        setFilteredShops(results);
    }, [city, district, businesses]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-600">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <main className="container mx-auto px-4 py-12 sm:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                        İşletmeleri Keşfet
                    </h1>
                    <p className="mt-4 text-lg text-slate-600">
                        Size en yakın berber ve güzellik merkezlerini bulun.
                    </p>
                </div>

                {/* Filtre Alanı */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Şehir</label>
                            <Input
                                placeholder="Örn: Ankara, İstanbul"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                            />
                            <p className="text-xs text-gray-400 mt-1">En az 3 harf giriniz</p>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">İlçe</label>
                            <Input
                                placeholder="Örn: Çankaya, Kadıköy"
                                value={district}
                                onChange={e => setDistrict(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Liste */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {filteredShops.length > 0 ? (
                        filteredShops.map((shop) => (
                            <Card key={shop.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{shop.name}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {shop.settings?.district || "Bilinmiyor"}, {shop.settings?.city || "Bilinmiyor"}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 truncate">
                                        {shop.settings?.description || shop.settings?.address || "Adres bilgisi yok"}
                                    </p>
                                    <Link href={`/shop/${shop.id}`}>
                                        <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 bg-white">
                                            Profili Gör
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                            <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-900">Sonuç Bulunamadı</p>
                            <p className="text-sm text-gray-500">Lütfen arama kriterlerinizi kontrol edin veya yeni bir işletme ekleyin!</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
