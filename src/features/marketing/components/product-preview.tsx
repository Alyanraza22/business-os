import {
  BarChart3,
  CalendarRange,
  FolderKanban,
  LayoutDashboard,
  Target,
  Timer,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Projects", icon: FolderKanban, active: false },
  { label: "Daily Planner", icon: CalendarRange, active: false },
  { label: "Time Tracker", icon: Timer, active: false },
  { label: "Goals", icon: Target, active: false },
  { label: "Analytics", icon: BarChart3, active: false },
];

const STATS = [
  { label: "Today", value: "4.5h" },
  { label: "This week", value: "21h" },
  { label: "Active projects", value: "3" },
  { label: "This month", value: "$1,200" },
];

const BARS = [40, 65, 52, 80, 70, 35, 48];

const PROJECTS = [
  { name: "Business OS", pct: 68, tone: "var(--primary)" },
  { name: "Etsy Store", pct: 12, tone: "var(--success)" },
  { name: "Portfolio", pct: 40, tone: "var(--muted-foreground)" },
];

/**
 * Static, non-interactive dashboard mock used as the landing centerpiece.
 * Decorative only — hidden from assistive tech.
 */
export function ProductPreview() {
  return (
    <div
      aria-hidden
      className="border-border bg-card rounded-t-xl border border-b-0 p-2 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.55)] select-none sm:p-3"
    >
      <div className="border-border bg-background overflow-hidden rounded-lg border">
        {/* window chrome */}
        <div className="border-border flex items-center gap-1.5 border-b px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>

        <div className="flex min-h-[320px]">
          {/* sidebar */}
          <div className="border-border hidden w-44 shrink-0 flex-col gap-1 border-r p-3 sm:flex">
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md text-xs font-bold">
                B
              </span>
              <span className="text-sm font-semibold tracking-tight">
                Business OS
              </span>
            </div>
            {NAV.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium ${
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </div>
            ))}
          </div>

          {/* content */}
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="mb-4 h-4 w-28 rounded bg-white/5" />

            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="border-border bg-card rounded-lg border p-3"
                >
                  <div className="text-muted-foreground text-[0.65rem] tracking-wider uppercase">
                    {stat.label}
                  </div>
                  <div className="text-foreground mt-1 text-lg font-semibold tabular-nums">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-5">
              <div className="border-border bg-card rounded-lg border p-4 lg:col-span-3">
                <div className="text-foreground mb-3 text-xs font-semibold">
                  Hours this week
                </div>
                <div className="flex h-24 items-end gap-2">
                  {BARS.map((h, i) => (
                    <div
                      key={i}
                      className="bg-primary/90 flex-1 rounded-t-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="border-border bg-card rounded-lg border p-4 lg:col-span-2">
                <div className="text-foreground mb-3 text-xs font-semibold">
                  Active projects
                </div>
                <div className="flex flex-col gap-3">
                  {PROJECTS.map((project) => (
                    <div key={project.name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground">{project.name}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {project.pct}%
                        </span>
                      </div>
                      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${project.pct}%`,
                            backgroundColor: project.tone,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
