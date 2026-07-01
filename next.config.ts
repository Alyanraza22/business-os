import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 * HSTS is intentionally omitted here and left to the hosting platform (Vercel)
 * so it is only sent over HTTPS.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Transform barrel imports into direct ones — faster dev compiles and smaller
  // client bundles for these icon/util/chart libraries.
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "recharts", "sonner"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Supabase Storage public buckets will be added here when wired up.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
