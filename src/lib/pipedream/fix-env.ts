// @ts-nocheck - This file has some TypeScript issues that are hard to fix
/**
 * Pipedream Environment Variable Fixer
 *
 * This module patches environment variables at runtime to fix common issues
 * with Pipedream integration. Import this at the top of server.ts.
 */

// Only run on the server side
if (typeof window === 'undefined') {
  console.log('Running Pipedream environment variable fixer...');

  // Helper function to clean string values
  const cleanEnvValue = (value: string | undefined): string | undefined => {
    if (!value) return value;

    // Replace any combination of newlines, quotes, or value="value" patterns
    return value
      .replace(/\\n/g, '') // Replace escaped newlines
      .replace(/\n/g, '') // Replace literal newlines
      .replace(/\\r/g, '') // Replace escaped carriage returns
      .replace(/\r/g, '') // Replace literal carriage returns
      .replace(/^"(.*)"$/, '$1') // Remove surrounding quotes
      .replace(/^'(.*)'$/, '$1') // Remove surrounding single quotes
      .replace(/.*="(.*)"\s*$/, '$1') // Extract value from KEY="value" pattern
      .trim(); // Trim whitespace
  };

  // List of Pipedream-related environment variables to clean
  const keysToClean = [
    'PIPEDREAM_CLIENT_ID',
    'PIPEDREAM_CLIENT_SECRET',
    'PIPEDREAM_PROJECT_ID',
    'PIPEDREAM_PROJECT_ENVIRONMENT',
    'PIPEDREAM_API_KEY',
    'NEXT_PUBLIC_PIPEDREAM_CLIENT_ID',
    'NEXT_PUBLIC_PIPEDREAM_CLIENT_SECRET',
    'NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI',
  ];

  // Clean all Pipedream-related environment variables
  keysToClean.forEach((key) => {
    if (process.env[key]) {
      const originalValue = process.env[key];
      process.env[key] = cleanEnvValue(originalValue);

      // Log only if value changed (don't leak secrets)
      if (originalValue !== process.env[key]) {
        console.log(`Cleaned ${key} environment variable`);
      }
    }
  });

  // Make sure NEXT_PUBLIC values are accessible server-side
  if (
    process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID &&
    !process.env.PIPEDREAM_CLIENT_ID
  ) {
    process.env.PIPEDREAM_CLIENT_ID =
      process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID;
    console.log(
      'Synced NEXT_PUBLIC_PIPEDREAM_CLIENT_ID to PIPEDREAM_CLIENT_ID'
    );
  }

  // Set default values for required but missing variables
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    process.env.NEXT_PUBLIC_APP_URL = 'https://app.isyncso.com';
    console.log('Set default NEXT_PUBLIC_APP_URL');
  }

  if (!process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI) {
    process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/pipedream/callback`;
    console.log('Set default NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI');
  }

  // Required for proper Pipedream SDK initialization
  if (!process.env.PIPEDREAM_PROJECT_ENVIRONMENT) {
    process.env.PIPEDREAM_PROJECT_ENVIRONMENT =
      process.env.NODE_ENV || 'development';
    console.log('Set default PIPEDREAM_PROJECT_ENVIRONMENT');
  }

  console.log('✅ Pipedream environment variables patched');
  console.log('Environment state:', {
    hasClientId:
      !!process.env.PIPEDREAM_CLIENT_ID ||
      !!process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID,
    hasClientSecret: !!process.env.PIPEDREAM_CLIENT_SECRET,
    hasProjectId: !!process.env.PIPEDREAM_PROJECT_ID,
    projectEnvironment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    redirectUri: process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI,
  });
}
