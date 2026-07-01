"use server";

import { revalidatePath } from "next/cache";

import { type FormState, zodFieldErrors } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/project";

/** Read raw project fields from a submitted form, normalizing empty strings. */
function parseProjectForm(formData: FormData) {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() !== ""
      ? value.trim()
      : undefined;
  };
  const progress = get("progress");
  return {
    name: get("name"),
    description: get("description"),
    status: get("status"),
    priority: get("priority"),
    deadline: get("deadline"),
    color: get("color"),
    icon: get("icon"),
    progress: progress !== undefined ? Number(progress) : undefined,
  };
}

function revalidateProjects() {
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function createProject(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = createProjectSchema.safeParse(parseProjectForm(formData));
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
    .from("projects")
    .insert({ ...parsed.data, user_id: user.id });
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateProjects();
  return { ok: true };
}

export async function updateProject(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = updateProjectSchema.safeParse(parseProjectForm(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateProjects();
  return { ok: true };
}

/** Soft delete — the row is kept with deleted_at set. */
export async function deleteProject(id: string): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateProjects();
  return { ok: true };
}
