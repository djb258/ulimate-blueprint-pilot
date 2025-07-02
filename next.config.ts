import type { NextConfig } from "next";

const isVercel = !!process.env.VERCEL;
const isDev = process.env.NODE_ENV === 'development';
const isProdBuild = process.env.NODE_ENV === 'production' && process.env.npm_lifecycle_event === 'build';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Use .next for dev and Vercel, build for local production build/archive
  distDir: isVercel || isDev ? undefined : isProdBuild ? 'build' : undefined,
  /* config options here */
};

export default nextConfig;
