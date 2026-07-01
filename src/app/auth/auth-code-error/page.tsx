import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Sign-in error",
  robots: { index: false, follow: false },
};

export default function AuthCodeErrorPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <Heading size="h3">We couldn&apos;t sign you in</Heading>
      <Text variant="muted" className="max-w-sm">
        Something went wrong while completing your sign-in. The link may have
        expired. Please try again.
      </Text>
      <Button asChild>
        <Link href="/login">Back to sign in</Link>
      </Button>
    </main>
  );
}
