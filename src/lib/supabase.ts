import { createClient } from '@supabase/supabase-js';

// Ortam değişkenlerini kontrol et
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Build sırasında hata vermemesi için uyarı verip boş client dönüyoruz (veya hata fırlatabiliriz)
    // Ancak runtime'da hata olması daha iyidir.
    console.warn("Supabase URL veya Anon Key eksik! .env.local dosyasını kontrol edin.");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
