"use server";

import { revalidatePath } from "next/cache";

import { type FormState, zodFieldErrors } from "@/lib/form";
import { createClient } from "@/lib/supabase/server";
import { createNoteSchema, updateNoteSchema } from "@/lib/validations/note";

function parseForm(formData: FormData) {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : undefined;
  };
  return {
    title: get("title")?.trim() ?? "",
    content: get("content") ?? "",
  };
}

function revalidateNotes() {
  revalidatePath("/notes");
}

export async function createNote(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = createNoteSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const { error } = await supabase
    .from("notes")
    .insert({ ...parsed.data, user_id: user.id });
  if (error) return { ok: false, message: error.message };

  revalidateNotes();
  return { ok: true };
}

export async function updateNote(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = updateNoteSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateNotes();
  return { ok: true };
}

export async function setNotePinned(
  id: string,
  pinned: boolean,
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ is_pinned: pinned })
    .eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateNotes();
  return { ok: true };
}

export async function setNoteArchived(
  id: string,
  archived: boolean,
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ is_archived: archived })
    .eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateNotes();
  return { ok: true };
}

export async function deleteNote(id: string): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateNotes();
  return { ok: true };
}
