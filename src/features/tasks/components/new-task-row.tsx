"use client";

import { Plus } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { createWorksheetTask } from "../actions";
import type { ProjectOption } from "../types";

const CELL_INPUT =
  "h-9 w-full rounded-md border border-transparent bg-transparent px-2 text-sm outline-none transition-colors hover:border-border focus:border-ring focus:bg-background";

const NONE = "none";

interface NewTaskRowProps {
  projects: ProjectOption[];
  date: string;
  defaultProjectId: string;
  fillColumns: number;
}

export function NewTaskRow({
  projects,
  date,
  defaultProjectId,
  fillColumns,
}: NewTaskRowProps) {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId || NONE);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function create() {
    const trimmed = title.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const result = await createWorksheetTask({
        title: trimmed,
        project_id: projectId === NONE ? null : projectId,
        work_date: date,
      });
      if (result.ok) {
        setTitle("");
        inputRef.current?.focus();
      } else {
        toast.error(result.message ?? "Could not create task");
      }
    });
  }

  return (
    <tr className="bg-muted/30">
      <td className="text-muted-foreground px-2">
        <Plus className="size-4" />
      </td>
      <td className="px-1">
        <input
          ref={inputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              create();
            }
          }}
          placeholder="Add a task and press Enter…"
          disabled={pending}
          className={cn(CELL_INPUT, "placeholder:text-muted-foreground")}
          aria-label="New task name"
        />
      </td>
      <td className="px-1">
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger
            className="hover:border-border h-9 w-full gap-1 border-transparent bg-transparent px-2 shadow-none"
            aria-label="Project for new task"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>No project</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td colSpan={fillColumns} />
    </tr>
  );
}
