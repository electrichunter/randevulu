"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CustomAlert } from "@/components/custom-alert";
import { ArrowLeft, Mail } from "lucide-react";

import { forgotPasswordSchema } from "@/lib/validations";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate with Zod
        const validation = forgotPasswordSchema.safeParse({ email });
        if (!validation.success) {
            toast.error(validation.error.issues[0].message);
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(validation.data.email, {
                redirectTo: `${window.location.origin}/dashboard/reset-password`,
            });

            if (error) {
                toast.error("Hata: " + error.message);
            } else {
                toast.success("E-posta Gönderildi! Şifre sıfırlama talimatları e-posta adresinize gönderildi.");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error("Beklenmedik bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Giriş Ekranına Dön
                    </Link>
                    <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Şifrenizi mi unuttunuz?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Endişelenmeyin, e-posta adresinizi girin ve size sıfırlama bağlantısını gönderelim.
                    </p>
                </div>

                <div className="bg-white px-6 py-8 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>


                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-posta Adresi
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="ornek@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 h-11 text-base shadow-lg shadow-blue-600/20"
                                disabled={loading}
                            >
                                {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
