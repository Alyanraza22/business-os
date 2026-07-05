import "server-only";

import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

import {
  dayKey,
  lastSevenDays,
  lastSixMonths,
  startOfMonthUtc,
  startOfTodayUtc,
  startOfWeekUtc,
  zonedNow,
} from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/features/auth/auth";

import type {
  DashboardData,
  DashboardOverview,
  DeadlineItem,
  FocusTask,
} from "./types";

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Aggregates the authenticated user's dashboard metrics. All queries run under
 * the user's session, so RLS guarantees only their rows are returned.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) {
    return emptyDashboard("USD");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, currency")
    .eq("id", user.id)
    .single();

  const tz = profile?.timezone ?? "UTC";
  const currency = profile?.currency ?? "USD";

  const todayStart = startOfTodayUtc(tz);
  const weekStart = startOfWeekUtc(tz);
  const monthStart = startOfMonthUtc(tz);
  const earningsFrom = format(
    startOfMonth(subMonths(zonedNow(tz), 5)),
    "yyyy-MM-dd",
  );

  const [logsResult, projectsResult, earningsResult] = await Promise.all([
    // All completed timer segments — needed for lifetime totals and averages.
    supabase
      .from("time_logs")
      .select("started_at, duration_seconds")
      .not("ended_at", "is", null)
      .is("deleted_at", null),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .is("deleted_at", null),
    supabase
      .from("earnings")
      .select("amount, earned_on")
      .gte("earned_on", earningsFrom)
      .is("deleted_at", null),
  ]);

  // Hours: sum durations into today/week/month/lifetime totals and per-day
  // buckets, and track the first tracked day for averages.
  let todayHours = 0;
  let weekHours = 0;
  let monthHours = 0;
  let lifetimeHours = 0;
  let firstMs = Number.POSITIVE_INFINITY;
  const dayBuckets = new Map<string, number>();

  for (const log of logsResult.data ?? []) {
    const started = new Date(log.started_at);
    const hours = (log.duration_seconds ?? 0) / 3600;
    lifetimeHours += hours;
    firstMs = Math.min(firstMs, started.getTime());
    if (started >= todayStart) todayHours += hours;
    if (started >= weekStart) weekHours += hours;
    if (started >= monthStart) monthHours += hours;
    const key = dayKey(started, tz);
    dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + hours);
  }

  const weeklyHours = lastSevenDays(tz).map(({ key, label }) => ({
    label,
    value: round1(dayBuckets.get(key) ?? 0),
  }));

  // Averages spread lifetime hours across the days since the first tracked day.
  let daysActive = 1;
  if (Number.isFinite(firstMs)) {
    const firstKey = dayKey(new Date(firstMs), tz);
    const todayKey = dayKey(new Date(), tz);
    daysActive = Math.max(
      1,
      differenceInCalendarDays(parseISO(todayKey), parseISO(firstKey)) + 1,
    );
  }
  const avgPerDay = round1(lifetimeHours / daysActive);

  // Earnings: month-to-date total and per-month buckets (dates are calendar
  // dates, so no timezone conversion is needed).
  const monthStartDate = format(startOfMonth(zonedNow(tz)), "yyyy-MM-dd");
  let monthEarnings = 0;
  const monthBuckets = new Map<string, number>();

  for (const entry of earningsResult.data ?? []) {
    const amount = Number(entry.amount);
    if (entry.earned_on >= monthStartDate) monthEarnings += amount;
    const key = entry.earned_on.slice(0, 7);
    monthBuckets.set(key, (monthBuckets.get(key) ?? 0) + amount);
  }

  const monthlyRevenue = lastSixMonths(tz).map(({ key, label }) => ({
    label,
    value: round2(monthBuckets.get(key) ?? 0),
  }));

  return {
    currency,
    stats: {
      todayHours: round1(todayHours),
      weekHours: round1(weekHours),
      monthHours: round1(monthHours),
      lifetimeHours: round1(lifetimeHours),
      avgPerDay,
      avgPerWeek: round1(avgPerDay * 7),
      avgPerMonth: round1(avgPerDay * 30.44),
      activeProjects: projectsResult.count ?? 0,
      monthEarnings: round2(monthEarnings),
    },
    weeklyHours,
    monthlyRevenue,
  };
}

function emptyOverview(): DashboardOverview {
  return {
    greeting: "Welcome",
    firstName: "there",
    todayTasks: [],
    todayTotal: 0,
    todayDone: 0,
    streakDays: 0,
    weekCompletedTasks: 0,
    mostActiveProject: null,
    nextDeadline: null,
    upcomingDeadlines: [],
    attentionCount: 0,
  };
}

/**
 * Actionable overview for the dashboard: today's focus tasks, streak, weekly
 * summary, most active project and upcoming deadlines. Modular and separate
 * from the metric aggregation so each can evolve independently.
 */
export async function getDashboardOverview(): Promise<DashboardOverview> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return emptyOverview();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();
  const tz = profile?.timezone ?? "UTC";

  const now = zonedNow(tz);
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const meta = user.user_metadata ?? {};
  const fullName =
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    user.email ??
    "there";
  const firstName = fullName.split(/\s+/)[0] || "there";

  const todayKey = dayKey(new Date(), tz);
  const weekStartIso = startOfWeekUtc(tz).toISOString();
  const soonKey = format(addDays(parseISO(todayKey), 14), "yyyy-MM-dd");
  const logsSinceIso = subDays(now, 30).toISOString();

  const [todayRes, weekDoneRes, projectsRes, projTasksRes, logsRes] =
    await Promise.all([
      supabase
        .from("tasks")
        .select("id, title, priority, status, project_id")
        .eq("work_date", todayKey)
        .is("deleted_at", null)
        .order("sort_order"),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("completed_at", weekStartIso)
        .is("deleted_at", null),
      supabase
        .from("projects")
        .select("id, name, deadline, progress, status")
        .is("deleted_at", null),
      supabase
        .from("project_tasks")
        .select("title, due_date")
        .not("due_date", "is", null)
        .neq("status", "completed")
        .is("deleted_at", null)
        .gte("due_date", todayKey)
        .lte("due_date", soonKey),
      supabase
        .from("time_logs")
        .select("project_id, started_at, duration_seconds")
        .not("ended_at", "is", null)
        .is("deleted_at", null)
        .gte("started_at", logsSinceIso),
    ]);

  const projects = projectsRes.data ?? [];
  const projectName = new Map(projects.map((p) => [p.id, p.name]));

  // Today's focus — pending tasks first, with their project name.
  const todayRows = todayRes.data ?? [];
  const todayTotal = todayRows.length;
  const todayDone = todayRows.filter((t) => t.status === "completed").length;
  const todayTasks: FocusTask[] = todayRows
    .filter((t) => t.status === "todo" || t.status === "in_progress")
    .slice(0, 6)
    .map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      status: t.status,
      projectName: t.project_id
        ? (projectName.get(t.project_id) ?? null)
        : null,
    }));

  // Streak + most active project from the last 30 days of tracked time.
  const weekStartMs = new Date(weekStartIso).getTime();
  const activeDays = new Set<string>();
  const weekProjectSeconds = new Map<string, number>();
  for (const log of logsRes.data ?? []) {
    if ((log.duration_seconds ?? 0) <= 0) continue;
    activeDays.add(dayKey(new Date(log.started_at), tz));
    if (log.project_id && new Date(log.started_at).getTime() >= weekStartMs) {
      weekProjectSeconds.set(
        log.project_id,
        (weekProjectSeconds.get(log.project_id) ?? 0) +
          (log.duration_seconds ?? 0),
      );
    }
  }

  let streakDays = 0;
  let cursor = parseISO(todayKey);
  while (activeDays.has(format(cursor, "yyyy-MM-dd"))) {
    streakDays += 1;
    cursor = subDays(cursor, 1);
  }

  let mostActiveProject: string | null = null;
  let topSeconds = 0;
  for (const [id, seconds] of weekProjectSeconds) {
    if (seconds > topSeconds) {
      topSeconds = seconds;
      mostActiveProject = projectName.get(id) ?? null;
    }
  }

  // Upcoming deadlines — projects and project tasks, nearest first.
  const deadlines: DeadlineItem[] = [];
  for (const p of projects) {
    if (p.deadline && p.deadline >= todayKey) {
      deadlines.push({ title: p.name, date: p.deadline, kind: "project" });
    }
  }
  for (const t of projTasksRes.data ?? []) {
    if (t.due_date) {
      deadlines.push({ title: t.title, date: t.due_date, kind: "task" });
    }
  }
  deadlines.sort((a, b) => (a.date < b.date ? -1 : 1));

  // Projects needing attention — active and overdue or due within 3 days.
  const attentionCutoff = format(addDays(parseISO(todayKey), 3), "yyyy-MM-dd");
  const attentionCount = projects.filter(
    (p) =>
      p.status === "active" &&
      p.deadline !== null &&
      (p.deadline < todayKey ||
        (p.deadline <= attentionCutoff && (p.progress ?? 0) < 100)),
  ).length;

  return {
    greeting,
    firstName,
    todayTasks,
    todayTotal,
    todayDone,
    streakDays,
    weekCompletedTasks: weekDoneRes.count ?? 0,
    mostActiveProject,
    nextDeadline: deadlines[0] ?? null,
    upcomingDeadlines: deadlines.slice(0, 4),
    attentionCount,
  };
}

function emptyDashboard(currency: string): DashboardData {
  return {
    currency,
    stats: {
      todayHours: 0,
      weekHours: 0,
      monthHours: 0,
      lifetimeHours: 0,
      avgPerDay: 0,
      avgPerWeek: 0,
      avgPerMonth: 0,
      activeProjects: 0,
      monthEarnings: 0,
    },
    weeklyHours: [],
    monthlyRevenue: [],
  };
}
