import { NextRequest, NextResponse } from 'next/server';

/**
 * This route handles callbacks from Pipedream Connect OAuth flows.
 * 
 * When a user connects an application through Pipedream Connect,
 * the OAuth provider redirects back to this endpoint with a code and state.
 * 
 * Pipedream Connect manages the complex parts of the OAuth flow for us,
 * so we mainly need to redirect users back to the appropriate page in our app.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  console.log('Pipedream Connect callback received:', 
    code ? `code: ${code.substring(0, 10)}...` : 'no code',
    state ? 'state provided' : 'no state',
    error ? `error: ${error}` : 'no error'
  );
  
  // Extract the return URL from state if available
  let returnUrl = '/dashboard';
  if (state) {
    try {
      // State is typically a JSON string with app and user info
      const stateObj = JSON.parse(state);
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
      new URL(`/error?message=OAuth+connection+failed:+${error}`, request.nextUrl.origin)
    );
  }
  
  // Add success parameter to the return URL
  const redirectUrl = new URL(returnUrl, request.nextUrl.origin);
  redirectUrl.searchParams.set('connection', code ? 'success' : 'error');
  
  // Redirect back to the app
  return NextResponse.redirect(redirectUrl);
} 