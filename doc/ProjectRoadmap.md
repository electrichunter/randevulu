Esnaf & Müşteri CRM ve İletişim Platformu: Stratejik İş Planı ve Teknik Şartname (Revize v2.0)

İşbu döküman, teknolojik mükemmellikten ziyade operasyonel süreklilik, maliyet etkinliği ve kullanıcı benimsemesini merkeze alan, esnaf odaklı bir SaaS çözümünün yol haritasıdır.

1. Ürün Felsefesi: "Yeterince İyi ve Daima Çalışan"

Küçük işletmeler için en büyük risk teknolojik gerilik değil, sistem karmaşıklığı nedeniyle kullanımın terk edilmesidir.

Odak Noktası: Karmaşık state yönetimleri yerine, zayıf internet bağlantısında dahi çalışan (Offline-First) ve esnafın zaten kullandığı araçlarla (WhatsApp/SMS) entegre bir yapı.

Multi-tenancy: Tek bir veritabanı üzerinde tenant_id bazlı mantıksal ayrım ile maliyetlerin minimize edilmesi.

2. Teknik Mimari ve Sadelik (Robustness)

Karmaşık hibrit yapılardan ziyade, bakım yükü düşük ve hata toleransı yüksek bir stack seçilmiştir.

Çekirdek: Next.js (App Router) - Ancak RSC ve Server Actions sadece performansın kritik olduğu noktalarda, sistem kararlılığını bozmadan kullanılacaktır.

Veri Yönetimi (Offline Support): Kritik veriler (günlük randevular ve müşteri listesi) tarayıcı tarafında IndexedDB (Dexie.js vasıtasıyla) üzerinde önbelleklenecektir. İnternet kesintisinde esnaf takvimini görmeye devam edebilecektir.

Veritabanı: PostgreSQL (Supabase veya yönetilen bir RDS). Tenant Isolation politikası (Row Level Security - RLS) ile veriler kesin çizgilerle ayrılacaktır.

Entegrasyon Katmanı: Google Calendar API (Esnafın kişisel takvimiyle eşzamanlılık) ve yerel muhasebe yazılımları için basit JSON dışa aktarım (Export) modülleri.

3. Pratik Güvenlik ve KVKK Uygulaması

Güvenlik, teorik şifrelemeden operasyonel anahtar yönetimine (Key Management) evrilmiştir.

Anahtar Yönetimi (Encryption at Rest): AES-256 anahtarları uygulama kodunda değil, AWS KMS veya Supabase Vault gibi donanımsal/yönetilen servislerde saklanacaktır.

Yedekleme ve Felaket Kurtarma (DRP): * Günlük otomatik "Point-in-Time Recovery" (PITR) yedekleme.

Yedeklerin farklı bir coğrafi bölgede (Region) şifreli olarak depolanması.

Hukuki Uyum: Kayıt aşamasında otomatik üretilen "Aydınlatma Metni" ve "Açık Rıza" onay kutucukları. Müşteriye kendi verisini sildirme hakkını kullanabileceği bir "Self-Service" linki sağlanacaktır.

4. Toplam Sahip Olma Maliyeti (TCO) ve Operasyon

Bir esnafın aylık ödeyebileceği tutar sınırlıdır. Altyapı bu maliyete göre optimize edilmiştir.

Gider Kalemi

Tahmini Aylık Maliyet

Açıklama

Hosting (Vercel/Cloudflare)

$0 - $20

Başlangıçta ücretsiz plan yeterlidir.

Database (Supabase)

$0 - $25

500MB veriye kadar ücretsiz.

İletişim (Twilio/WhatsApp)

Kullanım Bazlı

Müşteri başına ~$0.01 - $0.05 (Opsiyonel).

Monitoring (Sentry)

$0

Hata takibi için ücretsiz katman.

SSL & Domain

~$15 (Yıllık)

Standart güvenlik gereksinimi.

5. Kullanıcı Onboarding ve Benimseme Stratejisi

Esnafın sistemi kullanmama riskine karşı "Sıfır Eğitim" politikası:

WhatsApp Entegrasyonu: Randevu onayları müşteriye WhatsApp üzerinden gider. Esnaf sadece sistemi onay merkezi olarak kullanır.

Hızlı Kurulum: Esnafın mevcut müşteri listesini Excel/Rehber üzerinden içeri aktarabilmesi (Data Import).

Basitleştirilmiş Arayüz: Sadece 3 ana menü: "Bugün", "Müşteriler", "Kasa".

6. Test ve Kalite Güvence (QA)

"Hata yapma lüksümüz yok" prensibiyle:

E2E Testler: Kritik akışlar (Randevu alma, giriş yapma) için Playwright ile haftalık otomatik testler.

Yük Testi: k6 kullanılarak eşzamanlı 1000 kullanıcı altında sistem yanıt süresinin < 2sn olduğunun doğrulanması.

Logging: Sentry entegrasyonu ile "Silent Fail" (sessiz hata) durumlarının önüne geçilmesi.

7. Revize Uygulama Takvimi (15 Hafta)

Daha gerçekçi bir geliştirme ve yayılım süreci:

Hafta 1-4 (Temel Mimar): Multi-tenancy yapısı, Auth ve temel veritabanı şeması.

Hafta 5-8 (Fonksiyonellik): Randevu algoritması, Offline-first yetenekleri ve Google Calendar senkronizasyonu.

Hafta 9-11 (Güvenlik & Entegrasyon): Şifreleme anahtar yönetimi, KVKK modülleri ve WhatsApp API entegrasyonu.

Hafta 12-13 (Alfa/Beta): Seçilmiş 5 pilot esnaf ile kapalı beta testi ve geri bildirim toplama.

Hafta 14-15 (Yayına Alış): CI/CD pipeline kurulumu, nihai testler ve "Soft Launch".

8. Teknik Beyan ve Sorumluluk

Bu sistem, ölçeklenebilirlikten ziyade sağlamlık (robustness) üzerine kurulmuştur. Her bir güncelleme, mevcut esnafın günlük operasyonunu bozmayacak şekilde "Blue-Green Deployment" stratejisiyle yayına alınacaktır. 🛠️🚀