import { ImageResponse } from "next/og";

interface AppIconOptions {
  size: number;
  /**
   * Maskable icons get cropped to whatever shape the OS uses (circle, squircle,
   * rounded square), so they must be full-bleed with the artwork kept inside the
   * middle ~80% "safe zone". Normal icons keep their own rounded tile instead.
   */
  maskable?: boolean;
}

/**
 * The gold "B" tile, rendered at any size. Shared by the favicon and every PWA
 * manifest icon so the brand mark is defined exactly once.
 */
export function renderAppIcon({ size, maskable = false }: AppIconOptions) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#D4A44F",
        color: "#0A0A0A",
        // Shrink the glyph on maskable icons so cropping can never clip it.
        fontSize: Math.round(size * (maskable ? 0.5 : 0.66)),
        fontWeight: 700,
        borderRadius: maskable ? 0 : Math.round(size * 0.2),
      }}
    >
      B
    </div>,
    { width: size, height: size },
  );
}
