"use client";

import { Notebook, Plus } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import type { Note } from "@/lib/supabase/types";

import { deleteNote } from "../actions";
import { NoteCard } from "./note-card";
import { NoteDialog } from "./note-dialog";

interface NotesGridProps {
  notes: Note[];
  filtered: boolean;
}

export function NotesGrid({ notes, filtered }: NotesGridProps) {
  const [optimistic, removeOptimistic] = useOptimistic(
    notes,
    (state, removedId: string) => state.filter((n) => n.id !== removedId),
  );
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      removeOptimistic(id);
      const result = await deleteNote(id);
      if (result.ok) toast.success("Note deleted");
      else toast.error(result.message ?? "Delete failed");
    });
  }

  if (optimistic.length === 0) {
    return (
      <EmptyState
        icon={Notebook}
        title={filtered ? "Nothing here" : "No notes yet"}
        description={
          filtered
            ? "No notes match your search or view."
            : "Notes are your quiet space for ideas, meeting notes and reminders. Capture your first — then pin, archive and search across everything."
        }
        action={
          filtered ? undefined : (
            <NoteDialog
              trigger={
                <Button>
                  <Plus />
                  New note
                </Button>
              }
            />
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {optimistic.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={handleDelete} />
      ))}
    </div>
  );
}
