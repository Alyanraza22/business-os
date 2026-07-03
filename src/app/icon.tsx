import { ImageResponse } from "next/og";

/** Branded app icon (gold "B" tile) — favicon + manifest icon. */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
        fontSize: 340,
        fontWeight: 700,
        borderRadius: 104,
      }}
    >
      B
    </div>,
    { ...size },
  );
}
