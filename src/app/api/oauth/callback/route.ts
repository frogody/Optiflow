import { NextRequest, NextResponse } from 'next/server';
import { PipedreamMCPService } from '@/services/PipedreamMCPService';

interface StateObject {
  returnUrl?: string;
  appId?: string;
  userId?: string;
  [key: string]: any;
}

/**
 * This route handles callbacks from Pipedream OAuth flows.
 * 
 * When a user connects an application through Pipedream,
 * the OAuth provider redirects back to this endpoint with a code and state.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('OAuth callback received:', {
      code: code ? '[REDACTED]' : null,
      state,
      error,
      errorDescription
    });

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/app?error=oauth_error&reason=${encodeURIComponent(errorDescription || error)}`, request.nextUrl.origin)
      );
    }

    // Validate required parameters
    if (!code || !state) {
      console.error('Missing required OAuth parameters');
      return NextResponse.redirect(
        new URL('/app?error=invalid_request&reason=missing_parameters', request.nextUrl.origin)
      );
    }

    let stateData;
    try {
      stateData = JSON.parse(decodeURIComponent(state));
    } catch (e) {
      console.error('Invalid state parameter:', e);
      return NextResponse.redirect(
        new URL('/app?error=invalid_state', request.nextUrl.origin)
      );
    }

    // Initialize Pipedream service
    const pipedreamService = PipedreamMCPService.getInstance({
      clientId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID!,
      clientSecret: process.env.PIPEDREAM_CLIENT_SECRET!,
      projectId: process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ID!,
      redirectUri: new URL('/api/oauth/callback', request.nextUrl.origin).toString(),
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
    });

    // Process OAuth callback
    const success = await pipedreamService.handleOAuthCallback(code, state);

    if (success) {
      // Redirect to success URL from state or default to app page
      const redirectUrl = stateData.returnUrl || '/app';
      return NextResponse.redirect(new URL(redirectUrl, request.nextUrl.origin));
    } else {
      console.error('Failed to process OAuth callback');
      return NextResponse.redirect(
        new URL('/app?error=oauth_failed&reason=processing_failed', request.nextUrl.origin)
      );
    }
  } catch (error) {
    console.error('Unexpected error in OAuth callback:', error);
    return NextResponse.redirect(
      new URL('/app?error=internal_error', request.nextUrl.origin)
    );
  }
} 