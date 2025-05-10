const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    dangerouslyAllowSVG: true,
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'ui-avatars.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NODE_ENV || 'development',
    NEXT_PUBLIC_PIPEDREAM_CLIENT_ID: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || 'kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://app.isyncso.com',
    NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI: process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI || 'https://app.isyncso.com/api/pipedream/callback',
  }
}

module.exports = nextConfig