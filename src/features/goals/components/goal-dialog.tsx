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
import type { Goal } from "@/lib/supabase/types";

import { createGoal, updateGoal } from "../actions";
import { GoalForm } from "./goal-form";

interface GoalDialogProps {
  goal?: Goal;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GoalDialog({
  goal,
  trigger,
  open,
  onOpenChange,
}: GoalDialogProps) {
  const isEdit = Boolean(goal);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalOpen(value);
  };

  const action = isEdit && goal ? updateGoal.bind(null, goal.id) : createGoal;

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit goal" : "New goal"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update your goal." : "Set a target to work towards."}
          </DialogDescription>
        </DialogHeader>
        <GoalForm
          goal={goal}
          action={action}
          submitLabel={isEdit ? "Save changes" : "Create goal"}
          onSuccess={() => {
            setOpen(false);
            toast.success(isEdit ? "Goal updated" : "Goal created");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
