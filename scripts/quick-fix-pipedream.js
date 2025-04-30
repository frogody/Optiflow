/**
 * Quick Fix for Pipedream Connection Issues
 * 
 * This script temporarily fixes Pipedream connection issues by directly
 * patching the required environment variables at runtime. Add this to
 * your application to bypass environment variable issues.
 */

// Import this at the top of your src/lib/pipedream/server.ts file
// or anywhere else that needs the environment variables

if (typeof window === 'undefined') {
  // Server-side environment variable patching
  
  // Make sure NEXT_PUBLIC values are accessible server-side
  if (process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID) {
    process.env.PIPEDREAM_CLIENT_ID = process.env.PIPEDREAM_CLIENT_ID || process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID;
  }
  
  // Fix common environment variable formatting issues
  if (process.env.PIPEDREAM_PROJECT_ENVIRONMENT && process.env.PIPEDREAM_PROJECT_ENVIRONMENT.includes('\\n')) {
    process.env.PIPEDREAM_PROJECT_ENVIRONMENT = process.env.PIPEDREAM_PROJECT_ENVIRONMENT.replace(/\\n/g, '');
  }
  
  if (process.env.PIPEDREAM_API_KEY && process.env.PIPEDREAM_API_KEY.includes('PIPEDREAM_API_KEY=')) {
    process.env.PIPEDREAM_API_KEY = process.env.PIPEDREAM_API_KEY.replace(/PIPEDREAM_API_KEY="/g, '')
      .replace(/"\\\n/g, '');
  }
  
  // Set default values for required but missing variables
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    process.env.NEXT_PUBLIC_APP_URL = 'https://app.isyncso.com';
  }
  
  if (!process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI) {
    process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/pipedream/callback`;
  }
  
  // Required for proper Pipedream SDK initialization
  if (!process.env.PIPEDREAM_PROJECT_ENVIRONMENT) {
    process.env.PIPEDREAM_PROJECT_ENVIRONMENT = process.env.NODE_ENV || 'development';
  }
  
  console.log('✅ Pipedream environment variables patched');
  console.log('Environment state:', {
    hasClientId: !!process.env.PIPEDREAM_CLIENT_ID || !!process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID,
    hasClientSecret: !!process.env.PIPEDREAM_CLIENT_SECRET,
    hasProjectId: !!process.env.PIPEDREAM_PROJECT_ID,
    projectEnvironment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    redirectUri: process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI
  });
}

/**
 * How to use this fix:
 * 
 * 1. Create this file in your project as 'src/lib/pipedream/fix-env.ts'
 * 
 * 2. Import it at the top of your src/lib/pipedream/server.ts file:
 *    ```
 *    import './fix-env';
 *    ```
 * 
 * 3. This will patch the environment variables before the Pipedream client is initialized
 * 
 * 4. For a permanent fix, update your .env.local and Vercel environment variables
 */ 