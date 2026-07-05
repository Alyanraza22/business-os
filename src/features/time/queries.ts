import "server-only";

import {
  dayKey,
  lastSevenDays,
  startOfMonthUtc,
  startOfTodayUtc,
  startOfWeekUtc,
} from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

import type {
  ActiveSession,
  TimeInsights,
  TimelineBlock,
  TimeSession,
  TimeStats,
} from "./types";

const DAY_MS = 86_400_000;
const clampPct = (value: number) => Math.max(0, Math.min(100, value));

type EmbeddedRow = {
  id: string;
  task_id?: string | null;
  started_at: string;
  ended_at?: string | null;
  duration_seconds?: number | null;
  task: { title: string } | null;
  project: { name: string; color: string } | null;
};

async function getTimezone(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "UTC";
  const { data } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();
  return data?.timezone ?? "UTC";
}

/** Total tracked hours: today / this week / this month / lifetime (tz-aware). */
export async function getTimeStats(): Promise<TimeStats> {
  const supabase = await createClient();
  const timezone = await getTimezone();

  const { data } = await supabase
    .from("time_logs")
    .select("started_at, duration_seconds")
    .is("deleted_at", null)
    .not("duration_seconds", "is", null);

  const todayStart = startOfTodayUtc(timezone);
  const weekStart = startOfWeekUtc(timezone);
  const monthStart = startOfMonthUtc(timezone);

  let today = 0;
  let week = 0;
  let month = 0;
  let lifetime = 0;
  for (const log of data ?? []) {
    const seconds = log.duration_seconds ?? 0;
    lifetime += seconds;
    const started = new Date(log.started_at);
    if (started >= todayStart) today += seconds;
    if (started >= weekStart) week += seconds;
    if (started >= monthStart) month += seconds;
  }

  const hours = (seconds: number) => Math.round(seconds / 360) / 10;
  return {
    today: hours(today),
    week: hours(week),
    month: hours(month),
    lifetime: hours(lifetime),
  };
}

/** The currently running session with its task/project, or null. */
export async function getActiveSession(): Promise<ActiveSession | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("time_logs")
    .select(
      "id, task_id, started_at, task:tasks(title), project:projects(name, color)",
    )
    .is("ended_at", null)
    .is("deleted_at", null)
    .maybeSingle();

  if (!data) return null;
  const row = data as unknown as EmbeddedRow;
  return {
    id: row.id,
    taskId: row.task_id ?? null,
    taskTitle: row.task?.title ?? null,
    projectName: row.project?.name ?? null,
    projectColor: row.project?.color ?? null,
    startedAt: row.started_at,
  };
}

/** Recent completed sessions, newest first. */
export async function getRecentSessions(limit = 40): Promise<TimeSession[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("time_logs")
    .select(
      "id, started_at, ended_at, duration_seconds, task:tasks(title), project:projects(name, color)",
    )
    .is("deleted_at", null)
    .not("ended_at", "is", null)
    .order("started_at", { ascending: false })
    .limit(limit);

  const rows = (data ?? []) as unknown as EmbeddedRow[];
  return rows.map((row) => ({
    id: row.id,
    startedAt: row.started_at,
    endedAt: row.ended_at ?? null,
    durationSeconds: row.duration_seconds ?? null,
    taskTitle: row.task?.title ?? null,
    projectName: row.project?.name ?? null,
    projectColor: row.project?.color ?? null,
  }));
}

/** Longest/average session, weekly hours and today's session timeline. */
export async function getTimeInsights(): Promise<TimeInsights> {
  const supabase = await createClient();
  const timezone = await getTimezone();
  const todayStartMs = startOfTodayUtc(timezone).getTime();

  const [allRes, todayRes] = await Promise.all([
    supabase
      .from("time_logs")
      .select("started_at, duration_seconds")
      .is("deleted_at", null)
      .not("ended_at", "is", null),
    supabase
      .from("time_logs")
      .select(
        "started_at, ended_at, task:tasks(title), project:projects(color)",
      )
      .is("deleted_at", null)
      .not("ended_at", "is", null)
      .gte("started_at", new Date(todayStartMs).toISOString())
      .order("started_at", { ascending: true }),
  ]);

  let longestSeconds = 0;
  let total = 0;
  let sessionCount = 0;
  const dayBuckets = new Map<string, number>();
  for (const log of allRes.data ?? []) {
    const seconds = log.duration_seconds ?? 0;
    if (seconds <= 0) continue;
    sessionCount += 1;
    total += seconds;
    if (seconds > longestSeconds) longestSeconds = seconds;
    const key = dayKey(new Date(log.started_at), timezone);
    dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + seconds);
  }

  const weekly = lastSevenDays(timezone).map(({ key, label }) => ({
    label,
    value: Math.round((dayBuckets.get(key) ?? 0) / 360) / 10,
  }));

  const todayRows = (todayRes.data ?? []) as unknown as EmbeddedRow[];
  const todaysSessions: TimelineBlock[] = todayRows
    .filter((row) => row.ended_at)
    .map((row) => {
      const startMs = new Date(row.started_at).getTime();
      const endMs = new Date(row.ended_at as string).getTime();
      return {
        startPct: clampPct(((startMs - todayStartMs) / DAY_MS) * 100),
        endPct: clampPct(((endMs - todayStartMs) / DAY_MS) * 100),
        title: row.task?.title ?? null,
        color: row.project?.color ?? null,
      };
    });

  return {
    longestSeconds,
    averageSeconds: sessionCount > 0 ? Math.round(total / sessionCount) : 0,
    sessionCount,
    weekly,
    todaysSessions,
  };
}
