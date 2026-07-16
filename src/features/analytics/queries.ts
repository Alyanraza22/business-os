import "server-only";

import { format, startOfMonth, subDays, subMonths } from "date-fns";

import {
  dayKey,
  lastSixMonths,
  startOfMonthUtc,
  startOfWeekUtc,
  zonedNow,
} from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { getUserSettings } from "@/lib/user-settings";
import type { ChartPoint } from "@/features/dashboard/types";

export interface AnalyticsData {
  currency: string;
  stats: {
    lifetimeHours: number;
    tasksCompleted: number;
    deliverablesCompleted: number;
    totalRevenue: number;
  };
  dailyHours: ChartPoint[];
  hoursByProject: ChartPoint[];
  monthlyRevenue: ChartPoint[];
}

const toHours = (seconds: number) => Math.round(seconds / 360) / 10;

function lastNDays(timeZone: string, n: number) {
  const now = zonedNow(timeZone);
  return Array.from({ length: n }, (_, i) => {
    const day = subDays(now, n - 1 - i);
    return { key: format(day, "yyyy-MM-dd"), label: format(day, "d MMM") };
  });
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient();
  const { timezone, currency } = await getUserSettings();

  const revenueFrom = format(
    startOfMonth(subMonths(zonedNow(timezone), 5)),
    "yyyy-MM-dd",
  );

  const [logsRes, projectsRes, tasksDone, deliverablesDone, earningsRes] =
    await Promise.all([
      supabase
        .from("time_logs")
        .select("started_at, duration_seconds, project_id")
        .not("ended_at", "is", null)
        .is("deleted_at", null),
      supabase.from("projects").select("id, name").is("deleted_at", null),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .is("deleted_at", null),
      supabase
        .from("project_tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .is("deleted_at", null),
      supabase
        .from("earnings")
        .select("amount, earned_on")
        .is("deleted_at", null),
    ]);

  let lifetimeSeconds = 0;
  const dayBuckets = new Map<string, number>();
  const projectSeconds = new Map<string, number>();
  for (const log of logsRes.data ?? []) {
    const seconds = log.duration_seconds ?? 0;
    lifetimeSeconds += seconds;
    const key = dayKey(log.started_at, timezone);
    dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + seconds);
    if (log.project_id) {
      projectSeconds.set(
        log.project_id,
        (projectSeconds.get(log.project_id) ?? 0) + seconds,
      );
    }
  }

  const dailyHours = lastNDays(timezone, 14).map(({ key, label }) => ({
    label,
    value: toHours(dayBuckets.get(key) ?? 0),
  }));

  const projectNames = new Map(
    (projectsRes.data ?? []).map((project) => [project.id, project.name]),
  );
  const hoursByProject = [...projectSeconds.entries()]
    .map(([id, seconds]) => ({
      label: projectNames.get(id) ?? "Unknown",
      value: toHours(seconds),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  let totalRevenue = 0;
  const monthBuckets = new Map<string, number>();
  for (const entry of earningsRes.data ?? []) {
    const amount = Number(entry.amount);
    totalRevenue += amount;
    if (entry.earned_on >= revenueFrom) {
      const key = entry.earned_on.slice(0, 7);
      monthBuckets.set(key, (monthBuckets.get(key) ?? 0) + amount);
    }
  }
  const monthlyRevenue = lastSixMonths(timezone).map(({ key, label }) => ({
    label,
    value: Math.round((monthBuckets.get(key) ?? 0) * 100) / 100,
  }));

  return {
    currency,
    stats: {
      lifetimeHours: toHours(lifetimeSeconds),
      tasksCompleted: tasksDone.count ?? 0,
      deliverablesCompleted: deliverablesDone.count ?? 0,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
    },
    dailyHours,
    hoursByProject,
    monthlyRevenue,
  };
}

/** A single weighted input to the productivity score. */
export interface ScoreFactor {
  label: string;
  value: number;
  weight: number;
}

export interface AnalyticsInsights {
  productivityScore: number;
  /** Transparent breakdown of what actually fed the score. */
  scoreFactors: ScoreFactor[];
  completionRate: number;
  avgDailyHours: number;
  goalCompletion: number;
  goalsConfigured: boolean;
  mostProductiveProject: string | null;
  weekHours: number;
  weekChangePct: number | null;
  monthHours: number;
  monthChangePct: number | null;
}

const DAY_MS = 86_400_000;

/**
 * Derived analytics: a composite productivity score plus completion rate,
 * average daily hours, goal completion and week/month comparisons.
 */
export async function getAnalyticsInsights(): Promise<AnalyticsInsights> {
  const supabase = await createClient();
  const { timezone: tz } = await getUserSettings();

  const now = zonedNow(tz);
  const weekStartMs = startOfWeekUtc(tz).getTime();
  const lastWeekStartMs = weekStartMs - 7 * DAY_MS;
  const monthStartMs = startOfMonthUtc(tz).getTime();
  const lastMonthStartMs = subMonths(new Date(monthStartMs), 1).getTime();
  const thirtyAgoMs = now.getTime() - 30 * DAY_MS;

  const [logsRes, projectsRes, tasksTotal, tasksDone, goalsTotal, goalsDone] =
    await Promise.all([
      supabase
        .from("time_logs")
        .select("started_at, duration_seconds, project_id")
        .not("ended_at", "is", null)
        .is("deleted_at", null),
      supabase.from("projects").select("id, name").is("deleted_at", null),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .is("deleted_at", null),
      supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .is("deleted_at", null),
    ]);

  let weekSeconds = 0;
  let lastWeekSeconds = 0;
  let monthSeconds = 0;
  let lastMonthSeconds = 0;
  let last30Seconds = 0;
  const activeDays = new Set<string>();
  const projectSeconds = new Map<string, number>();

  for (const log of logsRes.data ?? []) {
    const seconds = log.duration_seconds ?? 0;
    if (seconds <= 0) continue;
    const ms = new Date(log.started_at).getTime();
    if (ms >= weekStartMs) weekSeconds += seconds;
    else if (ms >= lastWeekStartMs) lastWeekSeconds += seconds;
    if (ms >= monthStartMs) monthSeconds += seconds;
    else if (ms >= lastMonthStartMs) lastMonthSeconds += seconds;
    if (ms >= thirtyAgoMs) {
      last30Seconds += seconds;
      activeDays.add(dayKey(new Date(log.started_at), tz));
    }
    if (log.project_id) {
      projectSeconds.set(
        log.project_id,
        (projectSeconds.get(log.project_id) ?? 0) + seconds,
      );
    }
  }

  const projectName = new Map(
    (projectsRes.data ?? []).map((p) => [p.id, p.name]),
  );
  let mostProductiveProject: string | null = null;
  let topSeconds = 0;
  for (const [id, seconds] of projectSeconds) {
    if (seconds > topSeconds) {
      topSeconds = seconds;
      mostProductiveProject = projectName.get(id) ?? null;
    }
  }

  const totalTasks = tasksTotal.count ?? 0;
  const completedTasks = tasksDone.count ?? 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalGoals = goalsTotal.count ?? 0;
  const completedGoals = goalsDone.count ?? 0;
  const goalCompletion =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const weekHours = toHours(weekSeconds);
  const monthHours = toHours(monthSeconds);
  const avgDailyHours = Math.round((last30Seconds / 3600 / 30) * 10) / 10;

  const pctChange = (current: number, previous: number): number | null => {
    if (previous <= 0) return current > 0 ? 100 : null;
    return Math.round(((current - previous) / previous) * 100);
  };

  const consistency = Math.round(Math.min(100, (activeDays.size / 30) * 100));
  const focus = Math.round(Math.min(100, (weekHours / 40) * 100));

  // Adaptive score: only modules the user actually uses are counted, so an
  // unused module can never drag the score down. Weights are renormalized
  // across whatever is active.
  const factors: ScoreFactor[] = [
    { label: "Execution", value: completionRate, weight: 4 },
    { label: "Consistency", value: consistency, weight: 3 },
    { label: "Focus", value: focus, weight: 3 },
  ];
  if (totalGoals > 0) {
    factors.push({ label: "Goal progress", value: goalCompletion, weight: 2 });
  }

  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const productivityScore = Math.round(
    factors.reduce((sum, f) => sum + f.value * f.weight, 0) / totalWeight,
  );

  return {
    productivityScore,
    scoreFactors: factors,
    completionRate,
    avgDailyHours,
    goalCompletion,
    goalsConfigured: totalGoals > 0,
    mostProductiveProject,
    weekHours,
    weekChangePct: pctChange(weekSeconds, lastWeekSeconds),
    monthHours,
    monthChangePct: pctChange(monthSeconds, lastMonthSeconds),
  };
}
