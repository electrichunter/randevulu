import Footer from "@/components/footer";

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">


            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="mx-auto max-w-3xl bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8 border-b pb-4">
                        Gizlilik Politikası ve KVKK Aydınlatma Metni
                    </h1>

                    <div className="prose prose-blue prose-lg text-slate-600">
                        <p className="font-medium text-slate-900">Son Güncelleme: {new Date().toLocaleDateString()}</p>

                        <h3>1. Veri Sorumlusu</h3>
                        <p>
                            Randevulu Platformu ("Şirket") olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz.
                        </p>

                        <h3>2. İşlenen Kişisel Verileriniz</h3>
                        <p>
                            Platformumuza üye olduğunuzda veya kullandığınızda şu verileriniz işlenebilir:
                        </p>
                        <ul>
                            <li>Kimlik Bilgileri (Ad, Soyad)</li>
                            <li>İletişim Bilgileri (Telefon, E-posta)</li>
                            <li>İşlem Güvenliği Bilgileri (IP Adresi, Giriş Kayıtları)</li>
                            <li>Randevu Detayları</li>
                        </ul>

                        <h3>3. Verilerin İşlenme Amacı</h3>
                        <p>
                            Kişisel verileriniz; üyelik işlemlerinin gerçekleştirilmesi, randevu hizmetlerinin sunulması, yasal yükümlülüklerin yerine getirilmesi ve müşteri memnuniyetinin artırılması amacıyla işlenmektedir.
                        </p>

                        <h3>4. Verilerin Aktarımı</h3>
                        <p>
                            Verileriniz, yasal zorunluluklar haricinde üçüncü kişilerle paylaşılmamaktadır. İşletme (Esnaf) üyelerimiz, sadece kendilerine randevu alan müşterilerin gerekli iletişim bilgilerini görüntüleyebilir.
                        </p>

                        <h3>5. Haklarınız</h3>
                        <p>
                            KVKK'nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, silinmesini talep etme ve zararın giderilmesini isteme haklarına sahipsiniz.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
