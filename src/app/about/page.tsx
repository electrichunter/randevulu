import Footer from "@/components/footer";
import { Users, Store, TrendingUp, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            <main className="flex-1">
                {/* HERO */}
                <div className="bg-blue-900 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                                Güzellik ve Bakım Sektörünün Dijital Dönüşümü
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                Randevulu, Türkiye genelindeki binlerce berber, kuaför ve güzellik merkezini tek bir platformda buluşturan, işletmelerle müşterileri arasındaki engelleri kaldıran yeni nesil pazar yeridir.
                            </p>
                        </div>
                        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                                <a href="/register">İşletmenizi Ekleyin <span aria-hidden="true">&rarr;</span></a>
                                <a href="/book">Randevu Alın <span aria-hidden="true">&rarr;</span></a>
                            </div>
                            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col-reverse">
                                    <dt className="text-base leading-7 text-gray-300">Aktif İşletme</dt>
                                    <dd className="text-2xl font-bold leading-9 tracking-tight text-white">2,500+</dd>
                                </div>
                                <div className="flex flex-col-reverse">
                                    <dt className="text-base leading-7 text-gray-300">Aylık Randevu</dt>
                                    <dd className="text-2xl font-bold leading-9 tracking-tight text-white">150K+</dd>
                                </div>
                                <div className="flex flex-col-reverse">
                                    <dt className="text-base leading-7 text-gray-300">Mutlu Müşteri</dt>
                                    <dd className="text-2xl font-bold leading-9 tracking-tight text-white">450K+</dd>
                                </div>
                                <div className="flex flex-col-reverse">
                                    <dt className="text-base leading-7 text-gray-300">Şehir</dt>
                                    <dd className="text-2xl font-bold leading-9 tracking-tight text-white">81</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* MİSYON & VİZYON */}
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
                        <div>
                            <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-6">
                                Biz Kimiz?
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                                Sadece Bir Randevu Yazılımı Değil, <br /> Bir Ekosistem.
                            </h2>
                            <p className="text-lg text-slate-600 mb-6">
                                Berberler ve kuaförler yıllardır defter, kalem veya karmaşık Excel dosyalarıyla boğuşuyor. Müşteriler ise telefonla arayıp "Saat 3 boş mu?" diye sormaktan yoruldu.
                            </p>
                            <p className="text-lg text-slate-600">
                                Randevulu, bu kaosu bitirmek için burada. Biz, işletmelerin gelirini artıran, müşterilerin ise hayatını kolaylaştıran o görünmez teknolojiyiz.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <Store className="h-8 w-8 text-blue-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">İşletme Dostu</h3>
                                <p className="mt-2 text-slate-600">
                                    Komisyon yok, gizli ücret yok. Sadece işinizi büyütmeye odaklanın.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <TrendingUp className="h-8 w-8 text-green-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">Gelir Artışı</h3>
                                <p className="mt-2 text-slate-600">
                                    Boş koltuk kalmasın. Online görünürlüğünüzü artırarak yeni müşteriler kazanın.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <Users className="h-8 w-8 text-purple-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">Topluluk</h3>
                                <p className="mt-2 text-slate-600">
                                    Binlerce meslektaşınızla aynı çatı altında profesyonel bir ağın parçası olun.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <ShieldCheck className="h-8 w-8 text-orange-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">Güvenlik</h3>
                                <p className="mt-2 text-slate-600">
                                    Verileriniz KVKK standartlarında, şifreli sunucularda güvende.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
