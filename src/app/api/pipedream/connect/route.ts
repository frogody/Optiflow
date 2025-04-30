// Import our environment fix module first
import '../../../../lib/pipedream/fix-env';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { serverConnectTokenCreate } from '@/lib/pipedream/server';

export async function POST(req: Request) {
  try {
    console.log('Starting Pipedream connect token creation...');
    
    // Log request details
    console.log('Request details:', {
      method: req.method,
      url: req.url,
      headers: {
        origin: req.headers.get('origin'),
        referer: req.headers.get('referer'),
        'user-agent': req.headers.get('user-agent'),
        'content-type': req.headers.get('content-type')
      }
    });
    
    // Debug environment variables
    console.log('Environment check:', {
      clientId: process.env.PIPEDREAM_CLIENT_ID?.substring(0, 10) + '...',
      hasClientSecret: !!process.env.PIPEDREAM_CLIENT_SECRET,
      projectId: process.env.PIPEDREAM_PROJECT_ID,
      environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT,
      allowedOrigins: process.env.PIPEDREAM_ALLOWED_ORIGINS,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });
    
    // Get the session
    const session = await getServerSession(authOptions);
    console.log('Session state:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      console.error('Authentication failed: No session or user ID');
      return NextResponse.json(
        { error: 'You must be logged in to connect your account' },
        { status: 401 }
      );
    }

    // Get and log the request body
    const body = await req.json().catch(() => ({}));
    console.log('Request body:', body);

    if (!body || Object.keys(body).length === 0) {
      console.error('Empty or invalid request body');
      return NextResponse.json(
        { error: 'Invalid request: empty or malformed body' },
        { status: 400 }
      );
    }

    const { external_user_id, user_facing_label, app_id } = body;
    
    // Validate required parameters
    if (!external_user_id) {
      console.error('Missing required parameter: external_user_id');
      return NextResponse.json(
        { error: 'Missing required parameter: external_user_id' },
        { status: 400 }
      );
    }

    // Log environment state
    console.log('Environment state:', {
      hasClientId: !!process.env.PIPEDREAM_CLIENT_ID || !!process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID,
      hasClientSecret: !!process.env.PIPEDREAM_CLIENT_SECRET,
      hasProjectId: !!process.env.PIPEDREAM_PROJECT_ID,
      projectEnvironment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT,
      nodeEnv: process.env.NODE_ENV,
      origin: req.headers.get('origin'),
      allowedOrigins: process.env.PIPEDREAM_ALLOWED_ORIGINS
    });

    // Verify the external_user_id matches the session user
    if (external_user_id !== session.user.id) {
      console.error('User ID mismatch:', {
        providedId: external_user_id,
        sessionUserId: session.user.id
      });
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 403 }
      );
    }

    console.log('Creating connect token with params:', {
      external_user_id,
      user_facing_label,
      app_id
    });

    // Verify required environment variables
    if (!process.env.PIPEDREAM_CLIENT_ID && !process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID) {
      console.error('Missing Pipedream Client ID environment variable');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Missing Pipedream Client ID'
        },
        { status: 500 }
      );
    }

    if (!process.env.PIPEDREAM_CLIENT_SECRET) {
      console.error('Missing Pipedream Client Secret environment variable');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Missing Pipedream Client Secret'
        },
        { status: 500 }
      );
    }

    if (!process.env.PIPEDREAM_PROJECT_ID) {
      console.error('Missing Pipedream Project ID environment variable');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Missing Pipedream Project ID'
        },
        { status: 500 }
      );
    }

    // Generate connect token
    try {
      const tokenResponse = await serverConnectTokenCreate({
        external_user_id,
        user_facing_label
      });

      if (!tokenResponse.token) {
        console.error('Token created but missing token value');
        return NextResponse.json(
          { 
            error: 'Invalid token response',
            details: 'Token value missing in response'
          },
          { status: 500 }
        );
      }

      console.log('Token created successfully:', {
        hasToken: !!tokenResponse.token,
        expiresAt: tokenResponse.expires_at,
        hasConnectUrl: !!tokenResponse.connect_link_url
      });

      return NextResponse.json(tokenResponse);
    } catch (tokenError: any) {
      console.error('Token creation error:', {
        message: tokenError.message,
        stack: tokenError.stack,
        response: tokenError.response?.data,
        status: tokenError.response?.status,
        fullError: tokenError
      });
      
      // Check for specific error patterns and provide clearer messages
      let errorDetails = tokenError.message;
      
      if (tokenError.message?.includes('ran out of attempts')) {
        errorDetails = 'Failed to authenticate with Pipedream. Please verify your Pipedream configuration.';
      } else if (tokenError.message?.includes('Authentication failed')) {
        errorDetails = 'Authentication failed with Pipedream API. Please check your API credentials.';
      } else if (tokenError.response?.data?.error) {
        errorDetails = tokenError.response.data.error;
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to create connect token',
          details: errorDetails,
          rawError: tokenError.message,
          response: tokenError.response?.data,
          status: tokenError.response?.status
        },
        { status: tokenError.response?.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('General error in connect route:', {
      message: error.message,
      stack: error.stack,
      fullError: error
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create connect token',
        details: error.message
      },
      { status: 500 }
    );
  }
} 