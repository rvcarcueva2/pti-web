import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: ['ynguattppcreuxywihzv.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ynguattppcreuxywihzv.supabase.co',
        pathname: '/storage/v1/object/public/poster/**',
      },
    ],
  },
};

export default nextConfig;
