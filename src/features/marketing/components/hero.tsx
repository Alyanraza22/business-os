import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ProductPreview } from "./product-preview";

/** Landing hero: headline, supporting copy, primary CTAs, and product preview. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center sm:pt-28">
        <span className="border-border bg-card text-muted-foreground mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
          <span className="bg-primary size-1.5 rounded-full" aria-hidden />
          Your work, unified
        </span>

        <h1 className="text-foreground mx-auto max-w-[16ch] text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl md:text-6xl">
          The operating system for your work.
        </h1>

        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
          Projects, a daily planner, time tracking, goals, earnings and notes —
          one calm, fast workspace built for people who run their own thing.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">Start free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#features">Explore the product</a>
          </Button>
        </div>

        <p className="text-muted-foreground mt-4 text-xs">
          Free to use · Sign in with Google · No credit card
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <ProductPreview />
      </div>
    </section>
  );
}
