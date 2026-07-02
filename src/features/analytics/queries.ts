import "server-only";

import { format, startOfMonth, subDays, subMonths } from "date-fns";

import { dayKey, lastSixMonths, zonedNow } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let timezone = "UTC";
  let currency = "USD";
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("timezone, currency")
      .eq("id", user.id)
      .single();
    timezone = data?.timezone ?? "UTC";
    currency = data?.currency ?? "USD";
  }

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
