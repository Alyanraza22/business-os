-- =============================================================================
-- projects: the hub entity. Tasks and time logs belong to a project; goals,
-- earnings and notes may optionally reference one.
-- =============================================================================

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  description text,
  status public.project_status not null default 'planning',
  priority public.priority not null default 'medium',
  deadline date,
  progress smallint not null default 0 check (progress between 0 and 100),
  color text not null default '#6366F1' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.projects is 'User projects. Hours worked and related counts are derived, not stored.';

-- Indexes: active-project listing and deadline lookups.
create index projects_user_status_idx
  on public.projects (user_id, status) where deleted_at is null;
create index projects_user_deadline_idx
  on public.projects (user_id, deadline);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- Row Level Security ---------------------------------------------------------
alter table public.projects enable row level security;

create policy projects_select_own on public.projects
  for select using ((select auth.uid()) = user_id);
create policy projects_insert_own on public.projects
  for insert with check ((select auth.uid()) = user_id);
create policy projects_update_own on public.projects
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy projects_delete_own on public.projects
  for delete using ((select auth.uid()) = user_id);
