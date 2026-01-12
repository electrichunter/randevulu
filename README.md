# Randevulu - Esnaf &amp; Müşteri CRM ve Randevu Platformu

Modern, güvenli ve kullanıcı dostu bir randevu yönetim sistemi. İşletmeler ve bireysel kullanıcılar için tasarlanmış, offline-first yaklaşımı ile her koşulda çalışır.

## 🎯 Proje Hakkında

Randevulu, küçük ve orta ölçekli işletmelerin (berber, kuaför, güzellik salonu, danışmanlık vb.) randevularını dijital ortamda yönetmelerini sağlayan bir SaaS platformudur.

### Temel Özellikler

- 📅 **Randevu Yönetimi**: Kolay randevu oluşturma, düzenleme ve iptal
- 👥 **Müşteri Yönetimi**: Detaylı müşteri profilleri ve geçmiş takibi
- 🏢 **Multi-Tenant Mimari**: Her işletme kendi izole veritabanında
- 📱 **Offline-First**: İnternet olmadan da çalışır
- 🔔 **Bildirim Sistemi**: Randevu hatırlatmaları ve durum güncellemeleri
- 🗺️ **Konum Servisleri**: İşletme konumları ve harita entegrasyonu
- 🔐 **Güvenli Kimlik Doğrulama**: Supabase Auth ile modern güvenlik

## 🛠️ Teknoloji Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Component Library**: Radix UI
- **Icons**: Lucide React
- **Maps**: Leaflet + React Leaflet

### Backend & Database
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Authentication
- **ORM**: Supabase Client
- **Local Storage**: Dexie.js (IndexedDB)

### DevOps & Tooling
- **Language**: TypeScript 5
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Deployment**: Vercel (recommended)

## 🚀 Kurulum

### Gereksinimler

- Node.js 20+ 
- npm veya yarn
- Supabase hesabı

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/randevulu.git
cd randevulu
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables Ayarlayın

`.env.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.example .env.local
```

Ardından `.env.local` dosyasını düzenleyip Supabase bilgilerinizi ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Supabase anahtarlarınızı nereden bulabilirsiniz?**
> 1. [Supabase Dashboard](https://app.supabase.com)
> 2. Projenizi seçin
> 3. Settings → API
> 4. "Project URL" ve "anon public" anahtarını kopyalayın

### 4. Veritabanı Şemasını Oluşturun

Supabase SQL Editor'de `doc/schema.sql` dosyasındaki SQL kodunu çalıştırın:

1. Supabase Dashboard → SQL Editor
2. "New Query" butonuna tıklayın
3. `doc/schema.sql` içeriğini yapıştırın
4. "Run" butonuna tıklayın

### 5. Development Server'ı Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
randevulu/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages (login, register)
│   │   ├── dashboard/         # Protected dashboard pages
│   │   ├── explore/           # Public business discovery
│   │   └── api/               # API routes (if any)
│   ├── components/            # Reusable React components
│   │   └── ui/                # UI primitives (buttons, inputs, etc.)
│   └── lib/                   # Utility functions and configurations
│       ├── supabase.ts        # Supabase client
│       ├── db.ts              # Dexie (IndexedDB) for offline
│       └── geocoding.ts       # Location services
├── doc/                       # Project documentation
│   ├── schema.sql             # Database schema (development)
│   ├── ProjectRoadmap.md      # Strategic roadmap
│   └── todo.md                # Detailed task list
├── public/                    # Static assets
└── package.json
```

## 🔐 Güvenlik

Randevulu, modern güvenlik standartlarını takip eder:

- ✅ **Supabase Auth**: bcrypt ile şifrelenmiş parolalar
- ✅ **Row Level Security (RLS)**: Veritabanı seviyesinde yetkilendirme
- ✅ **JWT Token Yönetimi**: Otomatik token yenileme
- ✅ **HTTPS Only**: Production'da zorunlu güvenli bağlantı
- ⚠️ **Environment Variables**: Hassas bilgiler asla git'e commit edilmez

### Güvenlik Kontrol Listesi

- [ ] `.env` dosyası `.gitignore`'da
- [ ] Production'da RLS politikaları güncellendi
- [ ] Supabase "anon" anahtarı public, "service_role" anahtarı gizli
- [ ] CORS ayarları production domain'e kısıtlı

## 🎨 Development Workflow

### Yeni Özellik Eklemek

1. Feature branch oluşturun: `git checkout -b feature/yeni-ozellik`
2. Geliştirmeyi yapın
3. Test edin: `npm run lint`
4. Commit edin: `git commit -m "feat: yeni özellik eklendi"`
5. Push edin: `git push origin feature/yeni-ozellik`
6. Pull Request açın

### Code Style

- ESLint konfigürasyonunu takip edin
- Component'ler için PascalCase, dosyalar için kebab-case
- TypeScript strict mode aktif

## 🚢 Deployment

### Vercel ile Deploy (Önerilen)

1. GitHub repository'nizi Vercel'e bağlayın
2. Environment Variables'ı Vercel Dashboard'dan ekleyin
3. Deploy butonuna tıklayın

Detaylı bilgi: [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)

### Production Checklist

- [ ] Environment variables production'da ayarlandı
- [ ] Supabase production database hazır
- [ ] RLS politikaları `using (true)` yerine tenant-based
- [ ] Analytics kuruldu (Google Analytics, Plausible, vb.)
- [ ] Error monitoring kuruldu (Sentry)
- [ ] Domain SSL sertifikası aktif

## 📱 Offline Özellikler

Randevulu, Dexie.js kullanarak kritik verileri tarayıcıda saklar:

- Günlük randevular
- Müşteri listesi
- Offline modda yapılan değişiklikler online olunca senkronize edilir

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull Request gönderin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Proje Sahibi**: [GitHub @yourusername](https://github.com/yourusername)
- **Issues**: [GitHub Issues](https://github.com/yourusername/randevulu/issues)

## 🗺️ Roadmap

Detaylı roadmap için [doc/ProjectRoadmap.md](./doc/ProjectRoadmap.md) dosyasına bakın.

### Gelecek Özellikler

- [ ] WhatsApp Business API entegrasyonu
- [ ] Google Calendar senkronizasyonu
- [ ] Multi-language support (i18n)
- [ ] PWA özellikleri (service worker)
- [ ] Payment gateway entegrasyonu
- [ ] Advanced analytics dashboard

---

**Not**: Bu proje aktif geliştirme aşamasındadır. Production kullanımı öncesinde tüm güvenlik kontrolleri yapılmalıdır.
