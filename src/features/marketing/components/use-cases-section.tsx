import {
  Briefcase,
  Code2,
  GraduationCap,
  Users,
  Palette,
  PenTool,
  Rocket,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "./section-heading";

interface UseCase {
  role: string;
  description: string;
  icon: LucideIcon;
}

const USE_CASES: UseCase[] = [
  {
    role: "Freelancers",
    description:
      "Track billable hours per client, keep projects on schedule, and see exactly what you've earned this month.",
    icon: Briefcase,
  },
  {
    role: "Developers",
    description:
      "Plan your day in a keyboard-fast worksheet and time your deep-work sessions without leaving the flow.",
    icon: Code2,
  },
  {
    role: "Designers",
    description:
      "Organize client work into projects with clear deliverables, and keep references and notes in one place.",
    icon: Palette,
  },
  {
    role: "Agencies",
    description:
      "Give every engagement its own workspace, then watch progress and hours roll up into one clear view.",
    icon: Users,
  },
  {
    role: "Solo founders",
    description:
      "Run product, goals and finances side by side so you always know where the business actually stands.",
    icon: Rocket,
  },
  {
    role: "Creators",
    description:
      "Turn a content pipeline into projects and daily tasks, and capture every idea before it slips away.",
    icon: PenTool,
  },
  {
    role: "Students",
    description:
      "Plan coursework day by day, set goals for the term, and track the hours you put into each subject.",
    icon: GraduationCap,
  },
  {
    role: "Remote workers",
    description:
      "Keep a calm, self-directed system for tasks, time and goals — wherever you happen to be working.",
    icon: Wifi,
  },
];

/** Persona-based use cases — strong long-tail SEO and real relevance. */
export function UseCasesSection() {
  return (
    <section
      id="use-cases"
      className="border-border scroll-mt-20 border-t py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Who it's for"
          title="One workspace, many kinds of work"
          description="Business OS adapts to how you work — whether you bill clients, ship code, design, or build a company of one."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.role}
              className="border-border bg-card hover:border-primary/40 group flex flex-col rounded-xl border p-5 transition-colors"
            >
              <div className="bg-muted text-muted-foreground group-hover:text-primary mb-4 flex size-10 items-center justify-center rounded-md transition-colors">
                <useCase.icon className="size-5" />
              </div>
              <h3 className="text-foreground font-semibold tracking-tight">
                {useCase.role}
              </h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
