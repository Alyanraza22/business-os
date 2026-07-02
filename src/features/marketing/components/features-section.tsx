import {
  BarChart3,
  CalendarRange,
  FolderKanban,
  LayoutGrid,
  Notebook,
  Target,
  Timer,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "./section-heading";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    title: "Projects",
    description:
      "Organize everything you're building. Deliverables drive real progress — no manual percentages.",
    icon: FolderKanban,
  },
  {
    title: "Daily Planner",
    description:
      "A spreadsheet-fast worksheet for each day. Plan, edit inline, and check things off.",
    icon: CalendarRange,
  },
  {
    title: "Time Tracker",
    description:
      "Start a timer on any task. Live totals roll up into your day, week and month.",
    icon: Timer,
  },
  {
    title: "Goals",
    description:
      "Set targets, log progress, and watch the bar fill. Numeric or milestone-based.",
    icon: Target,
  },
  {
    title: "Earnings",
    description:
      "Track income by source and category with clean, currency-aware totals.",
    icon: Wallet,
  },
  {
    title: "Notes",
    description:
      "Capture ideas fast with pinning, archiving and full-text search across everything.",
    icon: Notebook,
  },
  {
    title: "Analytics",
    description:
      "See the trends — hours, tasks and revenue — across time and across projects.",
    icon: BarChart3,
  },
  {
    title: "One workspace",
    description:
      "Every module shares the same data, so your work stays connected end to end.",
    icon: LayoutGrid,
  },
];

/** Grid of the product's core modules. */
export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Everything in one place"
          title="One workspace for how you actually work"
          description="Seven connected modules replace the scattered tabs, spreadsheets and sticky notes."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="border-border bg-card hover:border-primary/40 group rounded-xl border p-5 transition-colors"
            >
              <div className="bg-muted text-muted-foreground group-hover:text-primary mb-4 flex size-10 items-center justify-center rounded-md transition-colors">
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-foreground font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
