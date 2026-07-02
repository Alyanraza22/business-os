import { Gauge, Lock, Shapes, Sparkles, type LucideIcon } from "lucide-react";

import { SectionHeading } from "./section-heading";

interface Reason {
  title: string;
  description: string;
  icon: LucideIcon;
}

const REASONS: Reason[] = [
  {
    title: "Fast by design",
    description:
      "Server-rendered, keyboard-friendly and instant. Inline editing means fewer clicks and no waiting.",
    icon: Gauge,
  },
  {
    title: "Genuinely unified",
    description:
      "Projects, time, goals and earnings share one data model — so numbers always agree with each other.",
    icon: Shapes,
  },
  {
    title: "Yours and private",
    description:
      "Row-level security means your data is scoped to you. No noise, no selling, no clutter.",
    icon: Lock,
  },
  {
    title: "Quietly premium",
    description:
      "A restrained, timeless interface that stays out of the way and respects your attention.",
    icon: Sparkles,
  },
];

/** Differentiators band. */
export function WhySection() {
  return (
    <section id="why" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Why Business OS"
          title="Built to be lived in"
          description="Not another dashboard template — a workspace tuned for focus and clarity."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="border-border bg-card flex gap-4 rounded-xl border p-6"
            >
              <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
                <reason.icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-foreground font-semibold tracking-tight">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
