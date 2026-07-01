"use client";

import { type ReactNode, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Note } from "@/lib/supabase/types";

import { createNote, updateNote } from "../actions";
import { NoteForm } from "./note-form";

interface NoteDialogProps {
  note?: Note;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NoteDialog({
  note,
  trigger,
  open,
  onOpenChange,
}: NoteDialogProps) {
  const isEdit = Boolean(note);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalOpen(value);
  };

  const action = isEdit && note ? updateNote.bind(null, note.id) : createNote;

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit note" : "New note"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update your note." : "Jot something down."}
          </DialogDescription>
        </DialogHeader>
        <NoteForm
          note={note}
          action={action}
          submitLabel={isEdit ? "Save" : "Create note"}
          onSuccess={() => {
            setOpen(false);
            toast.success(isEdit ? "Note saved" : "Note created");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
