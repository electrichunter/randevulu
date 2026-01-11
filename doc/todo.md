# Randevulu - Detaylı TODO Listesi

Bu TODO listesi, Randevulu projesinin (Esnaf & Müşteri CRM ve İletişim Platformu) geliştirme sürecini detaylı olarak özetlemektedir. Roadmap'a göre 15 haftalık plan temel alınmıştır. Her görev, haftalara göre gruplandırılmış ve alt görevlerle detaylandırılmıştır.

## Genel İlkeler
- **Simplicity First**: Kullanıcı dostu, karmaşık olmayan tasarım.
- **Offline-First**: Kritik veriler (günlük randevular) IndexedDB/Dexie.js ile saklanacak.
- **Multi-Tenant**: PostgreSQL/Supabase RLS ile mantıksal tenant izolasyonu.
- **Güvenlik**: AWS KMS/Supabase Vault ile anahtar yönetimi, GDPR uyumluluğu.
- **Maliyet**: Düşük maliyet (Supabase ücretsiz tier, Vercel/Cloudflare hosting).
- **Onboarding**: WhatsApp onayları, Excel importları ile sıfır eğitim.
- **Test**: E2E (Playwright), Load Test (k6).
- **Stack**: Next.js App Router (minimal RSC/Server Actions), PostgreSQL, Sentry.

## Hafta 1-4: Mimari, Kimlik Doğrulama ve Veritabanı Şeması
### Hafta 1: Proje Kurulumu ve Temel Mimari
- [ ] Next.js projesi kurulumu (src/app yapısı).
- [ ] Tailwind CSS v4 konfigürasyonu.
- [ ] Supabase projesi oluşturma ve bağlantı kurulumu.
- [ ] PostgreSQL şeması tasarımı (tenant, user, customer tabloları).
- [ ] Environment variables ayarları (Supabase URL, anon key).
- [ ] Basic layout ve global CSS güncellemeleri.

### Hafta 2: Kimlik Doğrulama Sistemi
- [ ] Supabase Auth entegrasyonu (email/password, Google OAuth).
- [ ] Login sayfası tasarımı ve implementasyonu.
- [ ] Signup sayfası (esnaf/müşteri rolleri).
- [ ] Password reset fonksiyonu.
- [ ] Middleware ile route koruması (auth required pages).
- [ ] JWT token yönetimi ve session handling.

### Hafta 3: Veritabanı Şeması ve Temel Modeller
- [ ] Tenant tablosu (multi-tenant için).
- [ ] User tablosu (esnaf/müşteri bilgileri).
- [ ] Customer tablosu (müşteri detayları, iletişim).
- [ ] Appointment tablosu (randevu bilgileri).
- [ ] Service tablosu (hizmet türleri).
- [ ] Supabase RLS politikaları tanımlama.
- [ ] Seed data ekleme (test verileri).

### Hafta 4: Temel API Route'ları ve Server Actions
- [ ] Auth API route'ları (login, logout, signup).
- [ ] User management API'leri.
- [ ] Basic CRUD operations for customers.
- [ ] Appointment scheduling API'leri.
- [ ] Error handling ve validation (Zod ile).
- [ ] API documentation (Swagger/OpenAPI).

## Hafta 5-8: Çekirdek Özellikler ve Offline Yetenekler
### Hafta 5: Dashboard ve Ana Sayfa
- [ ] Dashboard layout tasarımı (sidebar, header).
- [ ] Ana dashboard sayfası (günlük randevular, istatistikler).
- [ ] Navigation menu (randevular, müşteriler, ayarlar).
- [ ] Responsive design (mobile-first).
- [ ] Dark mode desteği (opsiyonel, simplicity için kaldırılabilir).

### Hafta 6: Randevu Yönetimi
- [ ] Randevu listesi sayfası.
- [ ] Randevu oluşturma/editleme formu.
- [ ] Takvim entegrasyonu (Google Calendar API).
- [ ] Randevu hatırlatma sistemi (WhatsApp/SMS).
- [ ] Offline randevu senkronizasyonu (IndexedDB).

### Hafta 7: Müşteri Yönetimi
- [ ] Müşteri listesi ve arama.
- [ ] Müşteri profili sayfası.
- [ ] Excel import/export fonksiyonu.
- [ ] Müşteri notları ve tarihçe.
- [ ] GDPR uyumlu veri silme.

### Hafta 8: Offline Yetenekler ve Senkronizasyon
- [ ] Dexie.js kurulumu ve konfigürasyonu.
- [ ] Kritik verilerin offline saklanması.
- [ ] Online olduğunda senkronizasyon.
- [ ] Conflict resolution (çakışan randevular).
- [ ] Offline indicator UI.

## Hafta 9-11: Güvenlik, Entegrasyonlar ve İyileştirmeler
### Hafta 9: Güvenlik ve Anahtar Yönetimi
- [ ] AWS KMS/Supabase Vault entegrasyonu.
- [ ] Hassas verilerin şifreleme.
- [ ] Audit logs.
- [ ] Rate limiting.
- [ ] Security headers (CSP, HSTS).

### Hafta 10: Entegrasyonlar
- [ ] Google Calendar tam entegrasyon.
- [ ] WhatsApp Business API (mesaj gönderme).
- [ ] SMS entegrasyonu (Twilio veya benzeri).
- [ ] Email notifications (SendGrid).
- [ ] Payment gateway (opsiyonel, ücretli hizmetler için).

### Hafta 11: İyileştirmeler ve Optimizasyon
- [ ] Performance optimization (lazy loading, caching).
- [ ] SEO ve meta tags.
- [ ] Accessibility (WCAG uyumluluğu).
- [ ] Error boundaries ve monitoring (Sentry).
- [ ] Beta feedback sistemi.

## Hafta 12-13: Beta Test ve Hata Düzeltmeleri
### Hafta 12: Beta Hazırlık
- [ ] User acceptance testing (UAT) ortamı.
- [ ] Beta kullanıcıları için onboarding.
- [ ] Feedback formu ve analitik.
- [ ] Documentation güncellemeleri.

### Hafta 13: Hata Düzeltmeleri ve İyileştirmeler
- [ ] Bug fixing (Playwright testleri ile).
- [ ] Performance tuning.
- [ ] UI/UX iyileştirmeleri.
- [ ] Security audit.

## Hafta 14-15: Lansman ve CI/CD
### Hafta 14: CI/CD Kurulumu
- [ ] GitHub Actions workflow.
- [ ] Automated testing (unit, E2E).
- [ ] Deployment pipeline (Vercel/Cloudflare).
- [ ] Environment management (dev, staging, prod).

### Hafta 15: Lansman ve İzleme
- [ ] Production deployment.
- [ ] Monitoring ve alerting (Sentry, analytics).
- [ ] User support sistemi.
- [ ] Post-launch improvements.
- [ ] Documentation finalization.

## Ek Görevler ve Notlar
- [ ] Component library oluşturma (shadcn/ui veya benzeri).
- [ ] Internationalization (i18n) desteği (Türkçe/İngilizce).
- [ ] PWA özellikleri (service worker, manifest).
- [ ] Backup ve disaster recovery planı.
- [ ] Legal compliance (KVKK, GDPR).

Bu liste roadmap'a göre dinamik olarak güncellenebilir. Her görev tamamlandığında işaretlenmeli ve detaylar eklenmelidir.</content>
<parameter name="filePath">/home/ouysal/randevulu/doc/todo.md