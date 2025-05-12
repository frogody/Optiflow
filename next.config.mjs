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
  serverExternalPackages: ['bcrypt'],
  
  // Set a reasonable timeout for static page generation
  // Longer timeout allows more complex pages to be generated
  staticPageGenerationTimeout: 300,
  
  // Keep trailing slash consistent
  trailingSlash: false,
  
  // Handle ESM externals appropriately
  experimental: {
    // Fix for common "X is not a function" errors when using dynamic imports
    esmExternals: false,
    // Explicitly optimizing React server components
    serverComponentsExternalPackages: ['react', 'react-dom'],
  },
  
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
  
  // Enhanced webpack configuration
  webpack: (config, { isServer }) => {
    // Only use require() on the server for next-i18next
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    // Make sure React is properly resolved
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
    };
    
    return config;
  },
};

export default nextConfig; 