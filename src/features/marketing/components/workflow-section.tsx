import { SectionHeading } from "./section-heading";

const STEPS = [
  {
    step: "01",
    title: "Plan your day",
    description:
      "Open today's worksheet and lay out what matters. Link tasks to projects, set priorities and estimates in seconds.",
  },
  {
    step: "02",
    title: "Track as you work",
    description:
      "Start a timer on any task. Business OS quietly records where your hours go — no stopwatch juggling.",
  },
  {
    step: "03",
    title: "Review and improve",
    description:
      "Watch progress, goals and earnings update automatically. Analytics turns your effort into insight.",
  },
];

/** Three-step "how it works" band. */
export function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="border-border scroll-mt-20 border-t py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="How it works"
          title="A calm loop: plan, track, reflect"
          description="Business OS is designed around the rhythm of real work, not busywork."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="text-primary/40 text-4xl font-semibold tabular-nums">
                {item.step}
              </span>
              <h3 className="text-foreground text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
