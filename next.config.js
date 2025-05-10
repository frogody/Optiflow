const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'ui-avatars.com'],
  },
  // Skip type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip PostCSS validation
  postcss: {
    // Use a minimal config to avoid issues
    config: {
      plugins: {},
    },
  },
  swcMinify: false,
  experimental: {
    // Disable SWC transforms
    forceSwcTransforms: false,
    // Disable React strict mode
    strictMode: false,
  },
  env: {
    NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NODE_ENV || 'development',
    NEXT_PUBLIC_PIPEDREAM_CLIENT_ID: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || 'kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://app.isyncso.com',
    NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI: process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI || 'https://app.isyncso.com/api/pipedream/callback',
  }
}

module.exports = nextConfig