/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn.discordapp.com',
      'diceblox.com',
      'cdn.diceblox.com',
      'tr.rbxcdn.com',
      'rbxcdn.com',
    ],
    // Allow unoptimized images for external domains that might fail
    unoptimized: false,
    // Add remotePatterns for better error handling
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tr.rbxcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'rbxcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.diceblox.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
