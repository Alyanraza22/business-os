"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/features/auth/actions";
import { FieldError } from "@/features/auth/components/field-error";
import { PasswordInput } from "@/features/auth/components/password-input";
import { initialFormState } from "@/lib/form";

interface ChangePasswordFormProps {
  /** Whether the account already has an email/password credential. */
  hasPasswordLogin: boolean;
}

export function ChangePasswordForm({
  hasPasswordLogin,
}: ChangePasswordFormProps) {
  const [state, action, pending] = useActionState(
    changePassword,
    initialFormState,
  );
  const errors = state.errors ?? {};
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message ?? "Password updated");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      {state.message && !state.ok ? (
        <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
          {state.message}
        </p>
      ) : null}

      {!hasPasswordLogin ? (
        <p className="text-muted-foreground text-sm">
          You currently sign in with Google. Set a password below to also enable
          email sign-in.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currentPassword">Current password</Label>
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
            autoComplete="current-password"
            aria-invalid={errors.currentPassword ? true : undefined}
          />
          <FieldError messages={errors.currentPassword} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-password">New password</Label>
        <PasswordInput
          id="new-password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          aria-invalid={errors.password ? true : undefined}
        />
        <FieldError messages={errors.password} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <PasswordInput
          id="confirm-password"
          name="confirmPassword"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword ? true : undefined}
        />
        <FieldError messages={errors.confirmPassword} />
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" loading={pending}>
          {hasPasswordLogin ? "Update password" : "Set password"}
        </Button>
      </div>
    </form>
  );
}
