import { ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessHealthCard } from "@/features/health/components/business-health-card";
import { formatMoney } from "@/lib/format";

import type { DailyReview, WeeklyReview } from "../queries";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-[0.7rem] tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground truncate text-xl font-semibold tracking-tight tabular-nums">
        {value}
      </span>
    </div>
  );
}

/** End-of-day debrief: what got done, what didn't, what to do about it. */
export function DailyReviewSection({ review }: { review: DailyReview }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat
            label="Completed"
            value={`${review.completed}/${review.planned}`}
          />
          <Stat label="Still open" value={review.missed} />
          <Stat label="Hours" value={`${review.hours}h`} />
          <Stat label="Carried over" value={review.carriedOver} />
        </div>

        {review.topProject ? (
          <p className="text-muted-foreground text-sm">
            Most of your attention went to{" "}
            <span className="text-foreground font-medium">
              {review.topProject}
            </span>
            .
          </p>
        ) : null}

        <div className="border-border flex flex-col gap-2 border-t pt-4">
          <span className="text-muted-foreground flex items-center gap-1.5 text-[0.7rem] font-medium tracking-wider uppercase">
            <Lightbulb className="size-3.5" />
            Suggestions
          </span>
          <ul className="flex flex-col gap-1.5">
            {review.suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

/** The weekly CEO read: output, money, focus and what's next. */
export function WeeklyReviewSection({ review }: { review: WeeklyReview }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>This week</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Hours" value={`${review.hours}h`} />
            <Stat
              label="Revenue"
              value={formatMoney(review.revenue, review.currency)}
            />
            <Stat label="Tasks done" value={review.completedTasks} />
            <Stat label="Deep work" value={`${review.deepWorkShare}%`} />
          </div>

          <div className="border-border flex flex-col gap-2 border-t pt-4 text-sm">
            {review.topProject ? (
              <p className="text-muted-foreground">
                Most active project:{" "}
                <span className="text-foreground font-medium">
                  {review.topProject}
                </span>
              </p>
            ) : null}
            {review.bestPaying ? (
              <p className="text-muted-foreground">
                Best paying work:{" "}
                <span className="text-foreground font-medium">
                  {review.bestPaying.name}
                </span>{" "}
                at{" "}
                <span className="text-success font-medium tabular-nums">
                  {formatMoney(review.bestPaying.rate, review.currency)}/h
                </span>
              </p>
            ) : null}
            {review.worstPaying ? (
              <p className="text-muted-foreground">
                Lowest return:{" "}
                <span className="text-foreground font-medium">
                  {review.worstPaying.name}
                </span>{" "}
                at{" "}
                <span className="text-warning font-medium tabular-nums">
                  {formatMoney(review.worstPaying.rate, review.currency)}/h
                </span>{" "}
                — worth repricing or dropping.
              </p>
            ) : null}
            <p className="text-muted-foreground">
              You switched projects{" "}
              <span className="text-foreground font-medium tabular-nums">
                {review.contextSwitches}
              </span>{" "}
              times between sessions.
            </p>
          </div>

          {review.priorities.length > 0 ? (
            <div className="border-border flex flex-col gap-2 border-t pt-4">
              <span className="text-muted-foreground text-[0.7rem] font-medium tracking-wider uppercase">
                Next up
              </span>
              <ul className="flex flex-col gap-1.5">
                {review.priorities.map((priority) => (
                  <li
                    key={priority}
                    className="text-foreground flex items-center gap-2 text-sm"
                  >
                    <ArrowRight className="text-muted-foreground size-3.5 shrink-0" />
                    {priority}
                  </li>
                ))}
              </ul>
              <Link
                href="/focus"
                className="text-primary mt-1 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Start focusing
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <BusinessHealthCard health={review.health} />
    </div>
  );
}
