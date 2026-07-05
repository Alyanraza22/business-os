import "server-only";

import { cache } from "react";

import { startOfMonthUtc, startOfTodayUtc, startOfWeekUtc } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import type { Enums, Project } from "@/lib/supabase/types";

export interface ProjectHours {
  total: number;
  today: number;
  week: number;
  month: number;
}

interface GetProjectsParams {
  status?: string;
  q?: string;
}

const STATUS_VALUES: readonly Enums<"project_status">[] = [
  "planning",
  "active",
  "paused",
  "completed",
  "archived",
];

function isStatus(value: string): value is Enums<"project_status"> {
  return (STATUS_VALUES as readonly string[]).includes(value);
}

/** Active (non-deleted) projects for the current user, newest first. */
export async function getProjects({
  status,
  q,
}: GetProjectsParams = {}): Promise<Project[]> {
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (status && isStatus(status)) {
    query = query.eq("status", status);
  }
  if (q && q.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export interface ProjectWithMetrics extends Project {
  tasksTotal: number;
  tasksCompleted: number;
  hoursSpent: number;
  lastActivity: string;
}

/**
 * Projects enriched with card metrics — deliverable counts, hours tracked and
 * last activity. Aggregates are fetched in bulk (no per-project queries).
 */
export async function getProjectsWithMetrics(
  params: GetProjectsParams = {},
): Promise<ProjectWithMetrics[]> {
  const projects = await getProjects(params);
  if (projects.length === 0) return [];

  const supabase = await createClient();
  const [tasksRes, logsRes] = await Promise.all([
    supabase
      .from("project_tasks")
      .select("project_id, status, updated_at")
      .is("deleted_at", null),
    supabase
      .from("time_logs")
      .select("project_id, duration_seconds, started_at")
      .is("deleted_at", null)
      .not("duration_seconds", "is", null),
  ]);

  const taskStats = new Map<
    string,
    { total: number; done: number; last: string }
  >();
  for (const task of tasksRes.data ?? []) {
    if (!task.project_id) continue;
    const stat = taskStats.get(task.project_id) ?? {
      total: 0,
      done: 0,
      last: "",
    };
    stat.total += 1;
    if (task.status === "completed") stat.done += 1;
    if (task.updated_at > stat.last) stat.last = task.updated_at;
    taskStats.set(task.project_id, stat);
  }

  const logStats = new Map<string, { seconds: number; last: string }>();
  for (const log of logsRes.data ?? []) {
    if (!log.project_id) continue;
    const stat = logStats.get(log.project_id) ?? { seconds: 0, last: "" };
    stat.seconds += log.duration_seconds ?? 0;
    if (log.started_at > stat.last) stat.last = log.started_at;
    logStats.set(log.project_id, stat);
  }

  return projects.map((project) => {
    const task = taskStats.get(project.id);
    const log = logStats.get(project.id);
    const lastActivity = [
      project.updated_at,
      task?.last ?? "",
      log?.last ?? "",
    ].reduce((latest, value) => (value > latest ? value : latest));

    return {
      ...project,
      tasksTotal: task?.total ?? 0,
      tasksCompleted: task?.done ?? 0,
      hoursSpent: Math.round((log?.seconds ?? 0) / 360) / 10,
      lastActivity,
    };
  });
}

/** A single active project by id, or null if not found / not owned. */
export const getProjectById = cache(
  async (id: string): Promise<Project | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
);

/** Hours tracked against a project (total / today / week / month), tz-aware. */
export async function getProjectHours(
  projectId: string,
): Promise<ProjectHours> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let timezone = "UTC";
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("timezone")
      .eq("id", user.id)
      .single();
    timezone = data?.timezone ?? "UTC";
  }

  const { data: logs } = await supabase
    .from("time_logs")
    .select("started_at, duration_seconds")
    .eq("project_id", projectId)
    .is("deleted_at", null)
    .not("duration_seconds", "is", null);

  const todayStart = startOfTodayUtc(timezone);
  const weekStart = startOfWeekUtc(timezone);
  const monthStart = startOfMonthUtc(timezone);

  let total = 0;
  let today = 0;
  let week = 0;
  let month = 0;
  for (const log of logs ?? []) {
    const seconds = log.duration_seconds ?? 0;
    total += seconds;
    const started = new Date(log.started_at);
    if (started >= todayStart) today += seconds;
    if (started >= weekStart) week += seconds;
    if (started >= monthStart) month += seconds;
  }

  const hours = (seconds: number) => Math.round(seconds / 360) / 10;
  return {
    total: hours(total),
    today: hours(today),
    week: hours(week),
    month: hours(month),
  };
}
