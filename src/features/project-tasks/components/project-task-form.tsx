"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY_META } from "@/features/shared/constants";
import { type FormState, initialFormState } from "@/lib/form";
import type { ProjectTask } from "@/lib/supabase/types";
import { PRIORITIES, VISIBLE_TASK_STATUSES } from "@/lib/enums";

import { PROJECT_TASK_STATUS_META } from "../constants";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

interface ProjectTaskFormProps {
  task?: ProjectTask;
  action: Action;
  submitLabel: string;
  onSuccess: () => void;
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-destructive text-xs">{messages[0]}</p>;
}

export function ProjectTaskForm({
  task,
  action,
  submitLabel,
  onSuccess,
}: ProjectTaskFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const errors = state.errors ?? {};

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
          defaultValue={task?.title}
          placeholder="e.g. Authentication"
          autoFocus
          required
          aria-invalid={errors.title ? true : undefined}
        />
        <FieldError messages={errors.title} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={task?.description ?? ""}
          placeholder="What does this deliverable involve?"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Status</Label>
          <Select name="status" defaultValue={task?.status ?? "todo"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIBLE_TASK_STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {PROJECT_TASK_STATUS_META[value].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Priority</Label>
          <Select name="priority" defaultValue={task?.priority ?? "medium"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((value) => (
                <SelectItem key={value} value={value}>
                  {PRIORITY_META[value].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="due_date">Due date</Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            defaultValue={task?.due_date ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="estimated_hours">Estimated hours</Label>
          <Input
            id="estimated_hours"
            name="estimated_hours"
            type="number"
            min={0}
            step="0.5"
            defaultValue={task?.estimated_hours ?? ""}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
