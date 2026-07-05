"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { CommandPalette } from "@/features/search/command-palette";

/** Topbar search field that opens the command palette (Cmd/Ctrl+K or "/"). */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (event.key === "/") {
        const target = event.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.tagName === "SELECT" ||
            target.isContentEditable)
        ) {
          return;
        }
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="border-input text-muted-foreground hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/25 flex h-9 items-center gap-2 rounded-md border bg-transparent px-2.5 text-sm transition-colors outline-none focus-visible:ring-[3px] md:w-64 md:px-3"
      >
        <Search className="size-4 shrink-0" />
        <span className="hidden flex-1 text-left md:inline">Search…</span>
        <kbd className="bg-muted text-muted-foreground hidden rounded px-1.5 py-0.5 font-sans text-[0.7rem] md:inline">
          ⌘K
        </kbd>
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
