"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export interface TimerResult {
  ok: boolean;
  message?: string;
  /** True when another task's timer is already running (needs confirm to switch). */
  conflict?: boolean;
}

function revalidateTime() {
  revalidatePath("/tasks");
  revalidatePath("/time");
  revalidatePath("/dashboard");
  revalidatePath("/projects", "layout");
}

function durationSeconds(startedAt: string) {
  return Math.max(1, Math.floor((Date.now() - Date.parse(startedAt)) / 1000));
}

/**
 * Start (or resume) the timer for a daily task. Only one timer may run per
 * user; starting another returns a conflict unless `force` is set, in which
 * case the running one is stopped first.
 */
export async function startTimer(
  dailyTaskId: string,
  force = false,
): Promise<TimerResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("project_id, project_task_id")
    .eq("id", dailyTaskId)
    .maybeSingle();
  if (taskError) return { ok: false, message: taskError.message };
  if (!task) return { ok: false, message: "Task not found." };

  const { data: running } = await supabase
    .from("time_logs")
    .select("id, task_id, started_at")
    .is("ended_at", null)
    .is("deleted_at", null)
    .maybeSingle();

  if (running) {
    if (running.task_id === dailyTaskId) {
      return { ok: true }; // already running for this task
    }
    if (!force) {
      return {
        ok: false,
        conflict: true,
        message: "A timer is already running.",
      };
    }
    await supabase
      .from("time_logs")
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds: durationSeconds(running.started_at),
      })
      .eq("id", running.id);
  }

  const { error } = await supabase.from("time_logs").insert({
    user_id: user.id,
    task_id: dailyTaskId,
    project_id: task.project_id,
    project_task_id: task.project_task_id,
    started_at: new Date().toISOString(),
  });
  if (error) return { ok: false, message: error.message };

  revalidateTime();
  return { ok: true };
}

/** Stop (or pause) the currently running timer. */
export async function stopTimer(): Promise<TimerResult> {
  const supabase = await createClient();
  const { data: running } = await supabase
    .from("time_logs")
    .select("id, started_at")
    .is("ended_at", null)
    .is("deleted_at", null)
    .maybeSingle();

  if (running) {
    const { error } = await supabase
      .from("time_logs")
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds: durationSeconds(running.started_at),
      })
      .eq("id", running.id);
    if (error) return { ok: false, message: error.message };
  }

  revalidateTime();
  return { ok: true };
}
