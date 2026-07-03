"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialFormState } from "@/lib/form";

import { signUpWithEmail } from "../actions";
import { FieldError, FormError } from "./field-error";
import { PasswordInput } from "./password-input";

export function SignUpForm() {
  const [state, action, pending] = useActionState(
    signUpWithEmail,
    initialFormState,
  );
  const errors = state.errors ?? {};

  // Email confirmation required — show a friendly "check your inbox" panel.
  if (state.ok && state.message) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-full">
          <MailCheck className="size-5" />
        </div>
        <p className="text-foreground font-medium">Confirm your email</p>
        <p className="text-muted-foreground text-sm">{state.message}</p>
        <Button asChild variant="outline" className="mt-2 w-full">
          <Link href="/signin">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.ok ? undefined : state.message} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          aria-invalid={errors.full_name ? true : undefined}
          required
        />
        <FieldError messages={errors.full_name} />
      </div>

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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          aria-invalid={errors.password ? true : undefined}
          required
        />
        <FieldError messages={errors.password} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          aria-invalid={errors.confirmPassword ? true : undefined}
          required
        />
        <FieldError messages={errors.confirmPassword} />
      </div>

      <Button type="submit" loading={pending} className="w-full">
        Create account
      </Button>
    </form>
  );
}
