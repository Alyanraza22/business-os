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
import { GOAL_STATUSES, GOAL_TYPES } from "@/lib/enums";
import { type FormState, initialFormState } from "@/lib/form";
import type { Goal } from "@/lib/supabase/types";

import { GOAL_STATUS_META, GOAL_TYPE_META } from "../constants";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

interface GoalFormProps {
  goal?: Goal;
  action: Action;
  submitLabel: string;
  onSuccess: () => void;
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-destructive text-xs">{messages[0]}</p>;
}

export function GoalForm({
  goal,
  action,
  submitLabel,
  onSuccess,
}: GoalFormProps) {
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
          defaultValue={goal?.title}
          placeholder="e.g. Ship 30 focused hours this week"
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
          defaultValue={goal?.description ?? ""}
          placeholder="Optional detail"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Type</Label>
          <Select name="type" defaultValue={goal?.type ?? "weekly"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GOAL_TYPES.map((value) => (
                <SelectItem key={value} value={value}>
                  {GOAL_TYPE_META[value].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Status</Label>
          <Select name="status" defaultValue={goal?.status ?? "active"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GOAL_STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {GOAL_STATUS_META[value].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="target">Target</Label>
          <Input
            id="target"
            name="target"
            type="number"
            min={0}
            step="any"
            defaultValue={goal?.target ?? ""}
            required
            aria-invalid={errors.target ? true : undefined}
          />
          <FieldError messages={errors.target} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="current">Current</Label>
          <Input
            id="current"
            name="current"
            type="number"
            min={0}
            step="any"
            defaultValue={goal?.current ?? 0}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            name="unit"
            defaultValue={goal?.unit ?? ""}
            placeholder="hours"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deadline">Deadline</Label>
        <Input
          id="deadline"
          name="deadline"
          type="date"
          defaultValue={goal?.deadline ?? ""}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
