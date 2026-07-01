"use client";

import {
  Archive,
  ArchiveRestore,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Note } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

import { deleteNote, setNoteArchived, setNotePinned } from "../actions";
import { NoteDialog } from "./note-dialog";

export function NoteCard({ note }: { note: Note }) {
  const [pending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function run(fn: () => Promise<{ ok: boolean; message?: string }>) {
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) toast.error(result.message ?? "Something went wrong");
    });
  }

  async function handleDelete() {
    const result = await deleteNote(note.id);
    if (result.ok) {
      toast.success("Note deleted");
      setDeleteOpen(false);
    } else {
      toast.error(result.message ?? "Delete failed");
    }
  }

  return (
    <Card
      className={cn(
        "hover:border-primary/40 flex flex-col gap-2 p-4 transition-[border-color,box-shadow] duration-200 hover:shadow-md",
        pending && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left outline-none"
        >
          {note.is_pinned ? (
            <Pin className="text-primary size-3.5 shrink-0" />
          ) : null}
          <span className="truncate font-medium">
            {note.title || "Untitled note"}
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground -mt-1 -mr-1 size-7 shrink-0"
              aria-label="Note actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                run(() => setNotePinned(note.id, !note.is_pinned))
              }
            >
              {note.is_pinned ? <PinOff /> : <Pin />}
              {note.is_pinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                run(() => setNoteArchived(note.id, !note.is_archived))
              }
            >
              {note.is_archived ? <ArchiveRestore /> : <Archive />}
              {note.is_archived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {note.content ? (
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="text-muted-foreground text-left text-sm outline-none"
        >
          <span className="line-clamp-6 whitespace-pre-wrap">
            {note.content}
          </span>
        </button>
      ) : null}

      <NoteDialog note={note} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete note?"
        description="This note will be moved to trash."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </Card>
  );
}
