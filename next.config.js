import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'ui-avatars.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Skip type checking during build
  typescript: {
    // Enable type checking in development, but don't fail production builds
    ignoreBuildErrors: true,
    // Enable more strict checks
    tsconfigPath: './tsconfig.json',
  },
  // Skip ESLint during build
  eslint: {
    // Enable ESLint in development, but don't fail production builds
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  // swcMinify is true by default, explicit key might not be recognized or needed
  // swcMinify: true, 
  experimental: {
    // Enable modern optimizations
    optimizeCss: true,
    optimizePackageImports: ['@headlessui/react', '@heroicons/react'],
    // Add modern features
    serverActions: {
      allowedOrigins: ['localhost:3000', 'optiflow.ai'],
    },
    // ppr: true, // Remove as it requires canary
    typedRoutes: true,
  },
  // Moved from experimental
  // serverComponentsExternalPackages: ['@prisma/client'], // Removed, Next.js 15+ often handles this automatically
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // i18n configuration removed as it's not supported with App Router
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'nl', 'de', 'fr', 'es'],
  // },
  // Add webpack configuration for better optimization
  webpack: (config, { dev, isServer }) => {
    // Add path alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };

    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Add module resolution optimizations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
  env: {
    NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NODE_ENV || 'development',
    NEXT_PUBLIC_PIPEDREAM_CLIENT_ID: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || 'kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://app.isyncso.com',
    NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI: process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI || 'https://app.isyncso.com/api/pipedream/callback',
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};

export default nextConfig