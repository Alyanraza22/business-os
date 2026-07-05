"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/lib/supabase/types";

import { deleteProject } from "../actions";
import { ProjectDialog } from "./project-dialog";

export function ProjectCardActions({
  project,
  onDelete,
}: {
  project: Project;
  onDelete?: (id: string) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete() {
    // When the parent list owns optimistic removal, delegate to it so the card
    // disappears instantly; otherwise delete directly.
    if (onDelete) {
      setDeleteOpen(false);
      onDelete(project.id);
      return;
    }
    const result = await deleteProject(project.id);
    if (result.ok) {
      toast.success("Project deleted");
      setDeleteOpen(false);
    } else {
      toast.error(result.message ?? "Failed to delete project");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-8"
            aria-label="Project actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil />
            Edit
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

      <ProjectDialog
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project?"
        description={`"${project.name}" will be moved to trash. You can restore it later.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
