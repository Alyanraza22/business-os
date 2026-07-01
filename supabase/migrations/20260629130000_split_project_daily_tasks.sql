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
