import "server-only";

import { dayKey } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/types";

import type {
  ProjectOption,
  ProjectTaskOption,
  RunningTimer,
  TaskWithProject,
  WorksheetTask,
} from "./types";

export const WORKSHEET_PAGE_SIZE = 50;

const TASK_STATUS_VALUES: readonly Enums<"task_status">[] = [
  "todo",
  "in_progress",
  "blocked",
  "review",
  "completed",
  "cancelled",
];
const PRIORITY_VALUES: readonly Enums<"priority">[] = [
  "low",
  "medium",
  "high",
  "urgent",
];
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isMember<T extends string>(
  values: readonly T[],
  value: string | undefined,
): value is T {
  return value !== undefined && (values as readonly string[]).includes(value);
}

export interface WorksheetParams {
  date: string;
  page?: number;
  projectId?: string;
  status?: string;
  priority?: string;
  q?: string;
  sort?: string;
}

/** Tasks for a single work date (the daily sheet), paginated. */
export async function getWorksheetTasks(
  params: WorksheetParams,
): Promise<{ tasks: WorksheetTask[]; total: number }> {
  const supabase = await createClient();
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * WORKSHEET_PAGE_SIZE;
  const to = from + WORKSHEET_PAGE_SIZE - 1;

  let query = supabase
    .from("tasks")
    .select("*, project:projects(id, name, color, icon)", { count: "exact" })
    .is("deleted_at", null)
    .eq("work_date", params.date);

  if (isMember(TASK_STATUS_VALUES, params.status)) {
    query = query.eq("status", params.status);
  }
  if (isMember(PRIORITY_VALUES, params.priority)) {
    query = query.eq("priority", params.priority);
  }
  if (params.projectId && UUID_RE.test(params.projectId)) {
    query = query.eq("project_id", params.projectId);
  }
  if (params.q && params.q.trim()) {
    query = query.ilike("title", `%${params.q.trim()}%`);
  }

  switch (params.sort) {
    case "priority":
      query = query.order("priority", { ascending: false });
      break;
    case "status":
      query = query.order("status", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: true });
      break;
  }

  const { data, error, count } = await query.range(from, to);
  if (error) {
    throw new Error(error.message);
  }

  const tasks = (data ?? []) as TaskWithProject[];

  // Derive actual hours from time logs for the tasks on this page.
  const ids = tasks.map((task) => task.id);
  const secondsByTask = new Map<string, number>();
  if (ids.length > 0) {
    const { data: logs } = await supabase
      .from("time_logs")
      .select("task_id, duration_seconds")
      .in("task_id", ids)
      .is("deleted_at", null);
    for (const log of logs ?? []) {
      if (log.task_id) {
        secondsByTask.set(
          log.task_id,
          (secondsByTask.get(log.task_id) ?? 0) + (log.duration_seconds ?? 0),
        );
      }
    }
  }

  return {
    tasks: tasks.map((task) => {
      const seconds = secondsByTask.get(task.id) ?? 0;
      return {
        ...task,
        actualSeconds: seconds,
        actualHours: Math.round(seconds / 360) / 10,
      };
    }),
    total: count ?? 0,
  };
}

/** The user's currently running timer (or null). Persisted in the DB. */
export async function getRunningTimer(): Promise<RunningTimer | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("time_logs")
    .select("task_id, started_at")
    .is("ended_at", null)
    .is("deleted_at", null)
    .maybeSingle();

  if (!data) return null;
  return { taskId: data.task_id, startedAt: data.started_at };
}

/** Lightweight project list for task pickers and filters. */
export async function getProjectOptions(): Promise<ProjectOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, color, icon")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

/** All active project tasks (deliverables), for the planner's link picker. */
export async function getProjectTaskOptions(): Promise<ProjectTaskOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_tasks")
    .select("id, project_id, title")
    .is("deleted_at", null)
    .order("title", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

/** Today's date (yyyy-MM-dd) in the user's timezone. */
export async function getTodayDate(): Promise<string> {
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
  return dayKey(new Date(), timezone);
}
