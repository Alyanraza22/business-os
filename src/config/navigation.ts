import {
  BarChart3,
  CalendarRange,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  Notebook,
  Settings,
  Target,
  Timer,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  /** Display label in the sidebar. */
  label: string;
  /** App route. */
  href: string;
  /** Lucide icon component. */
  icon: LucideIcon;
}

/**
 * Primary dashboard sidebar navigation, in display order.
 * Mirrors the module list defined in project.md §18.
 */
export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Daily Planner", href: "/tasks", icon: CalendarRange },
  { label: "Time Tracker", href: "/time", icon: Timer },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Earnings", href: "/earnings", icon: Wallet },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Review", href: "/review", icon: ClipboardCheck },
  { label: "Notes", href: "/notes", icon: Notebook },
];

export const secondaryNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];
