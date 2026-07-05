import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-[0.7rem] tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground text-xl font-semibold tracking-tight tabular-nums">
        {value}
      </span>
    </div>
  );
}

interface SessionInsightsProps {
  longestSeconds: number;
  averageSeconds: number;
  sessionCount: number;
}

/** Longest / average / total session summary. */
export function SessionInsights({
  longestSeconds,
  averageSeconds,
  sessionCount,
}: SessionInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session insights</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <Stat label="Longest" value={formatDuration(longestSeconds)} />
        <Stat label="Average" value={formatDuration(averageSeconds)} />
        <Stat label="Sessions" value={sessionCount} />
      </CardContent>
    </Card>
  );
}
