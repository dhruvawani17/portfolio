import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/mac",
        destination: "https://mac-ochre.vercel.app",
        permanent: true,
      },
      {
        source: "/mac/:path*",
        destination: "https://mac-ochre.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
