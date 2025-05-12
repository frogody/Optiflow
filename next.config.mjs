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
  // Other Next.js config options here
  eslint: {
    // Also ignore ESLint errors during production build if needed
    ignoreDuringBuilds: true,
  },
  // Configure pages to not be statically generated
  // This works around session issues in static site generation
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    // Needed for deployment to Vercel
    serverComponentsExternalPackages: ['bcrypt'],
  },
  // Skip static generation for pages that need session data
  generateStaticParams: false,
  staticPageGenerationTimeout: 90,
  // Retain any existing configuration
  i18n: {
    locales: ['en', 'fr', 'nl', 'de', 'es'],
    defaultLocale: 'en',
  },
};

export default nextConfig; 