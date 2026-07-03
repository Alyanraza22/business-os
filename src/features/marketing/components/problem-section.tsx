import { Layers, RefreshCw, Search } from "lucide-react";

import { SectionHeading } from "./section-heading";

const PROBLEMS = [
  {
    title: "Work lives in ten places",
    description:
      "Projects in one app, your day in another, time in a spreadsheet, income wherever you last wrote it down. Nothing talks to anything else.",
    icon: Layers,
  },
  {
    title: "Constant context-switching",
    description:
      "Every tab is a different mental model. The friction of jumping between tools quietly eats the focus you needed for the actual work.",
    icon: RefreshCw,
  },
  {
    title: "Numbers you can't trust",
    description:
      "Progress is a guess, hours are approximate, and revenue is scattered. When the data disagrees, you stop relying on it.",
    icon: Search,
  },
];

/** Names the pain Business OS resolves, before showing the solution. */
export function ProblemSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="The problem"
          title="Running your own work shouldn't feel this scattered"
          description="Most tools solve one slice of the picture. The gaps between them are where time and clarity leak out."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((problem) => (
            <div
              key={problem.title}
              className="border-border bg-card rounded-xl border p-6"
            >
              <div className="text-muted-foreground mb-4 flex size-10 items-center justify-center rounded-md border border-dashed">
                <problem.icon className="size-5" />
              </div>
              <h3 className="text-foreground font-semibold tracking-tight">
                {problem.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed">
          Business OS closes those gaps by putting every part of your work on
          one shared foundation — so the whole picture finally agrees with
          itself.
        </p>
      </div>
    </section>
  );
}
