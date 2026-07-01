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
import { type FormState, initialFormState } from "@/lib/form";
import type { Project } from "@/lib/supabase/types";
import { PRIORITIES, PROJECT_STATUSES } from "@/lib/enums";

import {
  DEFAULT_PROJECT_COLOR,
  DEFAULT_PROJECT_ICON,
  PRIORITY_META,
  PROJECT_COLORS,
  PROJECT_ICONS,
  PROJECT_STATUS_META,
} from "../constants";

type ProjectFormAction = (
  state: FormState,
  formData: FormData,
) => Promise<FormState>;

interface ProjectFormProps {
  project?: Project;
  action: ProjectFormAction;
  submitLabel: string;
  onSuccess: () => void;
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-destructive text-xs">{messages[0]}</p>;
}

export function ProjectForm({
  project,
  action,
  submitLabel,
  onSuccess,
}: ProjectFormProps) {
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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={project?.name}
          placeholder="My project"
          autoFocus
          required
          aria-invalid={errors.name ? true : undefined}
        />
        <FieldError messages={errors.name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description ?? ""}
          placeholder="What is this project about?"
          rows={3}
        />
        <FieldError messages={errors.description} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Status</Label>
          <Select name="status" defaultValue={project?.status ?? "planning"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {PROJECT_STATUS_META[value].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Priority</Label>
          <Select name="priority" defaultValue={project?.priority ?? "medium"}>
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deadline">Deadline</Label>
        <Input
          id="deadline"
          name="deadline"
          type="date"
          defaultValue={project?.deadline ?? ""}
        />
        <FieldError messages={errors.deadline} />
        <p className="text-muted-foreground text-xs">
          Progress is calculated automatically from completed tasks.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Icon</Label>
        <Select
          name="icon"
          defaultValue={project?.icon ?? DEFAULT_PROJECT_ICON}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_ICONS.map(({ name, icon: Icon }) => (
              <SelectItem key={name} value={name}>
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_COLORS.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={
                  (project?.color ?? DEFAULT_PROJECT_COLOR) === color
                }
                className="peer sr-only"
              />
              <span
                style={{ backgroundColor: color }}
                className="ring-ring ring-offset-background block size-7 rounded-full ring-offset-2 peer-checked:ring-2 peer-focus-visible:ring-2"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
