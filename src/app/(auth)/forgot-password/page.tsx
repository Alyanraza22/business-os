import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getUser } from "@/features/auth/auth";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Forgot password",
  description: `Reset your ${siteConfig.name} password.`,
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage() {
  if (await getUser()) redirect("/dashboard");

  return (
    <>
      <AuthHeader
        title="Reset your password"
        subtitle="Enter your email and we'll send you a reset link"
      />
      <Card>
        <CardContent className="pt-6">
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </>
  );
}
