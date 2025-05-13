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
  console.log('LiveKit dispatch/token endpoint called');
  
  // Check authentication
  const session = await getServerSession(authOptions);
  
  // Get bypass token from header
  const bypassToken = req.headers.get('x-agent-bypass');
  
  // Check auth status using helper function  
  const bypassAuth = process.env.NODE_ENV === 'development' || verifyAgentBypass(bypassToken);
  
  console.log('Token Auth check:', { 
    isDev: process.env.NODE_ENV === 'development',
    hasSession: !!session?.user?.id,
    bypassToken: bypassToken ? 'present' : 'missing',
    bypassResult: bypassAuth
  });
  
  if (!bypassAuth && !session?.user?.id) {
    console.error('Authentication required but user not found in session and bypass token invalid');
    return NextResponse.json({ 
      error: 'Unauthorized',
      details: 'Authentication required. Please login or provide bypass token.',
    }, { status: 401 });
  }

  try {
    // Get request body (with fallback for GET requests)
    let requestData;
    if (req.method === 'POST') {
      requestData = await req.json().catch(() => ({}));
    } else {
      // Handle GET requests by parsing URL parameters
      const url = new URL(req.url);
      requestData = {
        room: url.searchParams.get('room') || '',
        identity: url.searchParams.get('identity') || ''
      };
    }
    
    const { room, identity } = requestData;
    
    if (!room) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Use session user ID as default identity if available
    const effectiveIdentity = identity || session?.user?.id || `user-${Date.now()}`;
    
    // Get environment variables with alternates
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || process.env.LIVEKIT_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || process.env.LIVEKIT_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || process.env.LIVEKIT_ENDPOINT || process.env.LIVEKIT_WS_URL || '');
    
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
    console.log(`Generated LiveKit token for ${effectiveIdentity} in room ${room}`);
    
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