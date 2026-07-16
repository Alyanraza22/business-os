import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TimeIntelligenceProps {
  deepWorkHours: number;
  deepWorkShare: number;
  contextSwitches: number;
  fragmentedSessions: number;
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-[0.7rem] tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground text-xl font-semibold tracking-tight tabular-nums">
        {value}
      </span>
      <span className="text-muted-foreground/70 text-xs">{hint}</span>
    </div>
  );
}

/** How focused this week actually was — not just how many hours it held. */
export function TimeIntelligence({
  deepWorkHours,
  deepWorkShare,
  contextSwitches,
  fragmentedSessions,
}: TimeIntelligenceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus quality</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground text-[0.7rem] tracking-wider uppercase">
              Deep work
            </span>
            <span className="text-muted-foreground text-xs tabular-nums">
              {deepWorkShare}% of this week
            </span>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-foreground text-2xl font-semibold tracking-tight tabular-nums">
              {deepWorkHours}h
            </span>
            <span className="text-muted-foreground mb-0.5 text-xs">
              in sessions of 25m+
            </span>
          </div>
          <Progress value={deepWorkShare} />
        </div>

        <div className="border-border grid grid-cols-2 gap-4 border-t pt-4">
          <Stat
            label="Context switches"
            value={contextSwitches}
            hint="project changes this week"
          />
          <Stat
            label="Fragmented"
            value={fragmentedSessions}
            hint="sessions under 5m"
          />
        </div>
      </CardContent>
    </Card>
  );
}
