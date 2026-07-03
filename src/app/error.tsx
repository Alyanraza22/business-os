"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to the console for debugging / monitoring.
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
        Error
      </p>
      <div className="flex flex-col gap-3">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md leading-relaxed">
          An unexpected error occurred. You can try again, and if it keeps
          happening we&apos;d love to hear about it.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
