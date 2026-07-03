import { SectionHeading } from "./section-heading";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

/**
 * Illustrative testimonials. These are example use-case statements, not
 * verified customer reviews — the section is a template to be filled with
 * real quotes as Business OS grows.
 */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Having my projects, hours and income in one place changed how I plan my week. I finally trust the numbers I'm looking at.",
    name: "Independent freelancer",
    role: "Design & web",
    initials: "IF",
  },
  {
    quote:
      "The daily planner is the fastest way I've found to lay out a day. It feels like a spreadsheet that actually understands my work.",
    name: "Solo developer",
    role: "Product engineering",
    initials: "SD",
  },
  {
    quote:
      "Progress that comes from real deliverables — not a slider I drag — is exactly what I wanted. Everything just stays honest.",
    name: "Studio founder",
    role: "Creative agency",
    initials: "SF",
  },
];

/** Illustrative testimonials placeholder, ready for real quotes. */
export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="What people say"
          title="Made for focused, self-directed work"
          description="Illustrative examples of how Business OS fits into a working day."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="border-border bg-card flex flex-col rounded-xl border p-6"
            >
              <blockquote className="text-foreground flex-1 leading-relaxed">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full text-xs font-semibold">
                  {testimonial.initials}
                </span>
                <span className="flex flex-col">
                  <span className="text-foreground text-sm font-medium">
                    {testimonial.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="text-muted-foreground/70 mt-8 text-center text-xs">
          Illustrative examples. Real customer stories will appear here as
          Business OS grows.
        </p>
      </div>
    </section>
  );
}
