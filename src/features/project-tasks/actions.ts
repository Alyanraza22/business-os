"use server";

import { revalidatePath } from "next/cache";

import { type FormState, zodFieldErrors } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import {
  createProjectTaskSchema,
  updateProjectTaskSchema,
} from "@/lib/validations/project-task";

function parseForm(formData: FormData) {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() !== ""
      ? value.trim()
      : undefined;
  };
  const estimate = get("estimated_hours");
  return {
    title: get("title"),
    description: get("description"),
    status: get("status"),
    priority: get("priority"),
    due_date: get("due_date"),
    estimated_hours: estimate !== undefined ? Number(estimate) : undefined,
  };
}

// Revalidate the whole /projects segment (list + every detail page) plus the
// dashboard, so derived progress refreshes wherever it is shown.
function revalidateProjects() {
  revalidatePath("/projects", "layout");
  revalidatePath("/dashboard");
}

export async function createProjectTask(
  projectId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = createProjectTaskSchema.safeParse({
    ...parseForm(formData),
    project_id: projectId,
  });
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
    .from("project_tasks")
    .insert({ ...parsed.data, user_id: user.id });
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateProjects();
  return { ok: true };
}

export async function updateProjectTask(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = updateProjectTaskSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("project_tasks")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateProjects();
  return { ok: true };
}

/** Inline status change (including manual mark-complete). */
export async function setProjectTaskStatus(
  id: string,
  status: string,
): Promise<FormState> {
  const parsed = updateProjectTaskSchema.pick({ status: true }).safeParse({
    status,
  });
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("project_tasks")
    .update({ status: parsed.data.status })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateProjects();
  return { ok: true };
}

export async function deleteProjectTask(id: string): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateProjects();
  return { ok: true };
}
