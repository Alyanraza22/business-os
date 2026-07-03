export type RoadmapStatus = "shipped" | "in-progress" | "planned";

export interface RoadmapItem {
  title: string;
  description: string;
  status: RoadmapStatus;
}

export const ROADMAP: RoadmapItem[] = [
  {
    title: "Core modules",
    description:
      "Projects, Daily Planner, Time Tracker, Goals, Earnings, Notes and Analytics — the full workspace.",
    status: "shipped",
  },
  {
    title: "Premium redesign",
    description:
      "A restrained, timeless interface with one consistent design system across every screen.",
    status: "shipped",
  },
  {
    title: "Marketing site & SEO",
    description:
      "Public landing, feature pages, blog, sitemap, structured data and technical SEO.",
    status: "shipped",
  },
  {
    title: "Mobile & accessibility polish",
    description:
      "Refining every layout for small screens and tightening keyboard and screen-reader support.",
    status: "in-progress",
  },
  {
    title: "Performance pass",
    description:
      "Optimizing bundle size, loading states and Core Web Vitals across the app.",
    status: "in-progress",
  },
  {
    title: "Recurring tasks",
    description:
      "Repeat tasks on a schedule so your daily planner sets itself up.",
    status: "planned",
  },
  {
    title: "Calendar view",
    description: "See your planned work and deadlines on a monthly calendar.",
    status: "planned",
  },
  {
    title: "Data export",
    description:
      "Export your projects, time and earnings to CSV whenever you want it.",
    status: "planned",
  },
];

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.1",
    date: "2026-07-03",
    title: "The premium release",
    changes: [
      "New neutral design system with a single restrained gold accent.",
      "Marketing site: landing, feature pages and an MDX blog.",
      "Technical SEO: sitemap, robots, structured data and metadata.",
      "Richer empty states and refined loading skeletons across the app.",
    ],
  },
  {
    version: "1.0",
    date: "2026-06-01",
    title: "Business OS launches",
    changes: [
      "Projects with deliverable-driven progress and per-project workspaces.",
      "A spreadsheet-fast Daily Planner with per-day worksheets.",
      "Time tracking, Goals, Earnings, Notes and Analytics.",
      "Google authentication and a secure, private data model.",
    ],
  },
];
