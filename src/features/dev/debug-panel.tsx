"use client";

import {
  Copy,
  Database,
  Download,
  RefreshCw,
  Terminal,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  APP_VERSION,
  BUILD_TIME,
  ENVIRONMENT,
  FEATURE_FLAGS,
} from "@/config/app";
import { createClient } from "@/lib/supabase/client";

/** Server-provided, non-sensitive identity for the panel. */
export interface DebugServerInfo {
  userId: string;
  email: string;
  name: string;
  providers: string[];
}

interface RecentError {
  message: string;
  at: string;
}

// Module-level ring buffer of recent client errors (development only).
const recentErrors: RecentError[] = [];
let listenersAttached = false;

function attachErrorListeners() {
  if (listenersAttached || typeof window === "undefined") return;
  listenersAttached = true;
  const push = (message: string) => {
    recentErrors.unshift({ message, at: new Date().toISOString() });
    recentErrors.splice(10);
  };
  window.addEventListener("error", (event) => push(event.message));
  window.addEventListener("unhandledrejection", (event) =>
    push(String(event.reason)),
  );
}

interface Diagnostics {
  health: { ok: boolean; ms: number; error?: string } | null;
  session: { status: string; expiresAt?: string } | null;
  perf: {
    ttfb?: number;
    domContentLoaded?: number;
    load?: number;
    memoryMB?: number;
  };
  caches: string[];
  local: { count: number; bytes: number; keys: string[] };
  session_storage: { count: number; bytes: number; keys: string[] };
  online: boolean;
}

function storageOverview(storage: Storage) {
  const keys = Object.keys(storage);
  let bytes = 0;
  for (const key of keys)
    bytes += (storage.getItem(key)?.length ?? 0) + key.length;
  return { count: keys.length, bytes, keys };
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-xs">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-foreground truncate text-right font-mono">
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-[0.7rem] font-semibold tracking-wider uppercase">
        {title}
      </p>
      <div className="border-border bg-card rounded-lg border px-3 py-1.5">
        {children}
      </div>
    </div>
  );
}

export function DebugPanel({ serverInfo }: { serverInfo: DebugServerInfo }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [diag, setDiag] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => attachErrorListeners(), []);

  const collect = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let health: Diagnostics["health"] = null;
    try {
      const start = performance.now();
      const { error } = await supabase
        .from("profiles")
        .select("id", { head: true, count: "exact" });
      health = {
        ok: !error,
        ms: Math.round(performance.now() - start),
        error: error?.message,
      };
    } catch (error) {
      health = { ok: false, ms: 0, error: String(error) };
    }

    let session: Diagnostics["session"] = null;
    try {
      const { data } = await supabase.auth.getSession();
      session = {
        status: data.session ? "active" : "none",
        expiresAt: data.session?.expires_at
          ? new Date(data.session.expires_at * 1000).toLocaleString()
          : undefined,
      };
    } catch {
      session = { status: "error" };
    }

    const nav = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    const memory = (
      performance as Performance & { memory?: { usedJSHeapSize: number } }
    ).memory;
    const perf = {
      ttfb: nav ? Math.round(nav.responseStart) : undefined,
      domContentLoaded: nav
        ? Math.round(nav.domContentLoadedEventEnd)
        : undefined,
      load: nav ? Math.round(nav.loadEventEnd) : undefined,
      memoryMB: memory
        ? Math.round(memory.usedJSHeapSize / 1_048_576)
        : undefined,
    };

    let cacheNames: string[] = [];
    try {
      if (typeof caches !== "undefined") cacheNames = await caches.keys();
    } catch {
      cacheNames = [];
    }

    setDiag({
      health,
      session,
      perf,
      caches: cacheNames,
      local: storageOverview(window.localStorage),
      session_storage: storageOverview(window.sessionStorage),
      online: navigator.onLine,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => void collect());
    return () => cancelAnimationFrame(id);
  }, [open, collect]);

  function buildDiagnostics() {
    return {
      app: {
        version: APP_VERSION,
        build: BUILD_TIME,
        environment: ENVIRONMENT,
      },
      route: pathname,
      user: serverInfo,
      featureFlags: FEATURE_FLAGS,
      diagnostics: diag,
      recentErrors,
      generatedAt: new Date().toISOString(),
    };
  }

  async function copyDiagnostics() {
    await navigator.clipboard.writeText(
      JSON.stringify(buildDiagnostics(), null, 2),
    );
    toast.success("Diagnostics copied");
  }

  function exportLogs() {
    const blob = new Blob([JSON.stringify(buildDiagnostics(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `business-os-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Debug logs exported");
  }

  async function clearCaches() {
    if (typeof caches !== "undefined") {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    }
    toast.success("Application cache cleared");
    void collect();
  }

  async function refreshSession() {
    const { error } = await createClient().auth.refreshSession();
    toast[error ? "error" : "success"](
      error ? error.message : "Session refreshed",
    );
    void collect();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-label="Open developer panel"
          className="bg-card fixed right-4 bottom-4 z-50 size-10 rounded-full shadow-md"
        >
          <Terminal className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md"
      >
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Terminal className="text-primary size-4" />
            Developer panel
          </SheetTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void collect()}
            loading={loading}
          >
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <Section title="Application">
            <Row label="Version" value={`v${APP_VERSION}`} />
            <Row label="Environment" value={ENVIRONMENT} />
            <Row label="Build" value={BUILD_TIME} />
            <Row label="Route" value={pathname} />
            <Row label="Online" value={diag?.online ? "yes" : "no"} />
          </Section>

          <Section title="User & workspace">
            <Row label="User ID" value={serverInfo.userId} />
            <Row label="Workspace" value={serverInfo.userId} />
            <Row label="Email" value={serverInfo.email} />
            <Row
              label="Providers"
              value={serverInfo.providers.join(", ") || "—"}
            />
          </Section>

          <Section title="Supabase">
            <Row
              label="DB health"
              value={
                diag?.health
                  ? diag.health.ok
                    ? `ok · ${diag.health.ms}ms`
                    : `error: ${diag.health.error ?? "unknown"}`
                  : "…"
              }
            />
            <Row label="Session" value={diag?.session?.status ?? "…"} />
            <Row label="Expires" value={diag?.session?.expiresAt ?? "—"} />
          </Section>

          <Section title="Performance">
            <Row
              label="TTFB"
              value={diag?.perf.ttfb ? `${diag.perf.ttfb}ms` : "—"}
            />
            <Row
              label="DOM ready"
              value={
                diag?.perf.domContentLoaded
                  ? `${diag.perf.domContentLoaded}ms`
                  : "—"
              }
            />
            <Row
              label="Load"
              value={diag?.perf.load ? `${diag.perf.load}ms` : "—"}
            />
            <Row
              label="JS heap"
              value={diag?.perf.memoryMB ? `${diag.perf.memoryMB}MB` : "n/a"}
            />
          </Section>

          <Section title="Feature flags">
            {Object.keys(FEATURE_FLAGS).length === 0 ? (
              <Row label="—" value="none" />
            ) : (
              Object.entries(FEATURE_FLAGS).map(([flag, enabled]) => (
                <Row key={flag} label={flag} value={enabled ? "on" : "off"} />
              ))
            )}
          </Section>

          <Section title="Storage & cache">
            <Row
              label="localStorage"
              value={`${diag?.local.count ?? 0} keys · ${Math.round((diag?.local.bytes ?? 0) / 1024)}KB`}
            />
            <Row
              label="sessionStorage"
              value={`${diag?.session_storage.count ?? 0} keys · ${Math.round((diag?.session_storage.bytes ?? 0) / 1024)}KB`}
            />
            <Row
              label="Caches"
              value={diag?.caches.length ? diag.caches.join(", ") : "none"}
            />
          </Section>

          <Section title="Recent client errors">
            {recentErrors.length === 0 ? (
              <Row label="—" value="none" />
            ) : (
              recentErrors.map((error, index) => (
                <p
                  key={index}
                  className="text-destructive truncate py-0.5 font-mono text-xs"
                  title={error.message}
                >
                  {error.message}
                </p>
              ))
            )}
          </Section>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => void refreshSession()}
            >
              <RefreshCw className="size-3.5" />
              Refresh session
            </Button>
            <Button size="sm" variant="outline" onClick={() => void collect()}>
              <Database className="size-3.5" />
              Test database
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void clearCaches()}
            >
              <Trash2 className="size-3.5" />
              Clear caches
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                window.localStorage.clear();
                toast.success("localStorage cleared");
                void collect();
              }}
            >
              <Trash2 className="size-3.5" />
              Clear local
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                window.sessionStorage.clear();
                toast.success("sessionStorage cleared");
                void collect();
              }}
            >
              <Trash2 className="size-3.5" />
              Clear session
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.refresh()}
            >
              <RefreshCw className="size-3.5" />
              Reload state
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void copyDiagnostics()}
            >
              <Copy className="size-3.5" />
              Copy diagnostics
            </Button>
            <Button size="sm" variant="outline" onClick={exportLogs}>
              <Download className="size-3.5" />
              Export logs
            </Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() =>
              toast.info("Reset demo data: wire a dev-only seed script here.")
            }
          >
            <Database className="size-3.5" />
            Reset demo data (dev)
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
