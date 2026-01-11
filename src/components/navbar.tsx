"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation"; // usePathname eklendi
import { User, LogOut, LayoutDashboard, Menu, X } from "lucide-react"; // İkonlar

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobil menü state
    const router = useRouter();
    const pathname = usePathname(); // Şu anki sayfa yolu

    // Auth durumunu dinle
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/");
        router.refresh(); // Sayfayı yenile ki durum güncellensin
    };

    // Eğer dashboard veya auth sayfalarındaysak, navbar davranışını özelleştirebiliriz
    // Şu an global istendiği için her yerde görünecek.

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                {/* LOGO */}
                <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Randevulu
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/explore" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                        İşletmeler
                    </Link>

                    {!user && (
                        <>
                            <Link href="/about" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                                Hakkımızda
                            </Link>
                            <Link href="/book" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                                Hızlı Randevu
                            </Link>
                        </>
                    )}

                    {user ? (
                        <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                            <span className="text-sm text-gray-500 font-medium hidden lg:inline-block">
                                {user.user_metadata.full_name || user.email}
                            </span>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className={pathname === "/dashboard" ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:text-blue-600"}>
                                    <LayoutDashboard className="h-4 w-4 mr-2" /> Panelim
                                </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <LogOut className="h-4 w-4 mr-2" /> Çıkış
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 border-l pl-6 border-gray-200">
                            <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors mr-2">
                                Giriş Yap
                            </Link>
                            <Link href="/register">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Hemen Başla
                                </Button>
                            </Link>
                        </div>
                    )}
                </nav>

                {/* MOBILE MENU TOGGLE */}
                <button className="md:hidden p-2 text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* MOBILE NAV */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-4 shadow-xl absolute w-full left-0 top-16">
                    <Link href="/explore" className="block text-sm font-medium text-slate-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                        İşletmeleri Keşfet
                    </Link>

                    {user ? (
                        <>
                            <div className="pt-2 border-t border-gray-100">
                                <div className="text-xs text-gray-400 mb-2">Hesabım</div>
                                <div className="font-medium text-gray-900 mb-4">{user.user_metadata.full_name || user.email}</div>
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full justify-start mb-2" variant="outline">
                                        <LayoutDashboard className="h-4 w-4 mr-2" /> Yönetim Paneli
                                    </Button>
                                </Link>
                                <Button className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" variant="ghost" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                                    <LogOut className="h-4 w-4 mr-2" /> Çıkış Yap
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/about" className="block text-sm font-medium text-slate-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                                Hakkımızda
                            </Link>
                            <div className="pt-4 flex flex-col gap-2">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="outline" className="w-full">Giriş Yap</Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full bg-blue-600">Kayıt Ol</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
