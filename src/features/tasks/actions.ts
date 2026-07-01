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
