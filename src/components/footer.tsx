import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white py-12">
            <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-8">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Randevulu. Tüm hakları saklıdır.
                </p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                        Gizlilik
                    </Link>
                    <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                        Şartlar
                    </Link>
                    <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">
                        İletişim
                    </Link>
                </div>
            </div>
        </footer>
    );
}
