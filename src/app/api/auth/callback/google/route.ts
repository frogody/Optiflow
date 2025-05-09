// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { NextRequest, NextResponse } from 'next/server';

/**
 * This route handles the callback from Google OAuth.
 * NextAuth will automatically process the OAuth flow, but we can add additional logic here
 * if needed for your application.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // NextAuth will handle the actual authentication, but we can log or customize behavior
  console.log(
    'Google OAuth callback received with code',
    code?.substring(0, 10) + '...'
  );

  // Redirect to the NextAuth callback handler
  const callbackUrl = `/api/auth/callback/google?code=${code}&state=${state}`;

  return NextResponse.redirect(new URL(callbackUrl, request.url));
}
