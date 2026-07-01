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
