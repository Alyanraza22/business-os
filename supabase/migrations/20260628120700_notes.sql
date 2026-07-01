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
