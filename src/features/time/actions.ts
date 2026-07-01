"use server";

import { revalidatePath } from "next/cache";

import type { FormState } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";

/** Soft-delete a time entry. */
export async function deleteSession(id: string): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("time_logs")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/time");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/projects", "layout");
  return { ok: true };
}
