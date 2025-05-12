import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try to get the session with the auth options
    const session = await getServerSession(authOptions);
    
    console.log('Session state:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      expires: session?.expires,
      environment: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL
    });

    const response = NextResponse.json(session);

    // Add cache control headers to prevent excessive requests
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, max-age=0, must-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Session error:', error);
    
    // Check if it's a JWT decryption error (common with secret changes)
    const isJwtError = error instanceof Error && 
      (error.message.includes('decrypt') || error.message.includes('JWT'));
    
    if (isJwtError) {
      // Return a null session instead of error, forcing client to reauth
      console.log('JWT error detected, returning null session');
      const response = NextResponse.json(null);
      
      // Add cache control headers to prevent excessive requests
      response.headers.set(
        'Cache-Control',
        'private, no-cache, no-store, max-age=0, must-revalidate'
      );
      return response;
    }
    
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}
