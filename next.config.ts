import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@types/web-bluetooth'],
  },
  
  // Headers for Bluetooth API support
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'bluetooth=()',
          },
          {
            key: 'Feature-Policy',
            value: 'bluetooth \'self\'',
          },
        ],
      },
    ];
  },
  
  // Ensure proper environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
