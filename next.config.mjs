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
    // Also ignore ESLint errors during production build if needed
    ignoreDuringBuilds: true,
  },
  // Enable static generation where possible while preserving dynamic features
  reactStrictMode: true,
  output: 'standalone',
  
  // External packages configuration - updated syntax for Next.js 15
  // Including React packages to avoid "is not a function" errors
  serverExternalPackages: ['bcrypt', 'react', 'react-dom'],
  
  // Set a reasonable timeout for static page generation
  // Longer timeout allows more complex pages to be generated
  staticPageGenerationTimeout: 180,
  
  // Enhanced stability for build process
  experimental: {
    // Disable optimizeCss to prevent potential CSS issues
    optimizeCss: false,
  },
  
  // Keep trailing slash consistent
  trailingSlash: false,
  
  // Configure security headers
  headers: async () => {
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
  
  // Configure image optimization
  images: {
    unoptimized: true, // Consider changing to false if memory issues are resolved
    domains: ['localhost', 'app.isyncso.com', 'optiflow-nmyk05sho-isyncso.vercel.app'],
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
  
  // Enhanced webpack configuration - ESM compatible version
  webpack: (config, { isServer }) => {
    // Only apply fallbacks for client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    // Add aliases without using require
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
};

export default nextConfig; 