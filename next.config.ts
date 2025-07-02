import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Use default .next directory for Vercel, custom build directory for local archiving
  distDir: process.env.VERCEL ? undefined : 'build',
  /* config options here */
};

export default nextConfig;
