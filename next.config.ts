import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.runware.ai",
      },
      {
        protocol: "https",
        hostname: "runware.ai",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "fkz2x30lcb.ufs.sh",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
