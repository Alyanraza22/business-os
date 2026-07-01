import { History } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { Card } from "@/components/ui/card";

import type { TimeSession } from "../types";
import { SessionRow } from "./session-row";

export function SessionsList({ sessions }: { sessions: TimeSession[] }) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No time tracked yet"
        description="Start a timer from a task in the Daily Planner and your sessions will appear here."
      />
    );
  }

  return (
    <Card className="divide-border divide-y overflow-hidden">
      {sessions.map((session) => (
        <SessionRow key={session.id} session={session} />
      ))}
    </Card>
  );
}
