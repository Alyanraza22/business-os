import "server-only";

import { getUser } from "@/features/auth/auth";
import { dayKey } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { getUserSettings } from "@/lib/user-settings";

import { rankTasks, type PriorityTaskInput, type ScoredTask } from "./engine";

export interface CommandCenter {
  /** The single highest-value thing to do right now. */
  nextTask: ScoredTask | null;
  /** Incomplete work carried over from previous days, most urgent first. */
  overdue: ScoredTask[];
  /** Estimated hours still outstanding for today. */
  remainingHours: number;
  /** Count of incomplete tasks scheduled for today. */
  remainingToday: number;
}

const EMPTY: CommandCenter = {
  nextTask: null,
  overdue: [],
  remainingHours: 0,
  remainingToday: 0,
};

/**
 * Answers "what should I do next?" by ranking every actionable task (today's
 * plus anything carried over) through the priority engine.
 */
export async function getCommandCenter(): Promise<CommandCenter> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return EMPTY;

  const { timezone } = await getUserSettings();
  const todayKey = dayKey(new Date(), timezone);

  const [tasksRes, projectsRes] = await Promise.all([
    supabase
      .from("tasks")
      .select(
        "id, title, priority, status, work_date, due_date, estimated_hours, project_id",
      )
      .in("status", ["todo", "in_progress"])
      .lte("work_date", todayKey)
      .is("deleted_at", null),
    supabase
      .from("projects")
      .select("id, name, deadline, priority")
      .is("deleted_at", null),
  ]);

  const projects = new Map(
    (projectsRes.data ?? []).map((project) => [project.id, project]),
  );

  const inputs: PriorityTaskInput[] = (tasksRes.data ?? []).map((task) => {
    const project = task.project_id ? projects.get(task.project_id) : undefined;
    return {
      id: task.id,
      title: task.title,
      priority: task.priority,
      status: task.status,
      workDate: task.work_date,
      dueDate: task.due_date,
      estimatedHours: task.estimated_hours,
      projectName: project?.name ?? null,
      projectDeadline: project?.deadline ?? null,
      projectPriority: project?.priority ?? null,
    };
  });

  const ranked = rankTasks(inputs, todayKey);
  const today = ranked.filter((task) => task.workDate === todayKey);

  return {
    nextTask: ranked[0] ?? null,
    overdue: ranked.filter((task) => task.workDate < todayKey).slice(0, 5),
    remainingHours:
      Math.round(
        today.reduce((sum, task) => sum + (task.estimatedHours ?? 0), 0) * 10,
      ) / 10,
    remainingToday: today.length,
  };
}
