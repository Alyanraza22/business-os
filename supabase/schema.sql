-- =============================================================================
-- Business OS — Full schema bootstrap (generated from supabase/migrations/).
-- One-time manual application: paste into Supabase Dashboard → SQL Editor → Run.
-- Do NOT include seed.sql here (that creates a local-only demo user).
-- =============================================================================

-- >>> supabase/migrations/20260628120000_prelude.sql
-- =============================================================================
-- Prelude: extensions, enums, and shared trigger functions.
-- Runs first. Tables, indexes, triggers and RLS live in their own migrations.
-- =============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists pgcrypto; -- gen_random_uuid()
create extension if not exists citext; -- case-insensitive text (future usernames)

-- Enums ----------------------------------------------------------------------
create type public.project_status as enum (
  'planning', 'active', 'paused', 'completed', 'archived'
);
create type public.task_status as enum (
  'todo', 'in_progress', 'completed', 'cancelled'
);
create type public.priority as enum (
  'low', 'medium', 'high', 'urgent'
);
create type public.goal_type as enum (
  'daily', 'weekly', 'monthly', 'yearly'
);
create type public.goal_status as enum (
  'active', 'completed', 'archived'
);
create type public.earning_category as enum (
  'freelancing', 'etsy', 'affiliate', 'ads', 'other'
);

-- Shared trigger: keep updated_at fresh on every write ------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Shared trigger: stamp / clear completed_at based on status -----------------
-- Applied to any table that has both `status` and `completed_at` columns
-- where the status enum contains a 'completed' value (tasks, goals).
create or replace function public.set_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and (old.status is distinct from 'completed') then
    new.completed_at = now();
  elsif new.status <> 'completed' then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

-- >>> supabase/migrations/20260628120100_profiles.sql
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

-- >>> supabase/migrations/20260628120200_projects.sql
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

-- >>> supabase/migrations/20260628120300_tasks.sql
-- =============================================================================
-- tasks: each task belongs to exactly one project (project.md §10).
-- user_id is denormalized so RLS never needs a join.
-- =============================================================================

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  status public.task_status not null default 'todo',
  priority public.priority not null default 'medium',
  due_date date,
  estimated_hours numeric(6, 2) check (estimated_hours >= 0),
  labels text[] not null default '{}',
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.tasks is 'Project tasks. actual_hours is derived from time_logs.';

create index tasks_user_status_idx
  on public.tasks (user_id, status) where deleted_at is null;
create index tasks_project_idx on public.tasks (project_id);
create index tasks_user_due_idx on public.tasks (user_id, due_date);
create index tasks_labels_idx on public.tasks using gin (labels);

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.handle_updated_at();
create trigger tasks_set_completed_at
  before insert or update on public.tasks
  for each row execute function public.set_completed_at();

-- Row Level Security ---------------------------------------------------------
alter table public.tasks enable row level security;

create policy tasks_select_own on public.tasks
  for select using ((select auth.uid()) = user_id);
create policy tasks_insert_own on public.tasks
  for insert with check ((select auth.uid()) = user_id);
create policy tasks_update_own on public.tasks
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy tasks_delete_own on public.tasks
  for delete using ((select auth.uid()) = user_id);

-- >>> supabase/migrations/20260628120400_time_logs.sql
-- =============================================================================
-- time_logs: timer sessions. A row with NULL ended_at is a running timer.
-- A partial unique index enforces at most one running timer per user.
-- =============================================================================

create table public.time_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  task_id uuid references public.tasks (id) on delete set null,
  description text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer
    check (duration_seconds is null or duration_seconds >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint time_logs_valid_interval
    check (ended_at is null or ended_at > started_at)
);

comment on table public.time_logs is 'Timer sessions. NULL ended_at means the timer is running.';

-- At most one running (and not soft-deleted) timer per user.
create unique index time_logs_one_running_idx
  on public.time_logs (user_id) where ended_at is null and deleted_at is null;
create index time_logs_user_started_idx
  on public.time_logs (user_id, started_at desc);
create index time_logs_project_idx on public.time_logs (project_id);
create index time_logs_task_idx on public.time_logs (task_id);

create trigger time_logs_set_updated_at
  before update on public.time_logs
  for each row execute function public.handle_updated_at();

-- Row Level Security ---------------------------------------------------------
alter table public.time_logs enable row level security;

create policy time_logs_select_own on public.time_logs
  for select using ((select auth.uid()) = user_id);
create policy time_logs_insert_own on public.time_logs
  for insert with check ((select auth.uid()) = user_id);
create policy time_logs_update_own on public.time_logs
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy time_logs_delete_own on public.time_logs
  for delete using ((select auth.uid()) = user_id);

-- >>> supabase/migrations/20260628120500_goals.sql
-- =============================================================================
-- goals: measurable targets, optionally scoped to a project.
-- completion_percentage is a generated column (always consistent).
-- =============================================================================

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  type public.goal_type not null,
  status public.goal_status not null default 'active',
  target numeric(14, 2) not null check (target > 0),
  current numeric(14, 2) not null default 0 check (current >= 0),
  unit text,
  completion_percentage smallint generated always as (
    least(100, greatest(0, round((current / nullif(target, 0)) * 100)))::smallint
  ) stored,
  start_date date,
  deadline date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.goals is 'User goals. unit describes the target metric (hours, tasks, USD, ...).';

create index goals_user_status_idx on public.goals (user_id, status);
create index goals_user_type_idx on public.goals (user_id, type);
create index goals_project_idx on public.goals (project_id);

create trigger goals_set_updated_at
  before update on public.goals
  for each row execute function public.handle_updated_at();
create trigger goals_set_completed_at
  before insert or update on public.goals
  for each row execute function public.set_completed_at();

-- Row Level Security ---------------------------------------------------------
alter table public.goals enable row level security;

create policy goals_select_own on public.goals
  for select using ((select auth.uid()) = user_id);
create policy goals_insert_own on public.goals
  for insert with check ((select auth.uid()) = user_id);
create policy goals_update_own on public.goals
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy goals_delete_own on public.goals
  for delete using ((select auth.uid()) = user_id);

-- >>> supabase/migrations/20260628120600_earnings.sql
-- =============================================================================
-- earnings: income entries, optionally attributed to a project.
-- =============================================================================

create table public.earnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  amount numeric(14, 2) not null check (amount >= 0),
  currency char(3) not null default 'USD',
  source text,
  category public.earning_category not null default 'other',
  earned_on date not null default current_date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.earnings is 'Income entries. Amounts are exact numerics; cross-currency totals handled in app.';

create index earnings_user_date_idx
  on public.earnings (user_id, earned_on desc);
create index earnings_user_category_idx
  on public.earnings (user_id, category);
create index earnings_project_idx on public.earnings (project_id);

create trigger earnings_set_updated_at
  before update on public.earnings
  for each row execute function public.handle_updated_at();

-- Row Level Security ---------------------------------------------------------
alter table public.earnings enable row level security;

create policy earnings_select_own on public.earnings
  for select using ((select auth.uid()) = user_id);
create policy earnings_insert_own on public.earnings
  for insert with check ((select auth.uid()) = user_id);
create policy earnings_update_own on public.earnings
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy earnings_delete_own on public.earnings
  for delete using ((select auth.uid()) = user_id);

-- >>> supabase/migrations/20260628120700_notes.sql
-- =============================================================================
-- notes: quick notes with full-text search, pin and archive support.
-- search_vector is a generated tsvector indexed with GIN.
-- =============================================================================

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  title text not null default '' check (char_length(title) <= 200),
  content text not null default '',
  is_pinned boolean not null default false,
  is_archived boolean not null default false,
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.notes is 'User notes with full-text search. Markdown/AI summary are future additive columns.';

create index notes_user_pinned_idx
  on public.notes (user_id, is_pinned) where deleted_at is null;
create index notes_user_archived_idx on public.notes (user_id, is_archived);
create index notes_search_idx on public.notes using gin (search_vector);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.handle_updated_at();

-- Row Level Security ---------------------------------------------------------
alter table public.notes enable row level security;

create policy notes_select_own on public.notes
  for select using ((select auth.uid()) = user_id);
create policy notes_insert_own on public.notes
  for insert with check ((select auth.uid()) = user_id);
create policy notes_update_own on public.notes
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy notes_delete_own on public.notes
  for delete using ((select auth.uid()) = user_id);

-- >>> supabase/migrations/20260629120000_tasks_worksheet.sql
-- =============================================================================
-- Tasks redesign — daily worksheet model + milestone-ready hierarchy.
--
-- Adds: blocked/review statuses, a per-task work_date (the "daily sheet" date),
-- a milestones table (Project → Milestone → Task), an optional task→milestone
-- link, an ownership-integrity trigger, and automatic project progress.
--
-- Note: Postgres enum values cannot be removed, so the legacy 'cancelled'
-- status remains in the type (hidden in the UI). Enum additions are therefore
-- not reversible; the rest of this migration is drop-safe.
-- =============================================================================

-- 1. New task statuses, ordered logically for sorting.
alter type public.task_status add value if not exists 'blocked' after 'in_progress';
alter type public.task_status add value if not exists 'review' after 'blocked';

-- 2. Milestones: Project → Milestone → Task. Schema only in v1 (no UI yet), so
--    Calendar / Daily Planner / Analytics can build on it later.
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  description text,
  due_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.milestones is 'Optional grouping of tasks within a project (future hierarchy).';

create index milestones_user_project_idx
  on public.milestones (user_id, project_id) where deleted_at is null;

create trigger milestones_set_updated_at
  before update on public.milestones
  for each row execute function public.handle_updated_at();

alter table public.milestones enable row level security;

create policy milestones_select_own on public.milestones
  for select using ((select auth.uid()) = user_id);
create policy milestones_insert_own on public.milestones
  for insert with check ((select auth.uid()) = user_id);
create policy milestones_update_own on public.milestones
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy milestones_delete_own on public.milestones
  for delete using ((select auth.uid()) = user_id);

-- 3. Tasks gain the daily-sheet date and an optional milestone link.
alter table public.tasks
  add column work_date date not null default current_date,
  add column milestone_id uuid references public.milestones (id) on delete set null;

create index tasks_user_workdate_idx
  on public.tasks (user_id, work_date) where deleted_at is null;
create index tasks_milestone_idx on public.tasks (milestone_id);

-- 4. Integrity: a task's project (and milestone, if any) must belong to the
--    same user. Closes a cross-tenant gap before more modules depend on tasks.
create or replace function public.tasks_enforce_ownership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.projects p
    where p.id = new.project_id and p.user_id = new.user_id
  ) then
    raise exception 'Task project must belong to the same user';
  end if;

  if new.milestone_id is not null and not exists (
    select 1 from public.milestones m
    where m.id = new.milestone_id
      and m.user_id = new.user_id
      and m.project_id = new.project_id
  ) then
    raise exception 'Task milestone must belong to the same user and project';
  end if;

  return new;
end;
$$;

create trigger tasks_enforce_ownership_trigger
  before insert or update on public.tasks
  for each row execute function public.tasks_enforce_ownership();

-- 5. Automatic project progress = completed tasks / total tasks (non-deleted).
create or replace function public.recalc_project_progress(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.projects p
  set progress = coalesce((
    select round(
      100.0 * count(*) filter (where t.status = 'completed')
      / nullif(count(*), 0)
    )
    from public.tasks t
    where t.project_id = p.id and t.deleted_at is null
  ), 0)
  where p.id = p_project_id;
end;
$$;

create or replace function public.tasks_progress_sync()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalc_project_progress(old.project_id);
    return old;
  end if;

  if tg_op = 'UPDATE' and old.project_id is distinct from new.project_id then
    perform public.recalc_project_progress(old.project_id);
  end if;

  perform public.recalc_project_progress(new.project_id);
  return new;
end;
$$;

create trigger tasks_progress_sync_trigger
  after insert or update or delete on public.tasks
  for each row execute function public.tasks_progress_sync();

-- 6. Backfill progress for projects that already exist.
do $$
declare
  r record;
begin
  for r in select id from public.projects loop
    perform public.recalc_project_progress(r.id);
  end loop;
end;
$$;

-- >>> supabase/migrations/20260629130000_split_project_daily_tasks.sql
-- =============================================================================
-- Separate Project Tasks from Daily Tasks.
--
--   Project → Milestone → Project Task (deliverable) → Daily Task (execution)
--
-- Project progress is now derived ONLY from completed Project Tasks. Daily
-- tasks (the `tasks` table / worksheet) record execution and may OPTIONALLY
-- link up to a project task; completing a daily task never changes progress.
-- =============================================================================

-- 1. project_tasks: the deliverables that drive project progress.
create table public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  milestone_id uuid references public.milestones (id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  status public.task_status not null default 'todo',
  priority public.priority not null default 'medium',
  due_date date,
  estimated_hours numeric(6, 2) check (estimated_hours >= 0),
  sort_order integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.project_tasks is 'Project deliverables. Completed project tasks drive project progress.';

create index project_tasks_user_project_idx
  on public.project_tasks (user_id, project_id) where deleted_at is null;
create index project_tasks_user_status_idx
  on public.project_tasks (user_id, status) where deleted_at is null;
create index project_tasks_milestone_idx
  on public.project_tasks (milestone_id);

create trigger project_tasks_set_updated_at
  before update on public.project_tasks
  for each row execute function public.handle_updated_at();
create trigger project_tasks_set_completed_at
  before insert or update on public.project_tasks
  for each row execute function public.set_completed_at();

create or replace function public.project_tasks_enforce_ownership()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.projects p
    where p.id = new.project_id and p.user_id = new.user_id
  ) then
    raise exception 'Project task must belong to your own project';
  end if;
  if new.milestone_id is not null and not exists (
    select 1 from public.milestones m
    where m.id = new.milestone_id
      and m.user_id = new.user_id
      and m.project_id = new.project_id
  ) then
    raise exception 'Milestone must belong to the same user and project';
  end if;
  return new;
end;
$$;
create trigger project_tasks_enforce_ownership_trigger
  before insert or update on public.project_tasks
  for each row execute function public.project_tasks_enforce_ownership();

alter table public.project_tasks enable row level security;
create policy project_tasks_select_own on public.project_tasks
  for select using ((select auth.uid()) = user_id);
create policy project_tasks_insert_own on public.project_tasks
  for insert with check ((select auth.uid()) = user_id);
create policy project_tasks_update_own on public.project_tasks
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy project_tasks_delete_own on public.project_tasks
  for delete using ((select auth.uid()) = user_id);

-- 2. Progress now derives from PROJECT TASKS — move the trigger off daily tasks.
drop trigger if exists tasks_progress_sync_trigger on public.tasks;
drop function if exists public.tasks_progress_sync();

create or replace function public.recalc_project_progress(p_project_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.projects p
  set progress = coalesce((
    select round(
      100.0 * count(*) filter (where pt.status = 'completed')
      / nullif(count(*), 0)
    )
    from public.project_tasks pt
    where pt.project_id = p.id and pt.deleted_at is null
  ), 0)
  where p.id = p_project_id;
end;
$$;

create or replace function public.project_tasks_progress_sync()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalc_project_progress(old.project_id);
    return old;
  end if;
  if tg_op = 'UPDATE' and old.project_id is distinct from new.project_id then
    perform public.recalc_project_progress(old.project_id);
  end if;
  perform public.recalc_project_progress(new.project_id);
  return new;
end;
$$;
create trigger project_tasks_progress_sync_trigger
  after insert or update or delete on public.project_tasks
  for each row execute function public.project_tasks_progress_sync();

-- 3. Daily tasks: drop the milestone link, add an optional project-task link.
drop trigger if exists tasks_enforce_ownership_trigger on public.tasks;
drop function if exists public.tasks_enforce_ownership();

alter table public.tasks
  drop column if exists milestone_id,
  add column if not exists project_task_id uuid
    references public.project_tasks (id) on delete set null;
create index if not exists tasks_project_task_idx
  on public.tasks (project_task_id);

create or replace function public.daily_tasks_enforce_ownership()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.projects p
    where p.id = new.project_id and p.user_id = new.user_id
  ) then
    raise exception 'Daily task must belong to your own project';
  end if;
  if new.project_task_id is not null then
    if not exists (
      select 1 from public.project_tasks pt
      where pt.id = new.project_task_id
        and pt.user_id = new.user_id
        and pt.project_id = new.project_id
    ) then
      raise exception 'Linked project task must belong to the same project';
    end if;
  end if;
  return new;
end;
$$;
create trigger daily_tasks_enforce_ownership_trigger
  before insert or update on public.tasks
  for each row execute function public.daily_tasks_enforce_ownership();

-- 4. Recompute progress for all projects (now 0 until project tasks exist).
do $$
declare
  r record;
begin
  for r in select id from public.projects loop
    perform public.recalc_project_progress(r.id);
  end loop;
end;
$$;

-- >>> supabase/migrations/20260629140000_optional_project_on_daily_tasks.sql
-- =============================================================================
-- Make Project optional on daily tasks and time logs.
--
-- The Daily Planner allows project-less rows (personal / admin work) and rows
-- linked only to a project task. Time logs likewise may be project-less, so a
-- timer can run against a personal daily task.
-- =============================================================================

alter table public.tasks alter column project_id drop not null;
alter table public.time_logs alter column project_id drop not null;

-- Daily task ownership: project optional; project task optional and, when both
-- are present, consistent with each other.
create or replace function public.daily_tasks_enforce_ownership()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.project_id is not null and not exists (
    select 1 from public.projects p
    where p.id = new.project_id and p.user_id = new.user_id
  ) then
    raise exception 'Daily task must belong to your own project';
  end if;

  if new.project_task_id is not null then
    if not exists (
      select 1 from public.project_tasks pt
      where pt.id = new.project_task_id and pt.user_id = new.user_id
    ) then
      raise exception 'Linked project task must belong to you';
    end if;
    if new.project_id is not null and not exists (
      select 1 from public.project_tasks pt
      where pt.id = new.project_task_id and pt.project_id = new.project_id
    ) then
      raise exception 'Linked project task must belong to the selected project';
    end if;
  end if;

  return new;
end;
$$;

-- >>> supabase/migrations/20260629150000_timelog_project_task.sql
-- =============================================================================
-- Attribute time logs to a project task (deliverable).
--
-- time_logs already has project_id (hours per project) and task_id (hours per
-- daily task). Adding project_task_id lets future analytics report hours per
-- deliverable without any further schema change.
-- =============================================================================

alter table public.time_logs
  add column if not exists project_task_id uuid
    references public.project_tasks (id) on delete set null;

create index if not exists time_logs_project_task_idx
  on public.time_logs (project_task_id);

