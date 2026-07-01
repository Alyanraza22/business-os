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
import type { Project } from "@/lib/supabase/types";

import { createProject, updateProject } from "../actions";
import { ProjectForm } from "./project-form";

interface ProjectDialogProps {
  project?: Project;
  /** Provide for an uncontrolled dialog (e.g. a "New project" button). */
  trigger?: ReactNode;
  /** Provide both for a controlled dialog (e.g. opened from a card menu). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProjectDialog({
  project,
  trigger,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  const isEdit = Boolean(project);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalOpen(value);
  };

  const action =
    isEdit && project ? updateProject.bind(null, project.id) : createProject;

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of your project."
              : "Add a new project to organize your work."}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          project={project}
          action={action}
          submitLabel={isEdit ? "Save changes" : "Create project"}
          onSuccess={() => {
            setOpen(false);
            toast.success(isEdit ? "Project updated" : "Project created");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
