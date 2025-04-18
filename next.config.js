/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add trailing slash to ensure consistent URL handling
  trailingSlash: true,
  // Disable telemetry for privacy
  experimental: {
    disableOptimizedLoading: true,
  },
  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NODE_ENV || 'development',
  },
  // Configure static generation timeout
  staticPageGenerationTimeout: 120,
}

module.exports = nextConfig 