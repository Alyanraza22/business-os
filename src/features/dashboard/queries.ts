import "server-only";

import {
  differenceInCalendarDays,
  format,
  parseISO,
  startOfMonth,
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

import type { DashboardData } from "./types";

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
