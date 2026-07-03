"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { initialFormState } from "@/lib/form";

import { resetPassword } from "../actions";
import { FieldError, FormError } from "./field-error";
import { PasswordInput } from "./password-input";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(
    resetPassword,
    initialFormState,
  );
  const errors = state.errors ?? {};

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="bg-success/10 text-success flex size-11 items-center justify-center rounded-full">
          <CheckCircle2 className="size-5" />
        </div>
        <p className="text-foreground font-medium">Password updated</p>
        <p className="text-muted-foreground text-sm">{state.message}</p>
        <Button asChild className="mt-2 w-full">
          <Link href="/signin">Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.message} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">New password</Label>
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
        <Label htmlFor="confirmPassword">Confirm new password</Label>
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
        Update password
      </Button>
    </form>
  );
}
