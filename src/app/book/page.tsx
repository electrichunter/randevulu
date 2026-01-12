import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createAppointment } from "@/app/actions/appointments";
import { uuidSchema } from "@/lib/validations";

function BookContent() {
    const searchParams = useSearchParams();
    const shopId = searchParams.get("shopId");

    const [shopName, setShopName] = useState("");
    const [date, setDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState("");
    const [showContactForm, setShowContactForm] = useState(true);
    const [hasPreFilledData, setHasPreFilledData] = useState(false);

    // Fetch shop, services, and user profile
    useEffect(() => {
        const fetchAllData = async () => {
            if (shopId) {
                try {
                    // Check if shopId is valid UUID
                    const validation = uuidSchema.safeParse(shopId);
                    if (!validation.success) return;

                    const { data: tenant } = await supabase
                        .from('tenants')
                        .select('name')
                        .eq('id', shopId)
                        .maybeSingle();

                    if (tenant) setShopName(tenant.name);

                    const { data: servicesData } = await supabase
                        .from('services')
                        .select('*')
                        .eq('tenant_id', shopId);

                    if (servicesData) {
                        setServices(servicesData);
                        if (servicesData.length > 0) setSelectedService(servicesData[0].id);
                    }

                    // Fetch current user profile
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('full_name, phone')
                            .eq('id', user.id)
                            .maybeSingle();

                        if (profile) {
                            if (profile.full_name) setCustomerName(profile.full_name);
                            if (profile.phone) setCustomerPhone(profile.phone);
                            if (profile.full_name && profile.phone) {
                                setShowContactForm(false);
                                setHasPreFilledData(true);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchAllData();
    }, [shopId]);

    const checkAvailability = async () => {
        if (!date) return toast.error("Lütfen bir tarih seçin.");
        if (!shopId) return toast.error("İşletme bilgisi eksik.");

        setLoading(true);
        setAvailableSlots([]);

        const allSlots = [
            "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
        ];

        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const { data: appointments, error } = await supabase
                .from("appointments")
                .select("start_time")
                .eq("tenant_id", shopId)
                .gte("start_time", startOfDay.toISOString())
                .lte("start_time", endOfDay.toISOString());

            if (error) throw error;

            const bookedHours = (appointments || []).map(app => {
                const d = new Date(app.start_time);
                return `${d.getHours().toString().padStart(2, '0')}:00`;
            });

            const freeSlots = allSlots.filter(slot => !bookedHours.includes(slot));
            setAvailableSlots(freeSlots);

            if (freeSlots.length === 0) {
                toast.error("Bu tarihte boş randevu bulunmamaktadır.");
            }

        } catch (error) {
            console.error("Availability error:", error);
            setAvailableSlots(allSlots);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        if (!selectedSlot || !customerName || !customerPhone || !shopId) {
            return toast.error("Lütfen tüm alanları doldurun.");
        }

        setLoading(true);

        try {
            // 1. Find or Create Customer for this tenant
            let { data: existingCustomer } = await supabase
                .from('customers')
                .select('id')
                .eq('phone', customerPhone)
                .eq('tenant_id', shopId)
                .maybeSingle();

            let customerId;
            if (existingCustomer) {
                customerId = existingCustomer.id;
            } else {
                const { data: newCustomer, error: customerError } = await supabase
                    .from('customers')
                    .insert({
                        full_name: customerName,
                        phone: customerPhone,
                        tenant_id: shopId
                    })
                    .select()
                    .single();

                if (customerError) throw customerError;
                customerId = newCustomer.id;
            }

            // 2. Calculate end time (default 30 min if no service selected)
            const startTime = new Date(`${date}T${selectedSlot}:00`);
            const duration = services.find(s => s.id === selectedService)?.duration_minutes || 30;
            const endTime = new Date(startTime.getTime() + duration * 60000);

            // 3. Create appointment using server action
            const { data: { user } } = await supabase.auth.getUser();
            await createAppointment({
                tenant_id: shopId,
                customer_id: customerId,
                service_id: selectedService || undefined,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                created_by: user?.id || undefined,
            });

            toast.success("Randevu talebiniz başarıyla alındı!");
            // Reset form
            setSelectedSlot("");
            setCustomerName("");
            setCustomerPhone("");

        } catch (error: any) {
            console.error("Booking error:", error);
            toast.error("Randevu oluşturulurken bir hata oluştu: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">
                            {shopName ? `${shopName} - Randevu Al` : "Online Randevu Al"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Hizmet Seçimi */}
                        {services.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hizmet Seçiniz</label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded-md bg-white"
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                >
                                    {services.map(service => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} - {service.price} {service.currency} ({service.duration_minutes} dk)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

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
                                {(hasPreFilledData && !showContactForm) ? (
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Randevu Sahibi</p>
                                            <p className="font-semibold text-slate-900">{customerName}</p>
                                            <p className="text-sm text-slate-600">{customerPhone}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() => setShowContactForm(true)}
                                        >
                                            Değiştir
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {!customerPhone && (
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800 text-sm">
                                                <AlertCircle className="h-5 w-5 shrink-0" />
                                                <div>
                                                    <p className="font-semibold">Telefon numaranız eksik!</p>
                                                    <p>Profilinizde numaranız kayıtlı değil. <a href="/dashboard/settings" className="underline font-bold">Ayarlardan</a> numaranızı ekleyerek bir sonraki randevularınızın otomatik dolmasını sağlayabilirsiniz.</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Adınız Soyadınız</label>
                                            <Input placeholder="Örn: Ahmet Yılmaz" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Telefon Numaranız</label>
                                            <Input placeholder="0555 555 55 55" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                                        </div>
                                        {hasPreFilledData && (
                                            <button
                                                className="text-xs text-slate-400 hover:text-slate-600 underline"
                                                onClick={() => setShowContactForm(false)}
                                            >
                                                Vazgeç, kayıtlı bilgileri kullan
                                            </button>
                                        )}
                                    </>
                                )}
                                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleBook} disabled={loading}>
                                    {loading ? "Rezervasyon Yapılıyor..." : `Randevuyu Onayla (${date} - ${selectedSlot})`}
                                </Button>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default function BookPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <Suspense fallback={
                <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            }>
                <BookContent />
            </Suspense>
            <Footer />
        </div>
    );
}
