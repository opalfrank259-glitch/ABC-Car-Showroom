-- ==============================================================================
-- ABC CAR SHOWROOM - MIGRATION 0001: FOUNDATION SCHEMA
-- ==============================================================================
-- Description:
--   Establishes baseline system tables, audit logging, site configurations,
--   role constraints, security helper functions, and Row Level Security (RLS).
--
-- Tables:
--   - public.profiles
--   - public.site_settings_public
--   - public.site_settings_private
--   - public.audit_logs
--
-- Execution:
--   Run in Supabase Dashboard -> SQL Editor (or via supabase db push).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. UTILITY TRIGGER FUNCTION: set_updated_at
-- ------------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------------------------
-- 2. TABLE: profiles
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'staff' check (role in ('super_admin', 'staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Constraint: Guarantee that only one active super_admin can exist in the system
create unique index if not exists idx_profiles_single_active_super_admin
  on public.profiles (role)
  where (role = 'super_admin' and is_active = true);

-- Auto-update updated_at timestamp on row modification
drop trigger if exists trigger_profiles_updated_at on public.profiles;
create trigger trigger_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 3. TABLE: site_settings_public (Public read, admin write)
-- ------------------------------------------------------------------------------
create table if not exists public.site_settings_public (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists trigger_site_settings_public_updated_at on public.site_settings_public;
create trigger trigger_site_settings_public_updated_at
  before update on public.site_settings_public
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 4. TABLE: site_settings_private (Admin read/write only, no client secrets)
-- ------------------------------------------------------------------------------
create table if not exists public.site_settings_private (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists trigger_site_settings_private_updated_at on public.site_settings_private;
create trigger trigger_site_settings_private_updated_at
  before update on public.site_settings_private
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 5. TABLE: audit_logs
-- ------------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Fast lookup for audit trail timelines and entity investigations
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);
create index if not exists idx_audit_logs_entity on public.audit_logs (entity_type, entity_id);

-- ------------------------------------------------------------------------------
-- 6. SECURITY HELPER FUNCTIONS (SECURITY DEFINER)
-- ------------------------------------------------------------------------------
-- Checks if the authenticated user has active super_admin privileges
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'super_admin'
      and is_active = true
  );
$$;

-- Checks if the authenticated user has an active staff account (staff or super_admin)
create or replace function public.is_active_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_active = true
  );
$$;

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all foundation tables
alter table public.profiles enable row level security;
alter table public.site_settings_public enable row level security;
alter table public.site_settings_private enable row level security;
alter table public.audit_logs enable row level security;

-- --- profiles policies ---
-- Policy 1: Users can read their own profile row
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

-- Policy 2: Super admin can inspect all user profiles
drop policy if exists "Super admin can read all profiles" on public.profiles;
create policy "Super admin can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_super_admin());

-- Policy 3: Super admin can insert, update, and delete profiles
drop policy if exists "Super admin can manage profiles" on public.profiles;
create policy "Super admin can manage profiles"
  on public.profiles
  for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- --- site_settings_public policies ---
-- Policy 1: Anyone (anonymous visitors and logged-in staff) can read public settings
drop policy if exists "Public read access for site_settings_public" on public.site_settings_public;
create policy "Public read access for site_settings_public"
  on public.site_settings_public
  for select
  to anon, authenticated
  using (true);

-- Policy 2: Only super admin can insert/update/delete public settings
drop policy if exists "Super admin write access for site_settings_public" on public.site_settings_public;
create policy "Super admin write access for site_settings_public"
  on public.site_settings_public
  for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- --- site_settings_private policies ---
-- Policy: Only super admin can read or modify private settings; anonymous users have zero access
drop policy if exists "Super admin full access for site_settings_private" on public.site_settings_private;
create policy "Super admin full access for site_settings_private"
  on public.site_settings_private
  for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- --- audit_logs policies ---
-- Policy: Only super admin can read audit history. No direct insert/update/delete from clients.
drop policy if exists "Super admin can read audit logs" on public.audit_logs;
create policy "Super admin can read audit logs"
  on public.audit_logs
  for select
  to authenticated
  using (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 8. INITIAL PUBLIC SITE SETTINGS SEED (IDEMPOTENT)
-- ------------------------------------------------------------------------------
-- Inserts strictly verified real information; placeholders set to explicit JSON null.
-- No invented email, fake domains, or fictitious social accounts.
insert into public.site_settings_public (key, value)
values
  (
    'phones',
    '[{"label":"Sales","number_e164":"+923271126457","display":"0327-1126457","is_primary":true,"whatsapp":true}]'::jsonb
  ),
  ('stock_prefix', '"ABC"'::jsonb),
  ('showroom_name', '"ABC"'::jsonb),
  ('city', '"Sadiqabad, Punjab, Pakistan"'::jsonb),
  ('currency', '"PKR"'::jsonb),
  ('timezone', '"Asia/Karachi"'::jsonb),
  ('address', 'null'::jsonb),
  ('maps_url', 'null'::jsonb),
  ('business_hours', 'null'::jsonb),
  ('social_links', 'null'::jsonb),
  ('logo_url', 'null'::jsonb),
  ('email', 'null'::jsonb),
  ('domain', 'null'::jsonb)
on conflict (key) do nothing;
