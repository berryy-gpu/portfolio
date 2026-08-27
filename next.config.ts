import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 31536000,
    // Default (75) plus 90, used by testimonial-wall.tsx for its
    // compression-sensitive baked-in text — required explicitly as of
    // Next.js 15.x, becomes a hard error on any unlisted quality in 16.
    qualities: [75, 90],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
