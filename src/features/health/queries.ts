import "server-only";

import { format, startOfMonth, subMonths } from "date-fns";

import { dayKey, startOfWeekUtc, zonedNow } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { getUserSettings } from "@/lib/user-settings";

export interface HealthFactor {
  label: string;
  value: number;
  weight: number;
  hint: string;
}

export interface BusinessHealth {
  score: number;
  label: string;
  factors: HealthFactor[];
}

const DAY_MS = 86_400_000;
const DEEP_WORK_MIN_SECONDS = 25 * 60;

function healthLabel(score: number): string {
  if (score >= 75) return "Strong";
  if (score >= 50) return "Steady";
  if (score >= 25) return "Needs attention";
  return "At risk";
}

/**
 * Overall business health — the CEO-level read.
 *
 * Like the productivity score, this only counts what the user actually runs:
 * revenue and goals drop out entirely when those modules are unused, and the
 * remaining weights renormalize. A freelancer who never logs income is not an
 * unhealthy business.
 */
export async function getBusinessHealth(): Promise<BusinessHealth> {
  const supabase = await createClient();
  const { timezone } = await getUserSettings();

  const now = zonedNow(timezone);
  const weekStartMs = startOfWeekUtc(timezone).getTime();
  const thirtyAgoMs = now.getTime() - 30 * DAY_MS;
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const lastMonthStart = format(startOfMonth(subMonths(now, 1)), "yyyy-MM-dd");

  const [tasksTotal, tasksDone, goalsTotal, goalsDone, logsRes, earningsRes] =
    await Promise.all([
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
      supabase
        .from("time_logs")
        .select("started_at, duration_seconds")
        .not("ended_at", "is", null)
        .is("deleted_at", null)
        .gte("started_at", new Date(thirtyAgoMs).toISOString()),
      supabase
        .from("earnings")
        .select("amount, earned_on")
        .is("deleted_at", null)
        .gte("earned_on", lastMonthStart),
    ]);

  // Execution.
  const totalTasks = tasksTotal.count ?? 0;
  const completionRate =
    totalTasks > 0
      ? Math.round(((tasksDone.count ?? 0) / totalTasks) * 100)
      : 0;

  // Consistency + focus.
  const activeDays = new Set<string>();
  let weekSeconds = 0;
  let deepSeconds = 0;
  for (const log of logsRes.data ?? []) {
    const seconds = log.duration_seconds ?? 0;
    if (seconds <= 0) continue;
    activeDays.add(dayKey(new Date(log.started_at), timezone));
    if (new Date(log.started_at).getTime() >= weekStartMs) {
      weekSeconds += seconds;
      if (seconds >= DEEP_WORK_MIN_SECONDS) deepSeconds += seconds;
    }
  }
  const consistency = Math.round(Math.min(100, (activeDays.size / 30) * 100));
  const focus =
    weekSeconds > 0 ? Math.round((deepSeconds / weekSeconds) * 100) : 0;

  // Revenue momentum: this month against last.
  let thisMonth = 0;
  let lastMonth = 0;
  for (const entry of earningsRes.data ?? []) {
    const amount = Number(entry.amount);
    if (entry.earned_on >= monthStart) thisMonth += amount;
    else lastMonth += amount;
  }
  const hasRevenue = thisMonth > 0 || lastMonth > 0;
  const revenue = !hasRevenue
    ? 0
    : lastMonth === 0
      ? 100
      : Math.round(Math.min(100, (thisMonth / lastMonth) * 100));

  const totalGoals = goalsTotal.count ?? 0;
  const goalProgress =
    totalGoals > 0
      ? Math.round(((goalsDone.count ?? 0) / totalGoals) * 100)
      : 0;

  const factors: HealthFactor[] = [
    {
      label: "Execution",
      value: completionRate,
      weight: 4,
      hint: "tasks completed",
    },
    {
      label: "Consistency",
      value: consistency,
      weight: 3,
      hint: "active days in 30",
    },
    { label: "Focus", value: focus, weight: 2, hint: "deep work this week" },
  ];
  if (totalGoals > 0) {
    factors.push({
      label: "Goal progress",
      value: goalProgress,
      weight: 2,
      hint: "goals completed",
    });
  }
  if (hasRevenue) {
    factors.push({
      label: "Revenue",
      value: revenue,
      weight: 3,
      hint: "vs last month",
    });
  }

  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const score = Math.round(
    factors.reduce((sum, f) => sum + f.value * f.weight, 0) / totalWeight,
  );

  return { score, label: healthLabel(score), factors };
}
