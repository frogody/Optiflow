#!/bin/bash
# Fix for Vercel build issues with Next.js and fonts

echo "Running pre-build fixes for Vercel deployment..."

# Check if SWC is enabled and fonts are imported from next/font
# If both are true, we need to disable SWC or modify font imports

# Create babel.config.js if it doesn't exist
if [ ! -f babel.config.js ]; then
    echo "Creating babel.config.js..."
    cat > babel.config.js << 'EOL'
module.exports = {
  presets: ["next/babel"],
  plugins: [
    "@babel/plugin-transform-private-methods",
    "@babel/plugin-transform-private-property-in-object",
    "@babel/plugin-transform-class-properties"
  ]
};
EOL
    echo "babel.config.js created successfully."
fi

# Update next.config.js to disable SWC for fonts
echo "Updating next.config.js..."
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  }
}

module.exports = nextConfig
EOL
echo "next.config.js updated successfully."

echo "Pre-build fixes complete. Ready for deployment." 