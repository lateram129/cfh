import type { NextConfig } from 'next';

// PWA note: next-pwa is webpack-only and unmaintained; Next 16 defaults to
// Turbopack, so the two don't mix. Instead, public/sw.js is a small
// hand-written service worker (registered from components/ServiceWorkerRegister.tsx)
// — simpler, Turbopack-compatible, and plenty for an installable iOS/Android PWA.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  turbopack: {},
};

export default nextConfig;
