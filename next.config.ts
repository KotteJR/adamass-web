import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    // The paintings are smooth gradients: AVIF keeps them clean, and they ask
    // for quality 90 (other images keep the default 75).
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  partialPrefetching: true,
  // The same security headers the live site sends today.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      // Tailwind runs on global stylesheets only. CSS modules (the figure
      // keyframes) keep Turbopack's own module pipeline, so :global() and
      // scoped keyframe names work.
      "*.css": {
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
