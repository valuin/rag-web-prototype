import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://inference.jatevo.id/v1/:path*', // Proxy to your API endpoint
      },
    ];
  },
};

export default nextConfig;
