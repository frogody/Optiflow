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
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  console.log('Pipedream OAuth callback received:', 
    code ? `code: ${code.substring(0, 5)}...` : 'no code',
    state ? 'state provided' : 'no state',
    error ? `error: ${error}` : 'no error'
  );
  
  // Extract app and user info from state if available
  let returnUrl = '/connections';
  let stateObj: StateObject = {};
  
  if (state) {
    try {
      stateObj = JSON.parse(state) as StateObject;
      if (stateObj.returnUrl) {
        returnUrl = stateObj.returnUrl;
      }
    } catch (e) {
      console.error('Error parsing state:', e);
    }
  }
  
  // If there was an error, redirect to an error page
  if (error) {
    return NextResponse.redirect(
      new URL(`/error?message=OAuth+connection+failed:+${error}`, request.url)
    );
  }
  
  // Process the OAuth callback if we have a code and valid state
  if (code && state && stateObj.appId && stateObj.userId) {
    try {
      // Get the MCP service instance with default config
      const mcpService = PipedreamMCPService.getInstance({
        clientId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || '',
        clientSecret: process.env.PIPEDREAM_CLIENT_SECRET || '',
        projectId: process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ID || '',
        redirectUri: `${request.nextUrl.origin}/api/oauth/callback`,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
      });
      
      console.log('Processing OAuth callback with:',
        'Client ID:', process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID?.substring(0, 10) + '...',
        'Project ID:', process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ID || 'not set'
      );
      
      // Complete the OAuth flow
      const success = await mcpService.handleOAuthCallback(code, state);
      
      if (success) {
        // Add success parameter to the return URL
        const redirectUrl = new URL(returnUrl, request.url);
        redirectUrl.searchParams.set('connection', 'success');
        if (stateObj.appId) {
          redirectUrl.searchParams.set('app', stateObj.appId);
        }
        
        // Redirect back to the app
        return NextResponse.redirect(redirectUrl);
      } else {
        // Handle failure
        return NextResponse.redirect(
          new URL(`/error?message=Failed+to+complete+OAuth+flow`, request.url)
        );
      }
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      return NextResponse.redirect(
        new URL(`/error?message=Error+handling+OAuth+callback`, request.url)
      );
    }
  }
  
  // Handle missing parameters
  const redirectUrl = new URL(returnUrl, request.url);
  redirectUrl.searchParams.set('connection', 'error');
  redirectUrl.searchParams.set('reason', 'invalid_request');
  
  // Redirect back to the app
  return NextResponse.redirect(redirectUrl);
} 