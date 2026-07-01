import "server-only";

import { startOfMonthUtc, startOfTodayUtc, startOfWeekUtc } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

import type { ActiveSession, TimeSession, TimeStats } from "./types";

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
