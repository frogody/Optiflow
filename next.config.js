/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.icloud.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.icloud-content.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.livekit.cloud',
        pathname: '/**',
      }
    ],
    dangerouslyAllowSVG: true,
    unoptimized: false,
    domains: ['localhost'], // Add localhost for development
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add trailing slash to ensure consistent URL handling
  trailingSlash: true,
  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NODE_ENV || 'development',
    // Add OAuth config variables to be available to the client
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
  // Tell Next.js to use Babel instead of SWC
  transpilePackages: ['next'],
  experimental: {
    // Disable SWC for font compatibility
    forceSwcTransforms: false
  },
  // Configure webpack for WebSocket support
  webpack: (config, { isServer, dev }) => {
    if (!isServer && dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
}

module.exports = nextConfig
