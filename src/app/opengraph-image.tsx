import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

/** Branded Open Graph / Twitter card image, generated at build time. */
export const alt = `${siteConfig.name} — One workspace to run your work`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#090909",
        color: "#F5F5F5",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#D4A44F",
            color: "#0A0A0A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          B
        </div>
        <div style={{ fontSize: 34, fontWeight: 600 }}>{siteConfig.name}</div>
      </div>

      <div
        style={{
          fontSize: 66,
          fontWeight: 600,
          marginTop: 48,
          letterSpacing: "-0.02em",
          lineHeight: 1.08,
          maxWidth: 920,
        }}
      >
        One workspace to run your work
      </div>

      <div
        style={{
          fontSize: 28,
          color: "#A1A1AA",
          marginTop: 24,
          lineHeight: 1.4,
          maxWidth: 840,
        }}
      >
        Projects, planner, time, goals, notes and earnings — unified.
      </div>
    </div>,
    { ...size },
  );
}
