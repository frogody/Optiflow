/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript errors during production build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during production build
  eslint: {
    // Also ignore ESLint errors during production builds if needed
    ignoreDuringBuilds: true,
  },
  // Enable static generation where possible while preserving dynamic features
  reactStrictMode: true,
  
  // Avoiding React version conflicts by transpiling specific packages
  transpilePackages: [
    '@heroicons/react',
    'framer-motion',
    'react-icons',
    '@headlessui/react',
    'mdx',
    'next-mdx-remote',
    'react-markdown',
    '@mdx-js/react'
  ],
  
  // Build configuration
  swcMinify: true,
  
  // Configure webpack for better compatibility
  webpack: (config) => {
    // Add resolution for missing dependencies
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  
  // Configure experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Disable static generation
    appDir: true,
    serverComponentsExternalPackages: ['prisma', '@prisma/client', 'bcrypt', 'react', 'react-dom', '@swc/wasm-web'],
  },
  
  // Keep trailing slash consistent
  trailingSlash: true,
  
  // Configure security headers
  async headers() {
    return [
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
    ];
  },
  
  // Configure image domains
  images: {
    unoptimized: true, // Consider changing to false if memory issues are resolved
    domains: ['localhost', 'app.isyncso.com', 'optiflow-nmyk05sho-isyncso.vercel.app', 'cdn.discordapp.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'www.gravatar.com'],
  },
  
  // Handle static asset errors
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/api/manifest',
      },
    ];
  },
  
  // Configure compiler to handle specific requirements
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Set custom dist directory
  distDir: '.next',

  // Use server-side rendering for production to avoid icon component issues
  output: 'standalone',
};

module.exports = nextConfig; 