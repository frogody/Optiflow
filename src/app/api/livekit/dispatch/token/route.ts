import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions, verifyAgentBypass } from '@/lib/auth';

// Helper function to strip quotes from environment variables
function cleanEnvVar(value: string | undefined): string {
  if (!value) return '';
  // Handle both double and single quotes with a better approach
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1);
  }
  return value;
}

// Export POST, GET, and OPTIONS methods for the endpoint
export async function POST(req: NextRequest) {
  return handleTokenRequest(req);
}

export async function GET(req: NextRequest) {
  return handleTokenRequest(req);
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-agent-bypass',
    },
  });
}

async function handleTokenRequest(req: NextRequest) {
  console.log('LiveKit dispatch/token endpoint called', { url: req.url });
  
  // To debug the incoming request, log query parameters
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  console.log('Token request query params:', queryParams);
  
  // Check authentication
  const session = await getServerSession(authOptions);
  
  // Get bypass token from header
  const bypassToken = req.headers.get('x-agent-bypass');
  
  // Check auth status using helper function  
  const bypassAuth = process.env.NODE_ENV === 'development' || verifyAgentBypass(bypassToken);
  
  // Skip authentication check if bypassed or in development
  if (!bypassAuth && !session?.user?.id) {
    console.error('Authentication required but user not found in session and bypass token invalid');
    return NextResponse.json({ 
      error: 'Unauthorized',
      details: 'Authentication required. Please login or provide bypass token.',
    }, { status: 401 });
  }

  try {
    // Get request parameters - try multiple sources
    let requestData: { room?: string, identity?: string } = {};
    
    // 1. Check URL query parameters first (most common for GET requests)
    const url = new URL(req.url);
    const roomParam = url.searchParams.get('room');
    const identityParam = url.searchParams.get('identity') || url.searchParams.get('username');
    
    if (roomParam) requestData.room = roomParam;
    if (identityParam) requestData.identity = identityParam;
    
    // 2. If no room found in query params and this is a POST request, try the body
    if (!requestData.room && req.method === 'POST') {
      try {
        const bodyData = await req.json();
        if (bodyData.room) requestData.room = bodyData.room;
        if (bodyData.identity) requestData.identity = bodyData.identity;
      } catch (error) {
        console.log('No JSON body or invalid JSON in request');
      }
    }
    
    console.log('Extracted request data:', requestData);
    
    const { room, identity } = requestData;
    
    // Validate room parameter
    if (!room) {
      return NextResponse.json(
        { error: 'Room name is required (use ?room=YOUR_ROOM_NAME in the URL)' },
        { status: 400 }
      );
    }

    // Use session user ID as default identity if available
    const effectiveIdentity = identity || session?.user?.id || `user-${Date.now()}`;
    
    // Get environment variables with alternates
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || process.env.LIVEKIT_ENDPOINT || process.env.NEXT_PUBLIC_LIVEKIT_URL || '');
    
    // Ensure URL has the correct wss:// protocol for WebSockets
    if (livekitUrl) {
      if (livekitUrl.startsWith('http://')) {
        livekitUrl = livekitUrl.replace('http://', 'ws://');
      } else if (livekitUrl.startsWith('https://')) {
        livekitUrl = livekitUrl.replace('https://', 'wss://');
      } else if (!livekitUrl.startsWith('wss://') && !livekitUrl.startsWith('ws://')) {
        livekitUrl = `wss://${livekitUrl}`;
      }
      console.log('LiveKit URL formatted for WebSocket:', livekitUrl);
    }
    
    console.log(`LiveKit token using - API Key: ${apiKey ? apiKey.substring(0, 4) + '...' : 'MISSING'}, Secret length: ${apiSecret.length || 'MISSING'}, URL: ${livekitUrl || 'MISSING'}`);

    // Handle missing LiveKit config more gracefully
    if (!apiKey || !apiSecret || !livekitUrl) {
      const missingVars = [];
      if (!apiKey) missingVars.push('API Key');
      if (!apiSecret) missingVars.push('API Secret');
      if (!livekitUrl) missingVars.push('LiveKit URL');
      
      console.error(`LiveKit configuration incomplete: ${missingVars.join(', ')}`);
      
      // In development or with bypass, provide a mock token as a last resort
      if (process.env.NODE_ENV === 'development' || bypassAuth) {
        console.log('Providing mock token for development/bypass mode');
        const mockToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        const mockUrl = 'wss://mock.livekit.cloud';
        
        return NextResponse.json({ 
          token: mockToken, 
          url: mockUrl,
          room,
          identity: effectiveIdentity,
          isMock: true
        });
      }
      
      return NextResponse.json(
        { 
          error: 'LiveKit configuration incomplete',
          details: `Missing: ${missingVars.join(', ')}`
        },
        { status: 500 }
      );
    }

    // Create token with appropriate grants
    const at = new AccessToken(apiKey, apiSecret, {
      identity: effectiveIdentity,
      ttl: 3600 * 6, // 6 hours
    });

    at.addGrant({ 
      roomJoin: true, 
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Generate token
    const token = at.toJwt();
    const tokenFirstChars = token ? token.substring(0, 20) + '...' : 'undefined';
    console.log(`Generated LiveKit token for ${effectiveIdentity} in room ${room}: ${tokenFirstChars}`);
    
    // Log URL format to ensure it's correct for WebSocket connection
    console.log(`Returning LiveKit URL: ${livekitUrl}`);
    
    return NextResponse.json({ 
      token, 
      url: livekitUrl,
      room,
      identity: effectiveIdentity 
    });
  } catch (error: any) {
    console.error('Error generating LiveKit token:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate token',
        details: error.message
      },
      { status: 500 }
    );
  }
} 