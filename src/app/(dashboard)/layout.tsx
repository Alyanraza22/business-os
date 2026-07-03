import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SkipLink } from "@/components/layout/skip-link";
import { Topbar } from "@/components/layout/topbar";
import { requireUser } from "@/features/auth/auth";

/**
 * Authenticated application shell. `requireUser` guards every route in this
 * group (belt-and-suspenders with the proxy) and supplies the account menu.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  const metadata = user.user_metadata ?? {};
  const name =
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    user.email ??
    "User";
  const avatarUrl = (metadata.avatar_url as string | undefined) ?? null;

  return (
    <div className="bg-background flex min-h-dvh">
      <SkipLink />
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar name={name} email={user.email ?? ""} avatarUrl={avatarUrl} />
        <main id="main-content" className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
