"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialFormState } from "@/lib/form";

import { requestPasswordReset } from "../actions";
import { FieldError } from "./field-error";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    requestPasswordReset,
    initialFormState,
  );
  const errors = state.errors ?? {};

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-full">
          <MailCheck className="size-5" />
        </div>
        <p className="text-foreground font-medium">Check your inbox</p>
        <p className="text-muted-foreground text-sm">{state.message}</p>
        <Button asChild variant="outline" className="mt-2 w-full">
          <Link href="/signin">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? true : undefined}
          required
        />
        <FieldError messages={errors.email} />
      </div>

      <Button type="submit" loading={pending} className="w-full">
        Send reset link
      </Button>

      <Link
        href="/signin"
        className="text-muted-foreground hover:text-foreground text-center text-sm transition-colors"
      >
        Back to sign in
      </Link>
    </form>
  );
}
