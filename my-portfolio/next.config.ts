import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/case-studies',
        destination: '/experiences',
        permanent: true,
      },
      {
        source: '/case-studies/:slug',
        destination: '/experiences/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
