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
