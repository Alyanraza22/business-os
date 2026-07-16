import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Installable-app manifest.
 *
 * `start_url` opens straight into the workspace rather than the marketing site,
 * so the installed app is the product, not the landing page. `scope` stays at
 * "/" on purpose: sign-in lives outside /dashboard, and anything out of scope
 * would be kicked into a normal browser tab mid-login.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    // No orientation lock — this is a desktop-first workspace that also has to
    // stay usable on a tablet in landscape.
    background_color: "#090909",
    theme_color: "#090909",
    categories: ["productivity", "business"],
    icons: [
      {
        src: "/icons/192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // Right-click the taskbar/dock icon to jump straight into a task.
    shortcuts: [
      {
        name: "Focus mode",
        short_name: "Focus",
        description: "Start deep work on your highest-priority task",
        url: "/focus",
      },
      {
        name: "Daily Planner",
        short_name: "Planner",
        description: "Plan today's work",
        url: "/tasks",
      },
      {
        name: "Review",
        short_name: "Review",
        description: "See where the day and week landed",
        url: "/review",
      },
    ],
  };
}
