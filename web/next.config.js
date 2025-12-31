/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  reactStrictMode: true,

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

module.exports = nextConfig;
