import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TimelineBlock } from "../types";

const HOUR_MARKS = ["12am", "6am", "12pm", "6pm", "12am"];

/** Today's completed sessions laid out across a 24-hour track. */
export function TodaysTimeline({ blocks }: { blocks: TimelineBlock[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {blocks.length === 0 ? (
          <p className="text-muted-foreground py-2 text-sm">
            No sessions tracked today yet. Start a timer from the Daily Planner.
          </p>
        ) : (
          <div>
            <div className="bg-muted relative h-9 overflow-hidden rounded-md">
              {blocks.map((block, index) => (
                <div
                  key={index}
                  title={block.title ?? "Session"}
                  className="absolute top-0 h-full rounded-[3px]"
                  style={{
                    left: `${block.startPct}%`,
                    width: `${Math.max(0.6, block.endPct - block.startPct)}%`,
                    backgroundColor: block.color ?? "var(--primary)",
                  }}
                />
              ))}
            </div>
            <div className="text-muted-foreground mt-1.5 flex justify-between text-[0.65rem] tabular-nums">
              {HOUR_MARKS.map((mark) => (
                <span key={mark}>{mark}</span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
