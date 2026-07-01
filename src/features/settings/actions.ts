"use server";

import { revalidatePath } from "next/cache";

import { type FormState, zodFieldErrors } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validations/profile";

function parseForm(formData: FormData) {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() !== ""
      ? value.trim()
      : undefined;
  };
  const workingHours = get("working_hours_per_day");
  return {
    full_name: get("full_name"),
    currency: get("currency"),
    timezone: get("timezone"),
    working_hours_per_day:
      workingHours !== undefined ? Number(workingHours) : undefined,
  };
}

export async function updateProfile(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = updateProfileSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id);
  if (error) return { ok: false, message: error.message };

  // Currency/timezone affect formatting across the app.
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/earnings");
  revalidatePath("/tasks");
  return { ok: true };
}

export interface ExportResult {
  ok: boolean;
  json?: string;
  message?: string;
}

/** Export the signed-in user's data as a JSON string. */
export async function exportData(): Promise<ExportResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const tables = [
    "profiles",
    "projects",
    "milestones",
    "project_tasks",
    "tasks",
    "time_logs",
    "goals",
    "earnings",
    "notes",
  ] as const;

  const output: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
  };
  for (const table of tables) {
    const { data } = await supabase.from(table).select("*");
    output[table] = data ?? [];
  }

  return { ok: true, json: JSON.stringify(output, null, 2) };
}
