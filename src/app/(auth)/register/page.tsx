"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [accountType, setAccountType] = useState<"business" | "individual">("business");
    const router = useRouter();

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    // Validation States
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [hasMinLength, setHasMinLength] = useState(false);
    const [hasUpperCase, setHasUpperCase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);

    useEffect(() => {
        // Email Validation
        setIsValidEmail(/@(gmail\.com|hotmail\.com)$/.test(email));

        // Password Validation
        setHasMinLength(password.length >= 6);
        setHasUpperCase(/[A-Z]/.test(password));
        setHasNumber(/[0-9]/.test(password));
    }, [email, password]);

    const isFormValid = isValidEmail && hasMinLength && hasUpperCase && hasNumber && name.length > 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role: accountType,
                    }
                }
            });

            if (error) {
                alert("Kayıt hatası: " + error.message);
            } else if (data.user) {
                // 1. Eğer 'business' hesabı ise Tenants tablosunda işletme oluştur
                let tenantId = null;

                if (accountType === "business") {
                    const { data: tenant, error: tenantError } = await supabase
                        .from('tenants')
                        .insert({
                            name: name, // İşletme adı
                            subscription_tier: 'free'
                        })
                        .select()
                        .single();

                    if (!tenantError && tenant) {
                        tenantId = tenant.id;
                    } else {
                        console.error("Tenant creation failed:", tenantError);
                    }
                }

                // 2. Profiles tablosuna kullanıcıyı ekle
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        full_name: name,
                        role: accountType === 'business' ? 'owner' : 'customer',
                        tenant_id: tenantId // Bireysel ise null, işletme ise ID
                    });

                if (profileError) {
                    console.error("Profile creation failed:", profileError);
                    // Kritik hata değil, auth çalıştı. Kullanıcı sonradan profili tamamlayabilir.
                }

                alert("Kayıt başarılı! Veritabanı ve profiliniz oluşturuldu.");
                router.push("/login");
            }
        } catch (error) {
            console.error("Register error:", error);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* HESAP TÜRÜ SEÇİMİ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hesap Türü</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setAccountType("business")}
                            className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all ${accountType === "business"
                                ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600 ring-offset-2"
                                : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            <span className="mr-2">🏢</span> Kurumsal
                        </button>
                        <button
                            type="button"
                            onClick={() => setAccountType("individual")}
                            className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all ${accountType === "individual"
                                ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600 ring-offset-2"
                                : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            <span className="mr-2">👤</span> Bireysel
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        {accountType === "business" ? "İşletme Adı" : "Ad Soyad"}
                    </label>
                    <div className="mt-1">
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            placeholder={accountType === "business" ? "Örn: Gold Makas" : "Örn: Ahmet Yılmaz"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        E-posta Adresi
                    </label>
                    <div className="mt-1">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="ornek@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={email && !isValidEmail ? "border-red-300 focus-visible:ring-red-500" : ""}
                        />
                    </div>
                    {email && !isValidEmail && (
                        <p className="mt-1 text-xs text-red-500">Sadece Gmail veya Hotmail adresleri kabul edilmektedir.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Şifre
                    </label>
                    <div className="mt-1">
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Şifre Gereksinimleri */}
                    <div className="mt-3 space-y-2 text-xs">
                        <div className={`flex items-center gap-2 ${hasMinLength ? "text-green-600" : "text-gray-500"}`}>
                            {hasMinLength ? <Check className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-400" />}
                            En az 6 karakter
                        </div>
                        <div className={`flex items-center gap-2 ${hasUpperCase ? "text-green-600" : "text-gray-500"}`}>
                            {hasUpperCase ? <Check className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-400" />}
                            En az 1 büyük harf (A-Z)
                        </div>
                        <div className={`flex items-center gap-2 ${hasNumber ? "text-green-600" : "text-gray-500"}`}>
                            {hasNumber ? <Check className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-400" />}
                            En az 1 rakam (0-9)
                        </div>
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !isFormValid}
                    >
                        {loading ? "Kaydediliyor..." : "Hesap Oluştur"}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Zaten hesabınız var mı?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Giriş yapın
                    </Link>
                </p>
            </div>
        </div>
    );
}
