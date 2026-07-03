"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialFormState } from "@/lib/form";

import { signInWithEmail } from "../actions";
import { FieldError, FormError } from "./field-error";
import { PasswordInput } from "./password-input";

export function SignInForm() {
  const [state, action, pending] = useActionState(
    signInWithEmail,
    initialFormState,
  );
  const errors = state.errors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.ok ? undefined : state.message} />

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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-primary text-xs font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={errors.password ? true : undefined}
          required
        />
        <FieldError messages={errors.password} />
      </div>

      <label className="text-muted-foreground flex w-fit cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="remember"
          defaultChecked
          className="accent-primary border-input size-4 rounded"
        />
        Remember me
      </label>

      <Button type="submit" loading={pending} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
