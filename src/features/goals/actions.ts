"use server";

import { revalidatePath } from "next/cache";

import { type FormState, zodFieldErrors } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import { createGoalSchema, updateGoalSchema } from "@/lib/validations/goal";

function parseForm(formData: FormData) {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() !== ""
      ? value.trim()
      : undefined;
  };
  const target = get("target");
  const current = get("current");
  return {
    title: get("title"),
    description: get("description"),
    type: get("type"),
    status: get("status"),
    target: target !== undefined ? Number(target) : undefined,
    current: current !== undefined ? Number(current) : undefined,
    unit: get("unit"),
    deadline: get("deadline"),
  };
}

function revalidateGoals() {
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function createGoal(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = createGoalSchema.safeParse(parseForm(formData));
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
    .from("goals")
    .insert({ ...parsed.data, user_id: user.id });
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateGoals();
  return { ok: true };
}

export async function updateGoal(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = updateGoalSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("goals")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateGoals();
  return { ok: true };
}

/** Quick inline update of the goal's current progress value. */
export async function updateGoalProgress(
  id: string,
  current: number,
): Promise<FormState> {
  const parsed = updateGoalSchema
    .pick({ current: true })
    .safeParse({ current });
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("goals")
    .update({ current: parsed.data.current })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateGoals();
  return { ok: true };
}

export async function setGoalStatus(
  id: string,
  status: string,
): Promise<FormState> {
  const parsed = updateGoalSchema.pick({ status: true }).safeParse({ status });
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("goals")
    .update({ status: parsed.data.status })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateGoals();
  return { ok: true };
}

export async function deleteGoal(id: string): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("goals")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateGoals();
  return { ok: true };
}
