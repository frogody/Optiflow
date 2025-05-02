import { AccessToken, TrackSource } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Helper function for consistent JSON responses
function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// Helper function to format the LiveKit URL
function formatLiveKitUrl(url: string): string {
  // Ensure the URL is properly formatted
  let formattedUrl = url.trim();
  
  // For client-side consumption, make sure it's using https:// protocol
  if (formattedUrl.startsWith('wss://')) {
    formattedUrl = formattedUrl.replace('wss://', 'https://');
  }
  
  return formattedUrl;
}

export async function GET() {
  try {
    // Get LiveKit API key and secret from environment variables
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    // Validate required configuration
    if (!apiKey || !apiSecret || !wsUrl) {
      console.error('Missing LiveKit configuration:', {
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        hasWsUrl: !!wsUrl
      });
      return jsonResponse({
        error: 'LiveKit configuration missing',
        token: null
      }, 500);
    }

    // Create a unique identity for this session
    const identity = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const roomName = 'voice-agent-room';

    try {
      // Create the access token with proper TTL
      const token = new AccessToken(apiKey, apiSecret, {
        identity,
        ttl: 60, // 60 seconds for testing
      });

      // Add grant with all necessary permissions
      token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
        canPublishSources: [TrackSource.MICROPHONE],
      });

      // Generate the JWT token
      const jwt = token.toJwt();

      // Return success response with proper URL format
      return jsonResponse({
        token: jwt,
        identity,
        room: roomName,
        url: wsUrl // Keep the WSS URL as is for the client
      });

    } catch (tokenError) {
      console.error('Error generating token:', tokenError);
      return jsonResponse({
        error: 'Failed to generate token',
        token: null,
        details: tokenError instanceof Error ? tokenError.message : String(tokenError)
      }, 500);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({
      error: 'Internal server error',
      token: null,
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.error('Authentication failed:', { 
        hasSession: !!session,
        hasUser: !!session?.user,
        email: session?.user?.email 
      });
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    let wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    console.log('Processing token request for:', {
      userEmail: session.user.email,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      wsUrl
    });

    if (!apiKey || !apiSecret || !wsUrl) {
      console.error('Missing LiveKit configuration:', {
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        hasWsUrl: !!wsUrl
      });
      return jsonResponse({ 
        error: 'Server configuration error' 
      }, 500);
    }

    // Ensure the URL is properly formatted
    try {
      const url = new URL(wsUrl);
      if (!url.protocol.startsWith('wss:')) {
        wsUrl = `wss://${url.host}`;
      }
    } catch (error) {
      console.error('Invalid LiveKit URL:', error);
      return jsonResponse({ 
        error: 'Invalid server configuration' 
      }, 500);
    }

    // Use the user's email as their identity
    const identity = session.user.email;
    const roomName = 'voice-agent-room';

    const at = new AccessToken(apiKey, apiSecret, { 
      identity,
      ttl: 60 * 60 * 24 // 24 hours
    });
    
    // Add grant with all necessary permissions
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      canPublishSources: [TrackSource.MICROPHONE],
    });

    const token = await at.toJwt();
    console.log('Token generated successfully for:', {
      identity,
      room: roomName,
      urlLength: wsUrl.length,
      tokenLength: token.length
    });

    return jsonResponse({ 
      token,
      url: wsUrl,
      identity,
      room: roomName
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return jsonResponse({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
} 