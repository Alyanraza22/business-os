-- =============================================================================
-- profiles: application data, 1:1 with auth.users.
-- =============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  currency char(3) not null default 'USD',
  timezone text not null default 'UTC',
  theme text not null default 'dark' check (theme in ('light', 'dark', 'system')),
  working_hours_per_day numeric(4, 2) not null default 8
    check (working_hours_per_day >= 0 and working_hours_per_day <= 24),
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Application profile data, 1:1 with auth.users.';

-- updated_at maintenance
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-provision a profile when a new auth user is created -------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any users created before this table existed.
insert into public.profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  coalesce(
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name'
  ),
  u.raw_user_meta_data ->> 'avatar_url'
from auth.users as u
on conflict (id) do nothing;

-- Row Level Security ---------------------------------------------------------
alter table public.profiles enable row level security;

create policy profiles_select_own on public.profiles
  for select using ((select auth.uid()) = id);

create policy profiles_insert_own on public.profiles
  for insert with check ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
-- No delete policy: profiles are removed via cascade from auth.users.
