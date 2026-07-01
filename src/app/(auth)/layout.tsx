import type { ReactNode } from "react";

/** Centered shell for unauthenticated pages (login, errors). */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
