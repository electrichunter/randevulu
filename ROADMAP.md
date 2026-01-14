# 🗺️ Proje Yol Haritası

Bu döküman, Randevulu projesinin stratejik vizyonunu ve geliştirme yol haritasını özetlemektedir.

## 1. Ürün Felsefesi: "Yeterince İyi ve Daima Çalışan"

Küçük işletmeler için en büyük risk teknolojik gerilik değil, sistem karmaşıklığı nedeniyle kullanımın terk edilmesidir.

- **Odak Noktası**: Karmaşık state yönetimleri yerine, zayıf internet bağlantısında dahi çalışan (Offline-First) ve esnafın zaten kullandığı araçlarla (WhatsApp/SMS) entegre bir yapı.
- **Multi-tenancy**: Tek bir veritabanı üzerinde `tenant_id` bazlı mantıksal ayrım ile maliyetlerin minimize edilmesi.

## 2. Teknik Mimari ve Sadelik (Robustness)

Karmaşık hibrit yapılardan ziyade, bakım yükü düşük ve hata toleransı yüksek bir teknoloji yığını seçilmiştir.

- **Çekirdek**: Next.js (App Router)
- **Veri Yönetimi (Offline Desteği)**: Kritik veriler (günlük randevular, müşteri listesi) tarayıcı tarafında IndexedDB (Dexie.js) ile önbelleklenecektir.
- **Veritabanı**: PostgreSQL (Supabase) üzerinde Row Level Security (RLS) ile tenant izolasyonu.
- **Entegrasyonlar**: Google Calendar API ve yerel muhasebe yazılımları için basit JSON dışa aktarım modülleri.

## 3. Pratik Güvenlik ve KVKK Uygulaması

- **Anahtar Yönetimi**: Hassas veriler için yönetilen servislerde (Supabase Vault) şifreleme.
- **Yedekleme**: Günlük otomatik "Point-in-Time Recovery" (PITR) yedekleme.
- **Hukuki Uyum**: "Aydınlatma Metni" ve "Açık Rıza" gibi KVKK gereksinimleri için otomatikleştirilmiş süreçler.

## 4. Geliştirme Fazları

Proje, aşağıdaki fazlara ayrılarak geliştirilecektir.

### Faz 1 (Hafta 1-4): Mimari ve Temel Kurulum
- **Hedef**: Sağlam bir temel oluşturmak.
- **Çıktılar**:
    - Proje iskeleti ve teknoloji yığını kurulumu.
    - Supabase entegrasyonu ve veritabanı şeması.
    - Multi-tenant yapı ve RLS politikaları.
    - Kimlik doğrulama (Authentication) sistemi (Login, Signup, JWT yönetimi).

### Faz 2 (Hafta 5-8): Çekirdek Fonksiyonellik
- **Hedef**: Ürünün ana özelliklerini hayata geçirmek.
- **Çıktılar**:
    - Dashboard ve ana kullanıcı arayüzü.
    - Randevu yönetimi (Oluşturma, düzenleme, listeleme).
    - Müşteri yönetimi (CRM) modülü.
    - Offline-first yeteneklerinin Dexie.js ile entegrasyonu.

### Faz 3 (Hafta 9-11): Entegrasyonlar ve Güvenlik
- **Hedef**: Platformu dış servislerle entegre etmek ve güvenlik katmanını güçlendirmek.
- **Çıktılar**:
    - Google Calendar senkronizasyonu.
    - WhatsApp/SMS bildirim entegrasyonları.
    - Veri şifreleme ve güvenlik iyileştirmeleri.
    - Performans optimizasyonu ve hata takibi (Sentry).

### Faz 4 (Hafta 12-15): Test, Lansman ve İyileştirme
- **Hedef**: Ürünü test etmek, yayına almak ve geri bildirimlere göre iyileştirmek.
- **Çıktılar**:
    - Kapalı beta testi ve kullanıcı geri bildirimlerinin toplanması.
    - CI/CD pipeline kurulumu ve otomatik testler (Playwright).
    - Production ortamına "Soft Launch".
    - İzleme (Monitoring) ve destek altyapısının kurulması.

## Gelecek Vizyonu
- WhatsApp Business API ile tam entegrasyon.
- Gelişmiş analitik ve raporlama paneli.
- Ödeme ağ geçidi entegrasyonu.
- PWA (Progressive Web App) özellikleri.
