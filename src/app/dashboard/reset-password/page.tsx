"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CustomAlert } from "@/components/custom-alert";
import { Check, Lock } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", title: string, content: string } | null>(null);
    const router = useRouter();

    // Validation States
    const [hasMinLength, setHasMinLength] = useState(false);
    const [hasUpperCase, setHasUpperCase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);

    useEffect(() => {
        // Password Validation
        setHasMinLength(password.length >= 6);
        setHasUpperCase(/[A-Z]/.test(password));
        setHasNumber(/[0-9]/.test(password));
    }, [password]);

    const isFormValid = hasMinLength && hasUpperCase && hasNumber;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setMessage({
                    type: "error",
                    title: "Hata",
                    content: error.message
                });
            } else {
                setMessage({
                    type: "success",
                    title: "Başarılı",
                    content: "Şifreniz başarıyla güncellendi. Yönlendiriliyorsunuz..."
                });
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            }
        } catch (error) {
            console.error("Update password error:", error);
            setMessage({
                type: "error",
                title: "Beklenmedik Hata",
                content: "Bir şeyler ters gitti."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Yeni Şifre Belirle
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Lütfen hesabınız için yeni ve güvenli bir şifre girin.
                    </p>
                </div>

                <div className="bg-white px-6 py-8 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {message && (
                            <CustomAlert
                                type={message.type === "success" ? "success" : "error"}
                                title={message.title}
                                message={message.content}
                            />
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Yeni Şifre
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    placeholder="******"
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
                                className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 h-11 text-base shadow-lg shadow-blue-600/20"
                                disabled={loading || !isFormValid}
                            >
                                {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
