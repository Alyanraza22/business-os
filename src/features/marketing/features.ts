import {
  BarChart3,
  CalendarRange,
  FolderKanban,
  Notebook,
  Target,
  Timer,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface FeatureHighlight {
  title: string;
  description: string;
}

export interface MarketingFeature {
  slug: string;
  name: string;
  /** Short one-liner used on cards and as the meta description base. */
  tagline: string;
  /** Longer intro used in the feature page hero. */
  overview: string;
  icon: LucideIcon;
  highlights: FeatureHighlight[];
  keywords: string[];
}

/**
 * Single source of truth for the product modules. Consumed by the landing
 * feature grid and the /features index + /features/[slug] SEO pages.
 */
export const marketingFeatures: MarketingFeature[] = [
  {
    slug: "projects",
    name: "Projects",
    tagline:
      "Organize everything you're building, with progress that reflects real work.",
    overview:
      "Give every initiative a home. Break work into deliverables, and let completion drive project progress automatically — no manual percentages to keep honest.",
    icon: FolderKanban,
    keywords: ["project management", "deliverables", "project tracking"],
    highlights: [
      {
        title: "Deliverable-driven progress",
        description:
          "Progress is computed from completed project tasks, so the number is always true.",
      },
      {
        title: "A workspace per project",
        description:
          "Each project gets its own space for tasks, notes and activity in one place.",
      },
      {
        title: "Priorities and deadlines",
        description:
          "Set status, priority and a due date, and see it all at a glance on the board.",
      },
    ],
  },
  {
    slug: "daily-planner",
    name: "Daily Planner",
    tagline: "A spreadsheet-fast worksheet for every single day.",
    overview:
      "Plan your day the way you think. Each date is its own sheet — add tasks, edit inline, link them to projects, and check things off without leaving the keyboard.",
    icon: CalendarRange,
    keywords: ["daily planner", "task management", "to-do list"],
    highlights: [
      {
        title: "One sheet per day",
        description:
          "Navigate day by day. Yesterday stays put; today is a clean slate.",
      },
      {
        title: "Inline everything",
        description:
          "Edit titles, estimates, status and notes directly in the grid — Enter saves.",
      },
      {
        title: "Connected to your work",
        description:
          "Link a row to a project or project task so time and progress roll up.",
      },
    ],
  },
  {
    slug: "time-tracker",
    name: "Time Tracker",
    tagline: "Start a timer on any task and watch your hours roll up.",
    overview:
      "Track where your time actually goes. Start a timer from a task, and Business OS totals your focus time across the day, week and month — automatically.",
    icon: Timer,
    keywords: ["time tracking", "timer", "productivity"],
    highlights: [
      {
        title: "One-click timers",
        description:
          "Start and stop from the task itself. Only one timer runs at a time.",
      },
      {
        title: "Live, accurate totals",
        description:
          "Elapsed time ticks live and is stored per task for exact reporting.",
      },
      {
        title: "Rolls into analytics",
        description:
          "Every session feeds hours-by-day and hours-by-project insights.",
      },
    ],
  },
  {
    slug: "goals",
    name: "Goals",
    tagline: "Set targets, log progress, and watch the bar fill.",
    overview:
      "Turn intentions into measurable outcomes. Track numeric targets or milestones, update your progress, and keep momentum visible.",
    icon: Target,
    keywords: ["goal tracking", "objectives", "targets"],
    highlights: [
      {
        title: "Numeric or milestone",
        description:
          "Track a number toward a target, or complete goals as milestones.",
      },
      {
        title: "Progress at a glance",
        description: "A clear percentage bar shows exactly how close you are.",
      },
      {
        title: "Deadlines that matter",
        description:
          "Add a target date and keep your goals honest and time-bound.",
      },
    ],
  },
  {
    slug: "earnings",
    name: "Earnings",
    tagline: "Track income by source and category, in any currency.",
    overview:
      "Keep a clean record of what you earn. Log income by source and category with currency-aware totals that feed straight into your analytics.",
    icon: Wallet,
    keywords: ["income tracking", "earnings", "freelance finance"],
    highlights: [
      {
        title: "Source and category",
        description:
          "Attribute every entry so you understand where your income comes from.",
      },
      {
        title: "Currency-aware",
        description:
          "Amounts respect your preferred currency across the whole app.",
      },
      {
        title: "Revenue trends",
        description: "Monthly revenue is charted automatically in analytics.",
      },
    ],
  },
  {
    slug: "notes",
    name: "Notes",
    tagline: "Capture ideas fast, then find them instantly.",
    overview:
      "A quiet place for thinking. Jot notes, pin what matters, archive the rest, and search across everything with full-text search.",
    icon: Notebook,
    keywords: ["notes", "note taking", "knowledge"],
    highlights: [
      {
        title: "Pin and archive",
        description: "Keep important notes on top and tuck finished ones away.",
      },
      {
        title: "Full-text search",
        description:
          "Find any note by its content in an instant, no folders required.",
      },
      {
        title: "Distraction-free",
        description: "A calm editor that stays out of the way while you think.",
      },
    ],
  },
  {
    slug: "analytics",
    name: "Analytics",
    tagline: "See the trends behind your hours, tasks and revenue.",
    overview:
      "Turn effort into insight. Analytics visualizes your hours over time, hours by project, revenue by month, and lifetime totals — all from data you already track.",
    icon: BarChart3,
    keywords: ["analytics", "productivity insights", "reporting"],
    highlights: [
      {
        title: "Hours over time",
        description:
          "Spot your patterns with daily and weekly hour breakdowns.",
      },
      {
        title: "By project",
        description: "See exactly which projects are consuming your time.",
      },
      {
        title: "Revenue and lifetime stats",
        description: "Track monthly revenue and lifetime totals in one view.",
      },
    ],
  },
];

export function getFeature(slug: string): MarketingFeature | undefined {
  return marketingFeatures.find((feature) => feature.slug === slug);
}
