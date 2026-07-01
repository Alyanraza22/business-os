import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/features/auth/auth";
import { AppearanceCard } from "@/features/settings/components/appearance-card";
import { ExportCard } from "@/features/settings/components/export-card";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { getProfile } from "@/features/settings/queries";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const [profile, user] = await Promise.all([getProfile(), getUser()]);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your profile and preferences."
      />

      <div className="flex max-w-2xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your account details and regional preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={profile} email={user?.email ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose your theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <AppearanceCard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>
              Download a complete copy of your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExportCard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
