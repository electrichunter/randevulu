"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* Sol Taraf: Bilgiler */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
                                İletişime Geçin
                            </h1>
                            <p className="text-lg text-slate-600">
                                Sorularınız, önerileriniz veya iş ortaklığı talepleriniz için bize ulaşın. Ekibimiz en kısa sürede dönüş yapacaktır.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-slate-900">Genel Merkez</h3>
                                    <p className="text-slate-600">Teknopark İstanbul, Sanayi Mah.<br />Pendik / İstanbul</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-slate-900">E-posta</h3>
                                    <p className="text-slate-600">destek@randevulu.com</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-slate-900">Telefon</h3>
                                    <p className="text-slate-600">0850 123 45 67</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Taraf: Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Mesajınız alındı!"); }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Adınız</label>
                                    <Input placeholder="Adınız" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Soyadınız</label>
                                    <Input placeholder="Soyadınız" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">E-posta Adresi</label>
                                <Input type="email" placeholder="ornek@domain.com" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mesajınız</label>
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Size nasıl yardımcı olabiliriz?"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                Mesajı Gönder
                            </Button>
                        </form>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
