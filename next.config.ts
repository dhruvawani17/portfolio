import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/mac",
        destination: "https://mac-ochre.vercel.app",
      },
    ];
  },
};

export default nextConfig;
