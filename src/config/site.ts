/**
 * Central site configuration. Single source of truth for branding, metadata
 * defaults and external links used across SEO tags and the UI.
 */
export const siteConfig = {
  name: "Business OS",
  shortName: "Business OS",
  description:
    "One unified workspace to manage projects, tasks, time, goals, notes and earnings — fast, modern and beautifully organized.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  creator: "Business OS",
  keywords: [
    "productivity",
    "business management",
    "time tracking",
    "project management",
    "task management",
    "freelancer dashboard",
  ],
  /** Update to your real support address once a domain mailbox exists. */
  contactEmail: "hello@businessos.app",
  links: {
    github: "https://github.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
