import { createClient } from '@supabase/supabase-js';

// Ortam değişkenlerini kontrol et
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Build sırasında hata vermemesi için uyarı verip boş client dönüyoruz (veya hata fırlatabiliriz)
    // Ancak runtime'da hata olması daha iyidir.
    console.warn("Supabase URL veya Anon Key eksik! .env.local dosyasını kontrol edin.");
}

// Standart client (Public/RLS bağımlı)
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

// Admin Key kontrolü (Sadece Server side)
if (typeof window === 'undefined' && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY eksik! Server Action'lar RLS engeline takılabilir.");
}

// Admin client (Service Role - RLS Bypass)
// SADECE Server Action'larda ve güvenli ortamlarda kullanılmalıdır!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseServiceRoleKey || supabaseAnonKey || 'placeholder',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);
