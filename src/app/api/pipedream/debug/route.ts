import { NextResponse } from 'next/server';
import '../../../../lib/pipedream/fix-env';

export async function GET() {
  // Filter out sensitive info
  const filteredEnv = {
    // Required Pipedream variables
    PIPEDREAM_CLIENT_ID: process.env.PIPEDREAM_CLIENT_ID
      ? '[SET]'
      : '[NOT SET]',
    PIPEDREAM_CLIENT_SECRET: process.env.PIPEDREAM_CLIENT_SECRET
      ? '[SET]'
      : '[NOT SET]',
    PIPEDREAM_PROJECT_ID: process.env.PIPEDREAM_PROJECT_ID
      ? '[SET]'
      : '[NOT SET]',
    PIPEDREAM_PROJECT_ENVIRONMENT:
      process.env.PIPEDREAM_PROJECT_ENVIRONMENT || '[NOT SET]',

    // Public variables
    NEXT_PUBLIC_PIPEDREAM_CLIENT_ID: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID
      ? '[SET]'
      : '[NOT SET]',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '[NOT SET]',
    NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI:
      process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI || '[NOT SET]',

    // Node environment
    NODE_ENV: process.env.NODE_ENV || '[NOT SET]',
  };

  // Check for common issues
  const issues = [];

  if (
    !process.env.PIPEDREAM_CLIENT_ID &&
    !process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID
  ) {
    issues.push('Missing Client ID');
  }

  if (!process.env.PIPEDREAM_CLIENT_SECRET) {
    issues.push('Missing Client Secret');
  }

  if (!process.env.PIPEDREAM_PROJECT_ID) {
    issues.push('Missing Project ID');
  }

  if (process.env.PIPEDREAM_PROJECT_ENVIRONMENT?.includes('\\n')) {
    issues.push('Environment variable contains newline characters');
  }

  return NextResponse.json({
    status: issues.length === 0 ? 'ok' : 'issues',
    environment: filteredEnv,
    issues: issues.length > 0 ? issues : null,
    timestamp: new Date().toISOString(),
  });
}
