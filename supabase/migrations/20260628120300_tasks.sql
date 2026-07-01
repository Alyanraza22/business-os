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
