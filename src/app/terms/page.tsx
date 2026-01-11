import Footer from "@/components/footer";

export default function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">


            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="mx-auto max-w-3xl bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8 border-b pb-4">
                        Kullanım Koşulları ve Üyelik Sözleşmesi
                    </h1>

                    <div className="prose prose-blue prose-lg text-slate-600">
                        <p className="font-medium text-slate-900">Son Güncelleme: {new Date().toLocaleDateString()}</p>

                        <h3>1. Giriş</h3>
                        <p>
                            Bu platformu kullanarak, aşağıda belirtilen tüm şartları kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen platformu kullanmayınız.
                        </p>

                        <h3>2. Hizmetin Tanımı</h3>
                        <p>
                            Randevulu, hizmet sağlayıcılar (Esnaf/Kuaför) ile hizmet alanları (Müşteri) bir araya getiren bir randevu yönetim platformudur. Randevulu, verilen hizmetin kalitesinden veya sonucundan sorumlu değildir.
                        </p>

                        <h3>3. Üyelik ve Hesap Güvenliği</h3>
                        <p>
                            Üye olurken verdiğiniz bilgilerin doğruluğundan siz sorumlusunuz. Şifrenizin güvenliğini sağlamak sizin sorumluluğunuzdadır.
                        </p>

                        <h3>4. Fikri Mülkiyet</h3>
                        <p>
                            Platformdaki tüm tasarımlar, logolar ve yazılımlar Randevulu'ya aittir. İzinsiz kopyalanamaz.
                        </p>

                        <h3>5. Sözleşme Değişiklikleri</h3>
                        <p>
                            Randevulu, dilediği zaman bu sözleşme maddelerini değiştirme hakkını saklı tutar.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
