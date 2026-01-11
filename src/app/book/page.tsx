"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function BookPage() {
    const [date, setDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    const checkAvailability = async () => {
        if (!date) return alert("Lütfen bir tarih seçin.");
        setLoading(true);
        setAvailableSlots([]);

        // 09:00 - 18:00 arası saatler
        const allSlots = [
            "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
        ];

        try {
            // Seçilen tarihteki randevuları çek (Supabase)
            // Not: Gerçek senaryoda start_time aralığına göre sorgu yapılır.
            // Burada basitlik adına o günkü tüm kayıtları çekip JS ile filtreliyoruz (Demo)
            // Örnek sorgu: start_time >= '2023-10-27 00:00' AND start_time <= '2023-10-27 23:59'
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const { data: appointments, error } = await supabase
                .from("appointments")
                .select("start_time")
                .gte("start_time", startOfDay.toISOString())
                .lte("start_time", endOfDay.toISOString());

            if (error) throw error;

            // Dolu saatleri bul
            const bookedHours = appointments.map(app => {
                const d = new Date(app.start_time);
                return `${d.getHours().toString().padStart(2, '0')}:00`;
            });

            // Boş saatleri filtrele
            const freeSlots = allSlots.filter(slot => !bookedHours.includes(slot));
            setAvailableSlots(freeSlots);

            if (freeSlots.length === 0) {
                alert("Bu tarihte boş randevu bulunmamaktadır.");
            }

        } catch (error) {
            console.error("Availability error:", error);
            // Demo amaçlı, veritabanı boşsa veya hata varsa tüm saatleri gösterelim
            setAvailableSlots(allSlots);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        if (!selectedSlot || !customerName || !customerPhone) return alert("Lütfen tüm alanları doldurun.");

        try {
            // 1. Müşteriyi kaydet (veya bul)
            // Gerçekte burada önce müşteri araması yapılır.
            const { data: customer, error: customerError } = await supabase
                .from('customers')
                .insert({
                    full_name: customerName,
                    phone: customerPhone,
                    // tenant_id: '...' // Multi-tenant yapıda tenant_id gerekir. Demo için placeholder veya null.
                    // Şuan Auth olmadan public işlem yapıyoruz, RLS hatası verebilir. 
                    // Demo modunda olduğumuz için alert ile simüle edeceğiz.
                })
                .select()
                .single();

            // RLS (Row Level Security) açık olduğu için anonim kullanıcı (giriş yapmamış) yazma işlemi yapamayabilir.
            // Bu yüzden şimdilik sadece alert veriyoruz.
            alert(`Randevu Talebi Alındı!\n\nTarih: ${date}\nSaat: ${selectedSlot}\nİsim: ${customerName}`);

        } catch (error) {
            console.error("Booking error:", error);
            alert("Randevu oluşturulurken bir hata oluştu (Demo Mode).");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Online Randevu Al</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Tarih Seçimi */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tarih Seçiniz</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                    <Button onClick={checkAvailability} disabled={loading}>
                                        {loading ? "Kontrol..." : "Saatleri Gör"}
                                    </Button>
                                </div>
                            </div>

                            {/* Saat Seçimi (Grid) */}
                            {availableSlots.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Müsait Saatler</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 px-1 rounded-md text-sm cursor-pointer transition-colors border ${selectedSlot === slot
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white hover:bg-gray-50 border-gray-200"
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Kişisel Bilgiler ve Onay */}
                            {selectedSlot && (
                                <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Adınız Soyadınız</label>
                                        <Input placeholder="Örn: Ahmet Yılmaz" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Telefon Numaranız</label>
                                        <Input placeholder="0555 555 55 55" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                                    </div>
                                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleBook}>
                                        Randevuyu Onayla ({date} - {selectedSlot})
                                    </Button>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
