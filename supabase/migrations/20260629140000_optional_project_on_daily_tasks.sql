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
