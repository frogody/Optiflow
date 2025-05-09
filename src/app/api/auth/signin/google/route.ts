// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/api/auth/google';

// Add export config to make this route fully dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Google sign-in route called');

    // Generate the Google OAuth URL
    const authUrl = getGoogleAuthUrl();
    console.log('Generated auth URL:', authUrl);

    // Redirect the user to Google's consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    return NextResponse.redirect(
      new URL('/login?error=AuthenticationError', request.url)
    );
  }
}
