import { NextRequest, NextResponse } from 'next/server';
import { PipedreamMCPService } from '@/services/PipedreamMCPService';

/**
 * Handle OAuth callback from Pipedream
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Handle error from OAuth provider
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL(`/connections?error=${error}`, request.url));
    }
    
    // Validate required parameters
    if (!code || !state) {
      console.error('Missing required OAuth parameters');
      return NextResponse.redirect(new URL('/connections?error=invalid_request', request.url));
    }
    
    // Initialize Pipedream MCP service
    const pipedreamService = PipedreamMCPService.getInstance({
      clientId: process.env.PIPEDREAM_CLIENT_ID || '',
      clientSecret: process.env.PIPEDREAM_CLIENT_SECRET || '',
      projectId: process.env.PIPEDREAM_PROJECT_ID || '',
      redirectUri: process.env.PIPEDREAM_REDIRECT_URI || '',
      environment: (process.env.NODE_ENV as 'development' | 'production') || 'development'
    });
    
    // Handle the OAuth callback
    const success = await pipedreamService.handleOAuthCallback(code, state);
    
    if (success) {
      // Parse state to get app ID if needed
      let appId: string | null = null;
      try {
        const stateData = JSON.parse(state);
        appId = stateData.appId;
      } catch (e) {
        console.error('Failed to parse state:', e);
      }
      
      // Redirect to connections page with success message
      return NextResponse.redirect(new URL(
        `/connections?success=true&app=${appId || 'service'}`, 
        request.url
      ));
    } else {
      // Redirect with error
      return NextResponse.redirect(new URL(
        '/connections?error=authorization_failed', 
        request.url
      ));
    }
    
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    
    // Redirect to connections page with error
    return NextResponse.redirect(new URL(
      `/connections?error=${encodeURIComponent(error.message || 'unknown_error')}`, 
      request.url
    ));
  }
} 