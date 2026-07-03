"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/features/auth/components/field-error";
import { initialFormState } from "@/lib/form";

import { updateAccount } from "../actions";

interface AccountFormProps {
  email: string;
  fullName: string;
  avatarUrl: string;
}

function getInitials(name: string, email: string) {
  const base = name.trim() || email;
  return (
    base
      .split(/\s+/)
      .map((part) => part[0] ?? "")
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function AccountForm({ email, fullName, avatarUrl }: AccountFormProps) {
  const [state, action, pending] = useActionState(
    updateAccount,
    initialFormState,
  );
  const errors = state.errors ?? {};

  useEffect(() => {
    if (state.ok) toast.success("Account updated");
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-4">
      {state.message && !state.ok ? (
        <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName} /> : null}
          <AvatarFallback>{getInitials(fullName, email)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">
            {fullName || "Your name"}
          </p>
          <p className="text-muted-foreground truncate text-xs">{email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-display">Email</Label>
        <Input id="email-display" value={email} disabled readOnly />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Display name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={fullName}
          placeholder="Your name"
          aria-invalid={errors.full_name ? true : undefined}
        />
        <FieldError messages={errors.full_name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          type="url"
          defaultValue={avatarUrl}
          placeholder="https://…"
          aria-invalid={errors.avatar_url ? true : undefined}
        />
        <FieldError messages={errors.avatar_url} />
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" loading={pending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
