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
