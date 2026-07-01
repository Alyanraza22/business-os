-- =============================================================================
-- Development seed data. LOCAL USE ONLY (`supabase db reset`).
-- Creates a demo auth user; the handle_new_user trigger creates its profile.
-- The app uses Google OAuth, so this demo user is for inspecting data in dev,
-- not for signing in through the UI.
-- =============================================================================

-- Deterministic demo user id reused across all sample rows.
-- 00000000-0000-0000-0000-000000000001
insert into auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated', 'demo@business-os.dev',
  crypt('password123', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo User"}',
  now(), now()
)
on conflict (id) do nothing;

-- Tune the auto-created profile.
update public.profiles
set timezone = 'America/New_York', currency = 'USD', onboarded = true
where id = '00000000-0000-0000-0000-000000000001';

-- Projects -------------------------------------------------------------------
insert into public.projects (id, user_id, name, description, status, priority, deadline, progress, color, icon)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
   'Business OS', 'Build the productivity dashboard.', 'active', 'high',
   current_date + 30, 45, '#6366F1', 'LayoutDashboard'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
   'Etsy Store', 'Launch and grow the print shop.', 'planning', 'medium',
   current_date + 60, 10, '#22C55E', 'Store')
on conflict (id) do nothing;

-- Tasks ----------------------------------------------------------------------
insert into public.tasks (user_id, project_id, title, status, priority, due_date, estimated_hours, labels)
values
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Design the database schema', 'completed', 'high', current_date - 1, 4, '{backend,database}'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Build the UI component library', 'in_progress', 'high', current_date + 3, 12, '{frontend,ui}'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Implement authentication', 'todo', 'urgent', current_date + 5, 6, '{auth}'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
   'Create 10 product mockups', 'todo', 'medium', current_date + 14, 8, '{design}');

-- Time logs ------------------------------------------------------------------
insert into public.time_logs (user_id, project_id, description, started_at, ended_at, duration_seconds)
values
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Schema design session', now() - interval '1 day' - interval '3 hours',
   now() - interval '1 day', 10800),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Component library work', now() - interval '5 hours', now() - interval '3 hours', 7200);

-- Goals ----------------------------------------------------------------------
insert into public.goals (user_id, project_id, title, type, target, current, unit, deadline)
values
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Ship 30 focused hours this week', 'weekly', 30, 12, 'hours', current_date + 5),
  ('00000000-0000-0000-0000-000000000001', null,
   'Earn $5,000 this month', 'monthly', 5000, 1200, 'USD', date_trunc('month', current_date) + interval '1 month' - interval '1 day');

-- Earnings -------------------------------------------------------------------
insert into public.earnings (user_id, project_id, amount, currency, source, category, earned_on)
values
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   800.00, 'USD', 'Client retainer', 'freelancing', current_date - 3),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
   400.00, 'USD', 'Etsy sales', 'etsy', current_date - 1);

-- Notes ----------------------------------------------------------------------
insert into public.notes (user_id, project_id, title, content, is_pinned)
values
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Architecture decisions', 'UUID PKs, RLS by user_id, soft deletes, generated columns for progress.', true),
  ('00000000-0000-0000-0000-000000000001', null,
   'Ideas', 'Add a Pomodoro timer and habit tracker in v2.', false);
