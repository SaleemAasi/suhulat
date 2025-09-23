import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Correct and supported
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ disables type errors during `next build`
  },
};

export default nextConfig;
