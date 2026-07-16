import type { Metadata } from "next";

import { FocusView } from "@/features/focus/components/focus-view";
import { getFocusSession } from "@/features/focus/queries";

export const metadata: Metadata = {
  title: "Focus",
  robots: { index: false, follow: false },
};

export default async function FocusPage() {
  const session = await getFocusSession();
  return <FocusView session={session} />;
}
