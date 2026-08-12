import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Webpack's persistent filesystem cache (PackFileCacheStrategy) can throw
  // "RangeError: Array buffer allocation failed" on machines with tight memory
  // or when the project sits inside a synced folder (OneDrive/Google Drive) that
  // locks files mid-write. Disabling it in dev trades a bit of rebuild speed for
  // not crashing the dev server. Production builds are untouched.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
