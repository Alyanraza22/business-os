"use server";

import { revalidatePath } from "next/cache";

import { type FormState, zodFieldErrors } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";

function revalidateTasks() {
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/projects");
}

export interface PlannerBulkResult {
  ok: boolean;
  message?: string;
  count?: number;
}

/**
 * Pull every unfinished task from earlier days onto `date`.
 *
 * Tasks stay on the day they were planned for, so anything not finished simply
 * accumulates in the past and disappears from view. This moves it back in front
 * of the user instead of silently rotting.
 */
export async function carryOverUnfinished(
  date: string,
): Promise<PlannerBulkResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const { data, error } = await supabase
    .from("tasks")
    .update({ work_date: date })
    .lt("work_date", date)
    .in("status", ["todo", "in_progress"])
    .is("deleted_at", null)
    .select("id");

  if (error) return { ok: false, message: error.message };

  revalidateTasks();
  return { ok: true, count: data?.length ?? 0 };
}

/** Rebuild today's sheet from the most recent day that actually had a plan. */
export async function copyPreviousDayPlan(
  date: string,
): Promise<PlannerBulkResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const { data: previous } = await supabase
    .from("tasks")
    .select("work_date")
    .lt("work_date", date)
    .is("deleted_at", null)
    .order("work_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!previous) return { ok: false, message: "No earlier plan to copy from." };

  const { data: rows, error: readError } = await supabase
    .from("tasks")
    .select(
      "title, description, project_id, project_task_id, priority, estimated_hours, sort_order",
    )
    .eq("work_date", previous.work_date)
    .is("deleted_at", null)
    .order("sort_order");

  if (readError) return { ok: false, message: readError.message };
  if (!rows || rows.length === 0) {
    return { ok: false, message: "That day had no tasks to copy." };
  }

  // Copies start fresh — the plan carries over, not its completion state.
  const { error } = await supabase.from("tasks").insert(
    rows.map((row) => ({
      ...row,
      work_date: date,
      status: "todo" as const,
      user_id: user.id,
    })),
  );
  if (error) return { ok: false, message: error.message };

  revalidateTasks();
  return { ok: true, count: rows.length };
}

interface QuickCreateInput {
  title: string;
  project_id: string | null;
  work_date: string;
}

/** Excel-style quick add from the worksheet's new-task row. */
export async function createWorksheetTask(
  input: QuickCreateInput,
): Promise<FormState> {
  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { error } = await supabase
    .from("tasks")
    .insert({ ...parsed.data, user_id: user.id });
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateTasks();
  return { ok: true };
}

/** Inline cell edit — validates and persists a partial patch. */
export async function updateTaskFields(
  id: string,
  patch: Record<string, unknown>,
): Promise<FormState> {
  const parsed = updateTaskSchema.safeParse(patch);
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateTasks();
  return { ok: true };
}

/** Quick complete/uncomplete from the row checkbox. */
export async function toggleTaskStatus(
  id: string,
  completed: boolean,
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ status: completed ? "completed" : "todo" })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateTasks();
  return { ok: true };
}

export async function deleteTask(id: string): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateTasks();
  return { ok: true };
}
