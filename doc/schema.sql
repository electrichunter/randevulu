-- Randevulu Database Schema (Hata Korumalı & Tam Kurulum)
-- Bu kodu Supabase SQL Editor'e yapıştırıp çalıştırabilirsiniz.
-- Tablolar varsa atlar, yoksa oluşturur.

-- 1. TENANTS TABLE (İŞLETMELER)
create table if not exists public.tenants (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  subscription_tier text default 'free', -- free, pro
  settings jsonb default '{}'::jsonb -- İşletme ayarları (açıklama, telefon, ödeme yöntemleri vb.)
);

-- 2. PROFILES TABLE (KULLANICI PROFİLLERİ - Esnaf veya Müşteri)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  tenant_id uuid references public.tenants(id) on delete cascade, -- Hangi işletmeye ait (veya sahibi)
  full_name text,
  role text default 'customer', -- owner, staff, customer
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CUSTOMERS TABLE (MÜŞTERİLER)
create table if not exists public.customers (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  full_name text not null,
  phone text,
  email text,
  notes text,
  imported_from text, -- 'excel', 'manual', 'contacts'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SERVICES TABLE (HİZMETLER)
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  name text not null,
  duration_minutes integer default 30,
  price decimal(10, 2),
  currency text default 'TRY',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. NOTIFICATIONS TABLE (BİLDİRİMLER)
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null, -- 'appointment_approved', 'appointment_rejected', 'appointment_reminder', 'appointment_created'
  title text not null,
  message text not null,
  related_appointment_id uuid,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. APPOINTMENTS TABLE (RANDEVULAR)
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  customer_id uuid references public.customers(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete set null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text default 'pending', -- pending, confirmed, cancelled, completed
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) on delete set null
);

-- INDEXES (PERFORMANS İÇİN)
create index if not exists idx_customers_tenant on public.customers(tenant_id);
create index if not exists idx_appointments_tenant on public.appointments(tenant_id);
create index if not exists idx_appointments_date on public.appointments(start_time);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);

-- RLS (ROW LEVEL SECURITY) - GÜVENLİK AYARLARI
-- Tabloları güvenli moda al
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.notifications enable row level security;
alter table public.appointments enable row level security;

-- MEVCUT POLİTİKALARI TEMİZLE (Hata vermemesi için önce siliyoruz)
drop policy if exists "Enable read access for all users" on public.tenants;
drop policy if exists "Enable insert access for all users" on public.tenants;
drop policy if exists "Enable update access for all users" on public.tenants;

drop policy if exists "Enable read access for all users" on public.profiles;
drop policy if exists "Enable insert access for all users" on public.profiles;
drop policy if exists "Enable update access for all users" on public.profiles;

drop policy if exists "Enable read access for all users" on public.customers;
drop policy if exists "Enable insert access for all users" on public.customers;
drop policy if exists "Enable update access for all users" on public.customers;

drop policy if exists "Enable read access for all users" on public.services;
drop policy if exists "Enable insert access for all users" on public.services;
drop policy if exists "Enable update access for all users" on public.services;

drop policy if exists "Enable read access for all users" on public.appointments;
drop policy if exists "Enable insert access for all users" on public.appointments;
drop policy if exists "Enable update access for all users" on public.appointments;

drop policy if exists "Enable read access for all users" on public.notifications;
drop policy if exists "Enable insert access for all users" on public.notifications;
drop policy if exists "Enable update access for all users" on public.notifications;

-- YENİ POLİTİKALAR (Geliştirme aşaması için geniş izinler)
-- NOT: Canlıya (Production) geçmeden önce burayı "sadece kendi tenant_id'sine erişebilsin" şeklinde kısıtlayacağız.
-- Şimdilik RLS hatası almamak için izin veriyoruz.

-- Tenants
create policy "Enable read access for all users" on public.tenants for select using (true);
create policy "Enable insert access for all users" on public.tenants for insert with check (true);
create policy "Enable update access for all users" on public.tenants for update using (true);

-- Profiles
create policy "Enable read access for all users" on public.profiles for select using (true);
create policy "Enable insert access for all users" on public.profiles for insert with check (true);
create policy "Enable update access for all users" on public.profiles for update using (true);

-- Customers
create policy "Enable read access for all users" on public.customers for select using (true);
create policy "Enable insert access for all users" on public.customers for insert with check (true);
create policy "Enable update access for all users" on public.customers for update using (true);

-- Services
create policy "Enable read access for all users" on public.services for select using (true);
create policy "Enable insert access for all users" on public.services for insert with check (true);
create policy "Enable update access for all users" on public.services for update using (true);

-- Appointments
create policy "Enable read access for all users" on public.appointments for select using (true);
create policy "Enable insert access for all users" on public.appointments for insert with check (true);
create policy "Enable update access for all users" on public.appointments for update using (true);

-- Notifications
create policy "Enable read access for all users" on public.notifications for select using (true);
create policy "Enable insert access for all users" on public.notifications for insert with check (true);
create policy "Enable update access for all users" on public.notifications for update using (true);

