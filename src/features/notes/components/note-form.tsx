"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type FormState, initialFormState } from "@/lib/form";
import type { Note } from "@/lib/supabase/types";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

interface NoteFormProps {
  note?: Note;
  action: Action;
  submitLabel: string;
  onSuccess: () => void;
}

export function NoteForm({
  note,
  action,
  submitLabel,
  onSuccess,
}: NoteFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);

  useEffect(() => {
    if (state.ok) onSuccess();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.message ? (
        <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={note?.title ?? ""}
          placeholder="Note title"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={note?.content ?? ""}
          placeholder="Write your note..."
          rows={8}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
