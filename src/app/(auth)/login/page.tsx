"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true); // Default true
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            // Not: Supabase varsayılan olarak oturumu LocalStorage'da tutar (Beni Hatırla: Aktif).
            // Kullanıcı "Beni Hatırla"yı seçmese bile şimdilik varsayılan davranış korunuyor.

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                alert("Giriş başarısız: " + error.message);
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        E-posta Adresi
                    </label>
                    <div className="mt-1">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="ornek@esnaf.com"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Şifre
                        </label>
                        <div className="text-sm">
                            <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                Şifrenizi mi unuttunuz?
                            </Link>
                        </div>
                    </div>
                    <div className="mt-1">
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Beni hatırla
                        </label>
                    </div>


                </div>

                <div>
                    <Button
                        type="submit"
                        className="w-full flex justify-center"
                        disabled={loading}
                    >
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">
                            Veya
                        </span>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Hesabınız yok mu?{' '}
                        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Şimdi kayıt olun
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
