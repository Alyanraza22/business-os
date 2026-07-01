"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";

/**
 * Error boundary for all authenticated routes. Renders a recoverable error
 * state with a retry action instead of crashing the page.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging; wire to monitoring later.
    console.error(error);
  }, [error]);

  return (
    <div className="border-border flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center">
      <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
        <AlertTriangle className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <Heading size="h4">Something went wrong</Heading>
        <Text variant="muted" className="max-w-sm">
          We couldn&apos;t load this page. This can happen if the database is
          unreachable or not set up yet.
        </Text>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
