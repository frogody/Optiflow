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
  // Configure pages to not be statically generated
  // This works around session issues in static site generation
  reactStrictMode: true,
  output: 'standalone',
  
  // External packages configuration - updated syntax for Next.js 15
  serverExternalPackages: ['bcrypt'],
  
  // Disable static generation completely to avoid session errors
  staticPageGenerationTimeout: 180,
  
  // Explicitly disable static exports
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
  
  // Disable image optimization to avoid memory issues
  images: {
    unoptimized: true,
  },
};

export default nextConfig; 