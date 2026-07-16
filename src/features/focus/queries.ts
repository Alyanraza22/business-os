import "server-only";

import { getDashboardOverview } from "@/features/dashboard/queries";
import { getCommandCenter } from "@/features/priority/queries";
import { getActiveSession } from "@/features/time/queries";
import { createClient } from "@/lib/supabase/server";

export interface FocusTask {
  id: string;
  title: string;
  notes: string | null;
  projectName: string | null;
}

export interface FocusSession {
  task: FocusTask | null;
  running: boolean;
  /** ISO start of the live session, when one is running. */
  startedAt: string | null;
  /** Why this task was chosen (empty while a timer is already running). */
  reasons: string[];
  todayDone: number;
  todayTotal: number;
}

const EMPTY: FocusSession = {
  task: null,
  running: false,
  startedAt: null,
  reasons: [],
  todayDone: 0,
  todayTotal: 0,
};

/**
 * What to put in front of the user in Focus Mode: whatever timer is already
 * running, otherwise the highest-priority task the engine recommends.
 */
export async function getFocusSession(): Promise<FocusSession> {
  const [active, command, overview] = await Promise.all([
    getActiveSession(),
    getCommandCenter(),
    getDashboardOverview(),
  ]);

  const running = Boolean(active?.taskId);
  const taskId = active?.taskId ?? command.nextTask?.id ?? null;
  if (!taskId) {
    return {
      ...EMPTY,
      todayDone: overview.todayDone,
      todayTotal: overview.todayTotal,
    };
  }

  // The notes live on the task row and aren't part of priority scoring, so
  // they're fetched here rather than dragged through the engine.
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("tasks")
    .select("id, title, description")
    .eq("id", taskId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!row) {
    return {
      ...EMPTY,
      todayDone: overview.todayDone,
      todayTotal: overview.todayTotal,
    };
  }

  return {
    task: {
      id: row.id,
      title: row.title,
      notes: row.description,
      projectName: running
        ? (active?.projectName ?? null)
        : (command.nextTask?.projectName ?? null),
    },
    running,
    startedAt: active?.startedAt ?? null,
    reasons: running ? [] : (command.nextTask?.reasons ?? []),
    todayDone: overview.todayDone,
    todayTotal: overview.todayTotal,
  };
}
