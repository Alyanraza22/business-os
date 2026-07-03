import { Notebook, Plus } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import type { Note } from "@/lib/supabase/types";

import { NoteCard } from "./note-card";
import { NoteDialog } from "./note-dialog";

interface NotesGridProps {
  notes: Note[];
  filtered: boolean;
}

export function NotesGrid({ notes, filtered }: NotesGridProps) {
  if (notes.length === 0) {
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
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
