import type { NextConfig } from "next";

const isVercel = !!process.env.VERCEL;
const isDev = process.env.NODE_ENV === 'development';
const isProdBuild = process.env.NODE_ENV === 'production' && process.env.npm_lifecycle_event === 'build';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Use .next for dev and Vercel, build for local production build/archive
  distDir: isVercel || isDev ? undefined : isProdBuild ? 'build' : undefined,
  
  // Vercel deployment optimizations
  experimental: {
    // Enable Turbopack for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Environment variables for Google Drive integration
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  },
  
  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
