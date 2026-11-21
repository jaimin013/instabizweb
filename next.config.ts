import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evaluated once at build time, so the footer year stays deterministic
  // (Cache Components forbids reading the clock during prerender).
  env: { NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()) },

  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
