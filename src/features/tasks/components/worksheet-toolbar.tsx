"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_META } from "@/features/shared/constants";
import { PRIORITIES, VISIBLE_TASK_STATUSES } from "@/lib/enums";

import { TASK_STATUS_META } from "../constants";
import type { ProjectOption } from "../types";

interface WorksheetToolbarProps {
  projects: ProjectOption[];
}

export function WorksheetToolbar({ projects }: WorksheetToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    const queryString = params.toString();
    startTransition(() =>
      router.replace(queryString ? `${pathname}?${queryString}` : pathname),
    );
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      pushParams((params) => {
        if (query) params.set("q", query);
        else params.delete("q");
      });
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function filterSetter(key: string) {
    return (value: string) =>
      pushParams((params) => {
        if (value === "all") params.delete(key);
        else params.set(key, value);
      });
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="relative w-full max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search this day…"
          className="pl-8"
          aria-label="Search tasks"
        />
      </div>

      <Select
        defaultValue={searchParams.get("project") ?? "all"}
        onValueChange={filterSetter("project")}
      >
        <SelectTrigger className="w-40" aria-label="Filter by project">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={filterSetter("status")}
      >
        <SelectTrigger className="w-36" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {VISIBLE_TASK_STATUSES.map((value) => (
            <SelectItem key={value} value={value}>
              {TASK_STATUS_META[value].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("priority") ?? "all"}
        onValueChange={filterSetter("priority")}
      >
        <SelectTrigger className="w-32" aria-label="Filter by priority">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {PRIORITIES.map((value) => (
            <SelectItem key={value} value={value}>
              {PRIORITY_META[value].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("sort") ?? "created"}
        onValueChange={(value) =>
          pushParams((params) => {
            if (value === "created") params.delete("sort");
            else params.set("sort", value);
          })
        }
      >
        <SelectTrigger className="w-36" aria-label="Sort by">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created">Order added</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
