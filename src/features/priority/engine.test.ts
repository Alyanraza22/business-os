import { describe, expect, it } from "vitest";

import { rankTasks, scoreTask, type PriorityTaskInput } from "./engine";

const TODAY = "2026-07-16";

function task(overrides: Partial<PriorityTaskInput> = {}): PriorityTaskInput {
  return {
    id: "t1",
    title: "Task",
    priority: "medium",
    status: "todo",
    workDate: TODAY,
    dueDate: null,
    estimatedHours: null,
    projectName: null,
    projectDeadline: null,
    projectPriority: null,
    ...overrides,
  };
}

describe("scoreTask", () => {
  it("scores a plain task on its priority alone", () => {
    expect(scoreTask(task({ priority: "low" }), TODAY).score).toBe(0);
    expect(scoreTask(task({ priority: "medium" }), TODAY).score).toBe(10);
  });

  it("ranks an overdue task above a merely urgent one", () => {
    const overdue = scoreTask(task({ dueDate: "2026-07-10" }), TODAY);
    const urgent = scoreTask(task({ priority: "urgent" }), TODAY);
    expect(overdue.score).toBeGreaterThan(urgent.score);
    expect(overdue.reasons).toContain("Overdue by 6d");
  });

  it("boosts work carried over from previous days", () => {
    const carried = scoreTask(task({ workDate: "2026-07-15" }), TODAY);
    expect(carried.score).toBeGreaterThan(scoreTask(task(), TODAY).score);
    expect(carried.reasons).toContain("Carried over from yesterday");
  });

  it("caps how far lateness can inflate the score", () => {
    const veryLate = scoreTask(task({ workDate: "2025-01-01" }), TODAY);
    const weekLate = scoreTask(task({ workDate: "2026-07-09" }), TODAY);
    // Both hit the +20 cap, so they only differ by the shared base.
    expect(veryLate.score).toBe(weekLate.score);
  });

  it("rewards finishing work already in progress", () => {
    const active = scoreTask(task({ status: "in_progress" }), TODAY);
    expect(active.score - scoreTask(task(), TODAY).score).toBe(15);
    expect(active.reasons).toContain("Already in progress");
  });

  it("factors in project deadline pressure and names the project", () => {
    const scored = scoreTask(
      task({ projectName: "Rank and Rent", projectDeadline: "2026-07-17" }),
      TODAY,
    );
    expect(scored.reasons).toContain("Rank and Rent due in 1d");
  });

  it("treats short tasks as quick wins", () => {
    expect(scoreTask(task({ estimatedHours: 0.5 }), TODAY).reasons).toContain(
      "Quick win",
    );
    expect(scoreTask(task({ estimatedHours: 4 }), TODAY).reasons).not.toContain(
      "Quick win",
    );
  });
});

describe("rankTasks", () => {
  it("returns the highest-value task first", () => {
    const ranked = rankTasks(
      [
        task({ id: "low", priority: "low" }),
        task({ id: "overdue", dueDate: "2026-07-01" }),
        task({ id: "urgent", priority: "urgent" }),
      ],
      TODAY,
    );
    expect(ranked[0]?.id).toBe("overdue");
    expect(ranked.at(-1)?.id).toBe("low");
  });
});
