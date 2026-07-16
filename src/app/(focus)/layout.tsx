import type { ReactNode } from "react";

import { requireUser } from "@/features/auth/auth";

/**
 * Focus Mode shell — deliberately bare. No sidebar, no topbar, nothing to look
 * at but the work. Guarded like the rest of the app.
 */
export default async function FocusLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();
  return <div className="bg-background min-h-dvh">{children}</div>;
}
