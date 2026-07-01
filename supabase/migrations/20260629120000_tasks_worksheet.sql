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
