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
import { CURRENCIES } from "@/lib/currencies";
import { EARNING_CATEGORIES } from "@/lib/enums";
import { type FormState, initialFormState } from "@/lib/form";
import type { Earning } from "@/lib/supabase/types";

import { EARNING_CATEGORY_META } from "../constants";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

interface EarningFormProps {
  earning?: Earning;
  defaultCurrency: string;
  action: Action;
  submitLabel: string;
  onSuccess: () => void;
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-destructive text-xs">{messages[0]}</p>;
}

export function EarningForm({
  earning,
  defaultCurrency,
  action,
  submitLabel,
  onSuccess,
}: EarningFormProps) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const errors = state.errors ?? {};
  const today = new Date().toISOString().slice(0, 10);

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

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={0}
            step="0.01"
            defaultValue={earning?.amount ?? ""}
            autoFocus
            required
            aria-invalid={errors.amount ? true : undefined}
          />
          <FieldError messages={errors.amount} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Currency</Label>
          <Select
            name="currency"
            defaultValue={earning?.currency ?? defaultCurrency}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} — {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Category</Label>
          <Select name="category" defaultValue={earning?.category ?? "other"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EARNING_CATEGORIES.map((value) => (
                <SelectItem key={value} value={value}>
                  {EARNING_CATEGORY_META[value].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="earned_on">Date</Label>
          <Input
            id="earned_on"
            name="earned_on"
            type="date"
            defaultValue={earning?.earned_on ?? today}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          name="source"
          defaultValue={earning?.source ?? ""}
          placeholder="e.g. Client retainer, Etsy sale"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Notes</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={earning?.description ?? ""}
          rows={2}
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
