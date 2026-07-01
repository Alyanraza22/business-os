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
import type { ProjectTask } from "@/lib/supabase/types";

import { createProjectTask, updateProjectTask } from "../actions";
import { ProjectTaskForm } from "./project-task-form";

interface ProjectTaskDialogProps {
  projectId: string;
  task?: ProjectTask;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProjectTaskDialog({
  projectId,
  task,
  trigger,
  open,
  onOpenChange,
}: ProjectTaskDialogProps) {
  const isEdit = Boolean(task);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalOpen(value);
  };

  const action =
    isEdit && task
      ? updateProjectTask.bind(null, task.id)
      : createProjectTask.bind(null, projectId);

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit deliverable" : "New deliverable"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this project task."
              : "Add a deliverable that contributes to project progress."}
          </DialogDescription>
        </DialogHeader>
        <ProjectTaskForm
          task={task}
          action={action}
          submitLabel={isEdit ? "Save changes" : "Create deliverable"}
          onSuccess={() => {
            setOpen(false);
            toast.success(
              isEdit ? "Deliverable updated" : "Deliverable created",
            );
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
