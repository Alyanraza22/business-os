"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

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
import { CURRENCIES } from "@/lib/currencies";
import { type FormState, initialFormState } from "@/lib/form";
import type { Profile } from "@/lib/supabase/types";

import { updateProfile } from "../actions";

function getTimezones(): string[] {
  const intl = Intl as { supportedValuesOf?: (key: string) => string[] };
  if (typeof intl.supportedValuesOf === "function") {
    try {
      return intl.supportedValuesOf("timeZone");
    } catch {
      // fall through
    }
  }
  return [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Berlin",
    "Asia/Karachi",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
}

const TIMEZONES = getTimezones();

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-destructive text-xs">{messages[0]}</p>;
}

interface ProfileFormProps {
  profile: Profile | null;
  email: string;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialFormState,
  );
  const errors = state.errors ?? {};

  useEffect(() => {
    if (state.ok) toast.success("Settings saved");
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.message ? (
        <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue={email} disabled readOnly />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile?.full_name ?? ""}
          placeholder="Your name"
        />
        <FieldError messages={errors.full_name} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Currency</Label>
          <Select name="currency" defaultValue={profile?.currency ?? "USD"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="working_hours_per_day">Working hours / day</Label>
          <Input
            id="working_hours_per_day"
            name="working_hours_per_day"
            type="number"
            min={0}
            max={24}
            step="0.5"
            defaultValue={profile?.working_hours_per_day ?? 8}
          />
          <FieldError messages={errors.working_hours_per_day} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="timezone">Timezone</Label>
        <select
          id="timezone"
          name="timezone"
          defaultValue={profile?.timezone ?? "UTC"}
          className="border-input focus-visible:ring-ring focus-visible:ring-offset-background h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        >
          {TIMEZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        <FieldError messages={errors.timezone} />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={pending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
