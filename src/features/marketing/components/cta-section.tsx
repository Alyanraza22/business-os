import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Closing call-to-action band. */
export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-border bg-card rounded-2xl border px-6 py-16 text-center sm:px-12">
          <h2 className="text-foreground mx-auto max-w-[20ch] text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
            Bring your work into one calm place
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed">
            Start organizing projects, time and goals today — free, and ready in
            under a minute.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/login">Get started free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">See what&apos;s inside</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
