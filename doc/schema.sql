-- Randevulu Full Database Schema (Tables + Indexes + Secure RLS Policies)
-- Bu dosyayı Supabase SQL Editor'e yapıştırıp çalıştırabilirsiniz.

-- =============================================================================
-- 1. TABLES (TABLOLAR)
-- =============================================================================

-- TENANTS TABLE (İŞLETMELER)
create table if not exists public.tenants (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  subscription_tier text default 'free', -- free, pro
  settings jsonb default '{}'::jsonb -- İşletme ayarları (açıklama, telefon, ödeme yöntemleri vb.)
);

-- PROFILES TABLE (KULLANICI PROFİLLERİ - Esnaf veya Müşteri)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  tenant_id uuid references public.tenants(id) on delete cascade, -- Hangi işletmeye ait (veya sahibi)
  full_name text,
  phone text, -- Kullanıcı telefon numarası
  role text default 'customer', -- owner, staff, customer
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CUSTOMERS TABLE (MÜŞTERİLER)
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

-- SERVICES TABLE (HİZMETLER)
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  name text not null,
  duration_minutes integer default 30,
  price decimal(10, 2),
  currency text default 'TRY',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTIFICATIONS TABLE (BİLDİRİMLER)
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

-- APPOINTMENTS TABLE (RANDEVULAR)
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

-- =============================================================================
-- 2. INDEXES (PERFORMANS İÇİN)
-- =============================================================================

create index if not exists idx_customers_tenant on public.customers(tenant_id);
create index if not exists idx_appointments_tenant on public.appointments(tenant_id);
create index if not exists idx_appointments_date on public.appointments(start_time);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);

-- =============================================================================
-- 3. RLS SETUP (ROW LEVEL SECURITY)
-- =============================================================================

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.notifications enable row level security;
alter table public.appointments enable row level security;

-- MEVCUT POLİTİKALARI TEMİZLE
-- Clear all known policies to avoid conflicts
do $$
declare
  pol record;
begin
  for pol in (select policyname, tablename from pg_policies where schemaname = 'public')
  loop
    execute 'drop policy if exists ' || quote_ident(pol.policyname) || ' on ' || quote_ident(pol.tablename);
  end loop;
end $$;

-- =============================================================================
-- 4. UTILITY FUNCTIONS (GÜNCELLEME: Public şemasına alındı)
-- =============================================================================

-- Kullanıcının tenant_id'sini döndüren helper function
create or replace function public.get_auth_tenant_id()
returns uuid
language sql
security definer
stable
as $$
  select tenant_id from public.profiles where id = auth.uid()
$$;

-- Kullanıcının rolünü döndüren helper function
create or replace function public.get_auth_user_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- =============================================================================
-- 5. SECURE POLICIES (GÜVENLİ POLİTİKALAR)
-- =============================================================================

-- TENANTS
create policy "Anyone can view tenants" on public.tenants for select using (true);
create policy "Owners can update their tenant" on public.tenants for update using (id = public.get_auth_tenant_id() and public.get_auth_user_role() = 'owner') with check (id = public.get_auth_tenant_id());
create policy "Users can create tenant during signup" on public.tenants for insert with check (true);

-- PROFILES
create policy "Users can view their own profile" on public.profiles for select using (id = auth.uid());
create policy "Users can view profiles in their tenant" on public.profiles for select using (tenant_id = public.get_auth_tenant_id() and public.get_auth_user_role() in ('owner', 'staff'));
create policy "Users can create their own profile" on public.profiles for insert with check (id = auth.uid());
create policy "Users can update their own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- CUSTOMERS
create policy "Users can view customers in their tenant" on public.customers for select using (tenant_id = public.get_auth_tenant_id());
create policy "Anyone can create customers" on public.customers for insert with check (true);
create policy "Business users can update customers" on public.customers for update using (tenant_id = public.get_auth_tenant_id() and public.get_auth_user_role() in ('owner', 'staff')) with check (tenant_id = public.get_auth_tenant_id());
create policy "Owners can delete customers" on public.customers for delete using (tenant_id = public.get_auth_tenant_id() and public.get_auth_user_role() = 'owner');

-- SERVICES
create policy "Anyone can view services" on public.services for select using (true);
create policy "Business users can create services" on public.services for insert with check (tenant_id = public.get_auth_tenant_id() and public.get_auth_user_role() in ('owner', 'staff'));
create policy "Business users can update services" on public.services for update using (tenant_id = public.get_auth_tenant_id() and public.get_auth_user_role() in ('owner', 'staff')) with check (tenant_id = public.get_auth_tenant_id());
create policy "Owners can delete services" on public.services for delete using (tenant_id = public.get_auth_tenant_id() and public.get_auth_user_role() = 'owner');

-- APPOINTMENTS
create policy "Users can view their own appointments" on public.appointments for select using (created_by = auth.uid() or tenant_id = public.get_auth_tenant_id());
create policy "Anyone can create appointments" on public.appointments for insert with check (true);
create policy "Business users can update appointments" on public.appointments for update using (tenant_id = public.get_auth_tenant_id() and public.get_auth_user_role() in ('owner', 'staff')) with check (tenant_id = public.get_auth_tenant_id());
create policy "Customers can cancel their pending appointments" on public.appointments for update using (created_by = auth.uid() and public.get_auth_user_role() = 'customer' and status = 'pending') with check (status = 'cancelled');
create policy "Owners can delete appointments" on public.appointments for delete using (tenant_id = public.get_auth_tenant_id() and public.get_auth_user_role() = 'owner');

-- NOTIFICATIONS
create policy "Users can view their own notifications" on public.notifications for select using (user_id = auth.uid());
create policy "System can create notifications" on public.notifications for insert with check (true);
create policy "Users can update their own notifications" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can delete their own notifications" on public.notifications for delete using (user_id = auth.uid());
