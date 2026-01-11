"use client";

import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, WifiOff, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-32 md:pt-24 md:pb-48">
          <div className="container mx-auto px-4 text-center sm:px-8">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-600">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                Yeni: Online Randevu Modu Aktif
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900">
                İşletmenizi <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Akıllıca</span> Yönetin
              </h1>
              <p className="mx-auto max-w-xl text-lg text-slate-600 md:text-xl">
                Randevularınızı organize edin, müşteri ilişkilerinizi güçlendirin. Her yerden erişilebilir, modern CRM çözümü.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                      Panele Git &rarr;
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                        Ücretsiz Başla
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto bg-white text-slate-900 border-gray-200 hover:bg-gray-50">
                        Giriş Yap
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Background Decorative Blob */}
          <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-100 opacity-50 blur-3xl filter" />
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Neden Randevulu?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                İşinizi büyütmek için ihtiyacınız olan her şey, karmaşadan uzak.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="group rounded-2xl border border-gray-100 bg-slate-50 p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <WifiOff className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">7/24 Erişim</h3>
                <p className="text-slate-600">
                  Bulut tabanlı yapımız sayesinde dükkanınızda, evinizde veya tatilde; işiniz her an cebinizde.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-2xl border border-gray-100 bg-slate-50 p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Kolay Randevu</h3>
                <p className="text-slate-600">
                  Google Takvim ile entegre, sürükle-bırak kolaylığında modern bir takvim deneyimi.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-2xl border border-gray-100 bg-slate-50 p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Müşteri Sadakati</h3>
                <p className="text-slate-600">
                  Müşteri geçmişini görün, notlar alın ve onlara özel olduklarını hissettirin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / ROLES SECTION */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-2 items-center">

              {/* Esnaf Rolü */}
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  İşletmeler İçin
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Kontrol Sizde Olsun</h2>
                <p className="text-lg text-slate-600">
                  Randevulu, karmaşık yazılımlarla vakit kaybetmek istemeyen esnaflar için tasarlandı.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-3 h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">Tek panelden tüm personel yönetimi</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-3 h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">Gelir/Gider takibi ve kasa raporları</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-3 h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">Otomatik SMS hatırlatmaları (Yakında)</span>
                  </li>
                </ul>
                <Link href="/register" className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700">
                  İşletme Hesabı Oluştur <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Müşteri Rolü (Görsel Temsili veya Açıklama) */}
              <div className="relative rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-yellow-100 opacity-50 blur-2xl"></div>
                <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 mb-6">
                  Müşterileriniz İçin
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Randevu Almak Hiç Bu Kadar Kolay Olmamıştı</h3>
                <p className="text-slate-600 mb-6">
                  Müşterileriniz 7/24 online randevu alabilir, randevularını kendi panellerinden yönetebilirler. Telefon trafiğine son verin.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 border border-gray-100 text-sm text-slate-500">
                  "Randevulu sayesinde artık kuaförümü arayıp dakikalarca boş saat aramıyorum. İşim 10 saniyede bitiyor."
                  <div className="mt-2 font-medium text-slate-900">- Ayşe Y., Memnun Müşteri</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center sm:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-6">İşinizi Dijitale Taşıyın</h2>
            <p className="mx-auto max-w-2xl text-blue-100 text-lg mb-8">
              İlk ay tamamen ücretsiz. Kredi kartı gerekmez. Memnun kalmazsanız istediğiniz an bırakın.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Ücretsiz Deneyin
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
