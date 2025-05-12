// @ts-check
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

// Must manually implement __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load and merge all environment variables securely
let combinedEnv = {};
try {
  if (process.env.NODE_ENV !== 'production') {
    const envFilePath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envFilePath)) {
      console.log('Found .env.local, loading variables...');
      const envFile = fs.readFileSync(envFilePath, 'utf8');
      
      // Parse the env file line by line
      envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=:#]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          combinedEnv[key] = value;
        }
      });
    }
  }
} catch (error) {
  console.warn('Error loading environment variables:', error.message);
}

// Merge with process.env, prioritizing existing vars
Object.keys(combinedEnv).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = combinedEnv[key];
  }
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Explicitly set React version compatibility
  reactStrictMode: true,
  
  // Configure image domains for CDN and user uploads
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'isyncso.com' },
      { protocol: 'https', hostname: '*.isyncso.com' },
    ],
    domains: [
      'googleusercontent.com', 
      'lh3.googleusercontent.com', 
      'isyncso.com',
      'app.isyncso.com',
    ],
  },
  
  // Transpile dependencies that need it
  transpilePackages: ['@uiball/loaders'],
  
  // Handle TypeScript and middleware errors more gracefully
  typescript: {
    // Handled by editor/CI
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Handled by editor/CI
    ignoreDuringBuilds: true,
  },
  
  // Add experimental features for better client-side stability
  experimental: {
    // Optimize client-side navigation
    optimizeCss: true,
    // Improve client-side error handling
    clientRouterFilter: true,
    // Enable better error handling for client components - using proper typed object format
    serverActions: {
      allowedOrigins: ['localhost:3001', 'app.isyncso.com']
    },
    // Improve hydration stability
    optimizePackageImports: ['@heroicons/react', '@react-icons/all-files'],
  },
  
  // Control polyfills and output behavior
  output: 'standalone',
  
  // Configure headers and rewrites
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=self, microphone=self, geolocation=*, interest-cohort=()',
          }
        ],
      },
    ];
  },
  
  // Handle rewrites
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  }
};

export default nextConfig; 
