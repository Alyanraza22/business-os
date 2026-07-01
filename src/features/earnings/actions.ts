"use server";

import { revalidatePath } from "next/cache";

import { type FormState, zodFieldErrors } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import {
  createEarningSchema,
  updateEarningSchema,
} from "@/lib/validations/earning";

function parseForm(formData: FormData) {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() !== ""
      ? value.trim()
      : undefined;
  };
  const amount = get("amount");
  return {
    amount: amount !== undefined ? Number(amount) : undefined,
    currency: get("currency"),
    source: get("source"),
    category: get("category"),
    earned_on: get("earned_on"),
    description: get("description"),
  };
}

function revalidateEarnings() {
  revalidatePath("/earnings");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function createEarning(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = createEarningSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const { error } = await supabase
    .from("earnings")
    .insert({ ...parsed.data, user_id: user.id });
  if (error) return { ok: false, message: error.message };

  revalidateEarnings();
  return { ok: true };
}

export async function updateEarning(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = updateEarningSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("earnings")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateEarnings();
  return { ok: true };
}

export async function deleteEarning(id: string): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("earnings")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateEarnings();
  return { ok: true };
}
