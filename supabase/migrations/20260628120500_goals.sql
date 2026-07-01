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
