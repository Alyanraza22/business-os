import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Set a new password",
  description: `Set a new password for ${siteConfig.name}.`,
  robots: { index: false, follow: false },
};

// Not guarded away from authenticated users: the reset link establishes a
// recovery session, so the visitor here is "authenticated" by design.
export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeader
        title="Set a new password"
        subtitle="Choose a strong password you don't use elsewhere"
      />
      <Card>
        <CardContent className="pt-6">
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </>
  );
}
