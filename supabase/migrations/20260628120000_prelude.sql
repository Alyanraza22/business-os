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
