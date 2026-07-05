"use client";

import {
  CalendarRange,
  FolderKanban,
  Notebook,
  Search,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { primaryNav, secondaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

import { globalSearch } from "./actions";
import type { SearchResult, SearchResultType } from "./types";

const TYPE_META: Record<SearchResultType, { icon: LucideIcon; label: string }> =
  {
    project: { icon: FolderKanban, label: "Project" },
    task: { icon: CalendarRange, label: "Task" },
    goal: { icon: Target, label: "Goal" },
    note: { icon: Notebook, label: "Note" },
    earning: { icon: Wallet, label: "Earning" },
  };

interface Item {
  key: string;
  label: string;
  sublabel?: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: Item[] = [...primaryNav, ...secondaryNav].map((item) => ({
  key: item.href,
  label: `Go to ${item.label}`,
  href: item.href,
  icon: item.icon,
}));

function toItem(result: SearchResult): Item {
  const meta = TYPE_META[result.type];
  return {
    key: `${result.type}-${result.id}`,
    label: result.title,
    sublabel: result.subtitle ?? meta.label,
    href: result.href,
    icon: meta.icon,
  };
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [active, setActive] = useState(0);
  const [pending, startTransition] = useTransition();

  // Reset when the palette opens (deferred to avoid setState in render/effect).
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      setQuery("");
      setResults([]);
      setActive(0);
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Debounced search on query changes. When the query is empty we simply show
  // the nav items (derived below), so there's no state to clear here.
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const handle = setTimeout(() => {
      startTransition(async () => {
        setResults(await globalSearch(q));
        setActive(0);
      });
    }, 180);
    return () => clearTimeout(handle);
  }, [query]);

  const items: Item[] = query.trim() ? results.map(toItem) : NAV_ITEMS;

  function select(item: Item | undefined) {
    if (!item) return;
    onOpenChange(false);
    router.push(item.href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(items[active]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[15%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Search Business OS</DialogTitle>
        <div className="border-border flex items-center gap-2 border-b px-4">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search projects, tasks, goals, notes…"
            className="text-foreground placeholder:text-muted-foreground h-12 w-full bg-transparent pr-8 text-sm outline-none"
            aria-label="Search"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {!query.trim() ? (
            <p className="text-muted-foreground px-2 pt-1 pb-2 text-[0.7rem] font-semibold tracking-wider uppercase">
              Jump to
            </p>
          ) : null}

          {items.length === 0 ? (
            <p className="text-muted-foreground px-2 py-6 text-center text-sm">
              {pending ? "Searching…" : "No results found."}
            </p>
          ) : (
            <ul>
              {items.map((item, index) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => select(item)}
                    onMouseMove={() => setActive(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors",
                      index === active
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground",
                    )}
                  >
                    <item.icon className="text-muted-foreground size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>
                    {item.sublabel ? (
                      <span className="text-muted-foreground shrink-0 text-xs">
                        {item.sublabel}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
