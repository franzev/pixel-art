import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    imageSizes: [64, 96, 128, 160, 192, 256, 320, 384, 480],
    deviceSizes: [640, 768, 960, 1024, 1200, 1440, 1920],
    qualities: [82],
  },
};

export default nextConfig;
