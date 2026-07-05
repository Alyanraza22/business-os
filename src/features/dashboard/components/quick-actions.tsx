"use client";

import { FolderPlus, ListPlus, Play, StickyNote, Target } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GoalDialog } from "@/features/goals/components/goal-dialog";
import { NoteDialog } from "@/features/notes/components/note-dialog";
import { ProjectDialog } from "@/features/projects/components/project-dialog";

/**
 * Fast entry points that reduce navigation. Create dialogs open in place;
 * task/timer actions jump to the Daily Planner where they live.
 */
export function QuickActions() {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <ProjectDialog
        trigger={
          <Button variant="outline" size="sm">
            <FolderPlus />
            New project
          </Button>
        }
      />
      <Button variant="outline" size="sm" asChild>
        <Link href="/tasks">
          <ListPlus />
          New task
        </Link>
      </Button>
      <GoalDialog
        trigger={
          <Button variant="outline" size="sm">
            <Target />
            New goal
          </Button>
        }
      />
      <NoteDialog
        trigger={
          <Button variant="outline" size="sm">
            <StickyNote />
            New note
          </Button>
        }
      />
      <Button variant="outline" size="sm" asChild>
        <Link href="/tasks">
          <Play />
          Start timer
        </Link>
      </Button>
    </div>
  );
}
