import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions, verifyAgentBypass } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

export async function POST(req: NextRequest) {
  console.log('LiveKit token endpoint called');
  
  // Check all possible environment variables
  const envVars = {
    LIVEKIT_API_KEY: !!process.env.LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET: !!process.env.LIVEKIT_API_SECRET,
    LIVEKIT_URL: !!process.env.LIVEKIT_URL,
    // Alternate variables
    LIVEKIT_KEY: !!process.env.LIVEKIT_KEY,
    LIVEKIT_SECRET: !!process.env.LIVEKIT_SECRET,
    LIVEKIT_ENDPOINT: !!process.env.LIVEKIT_ENDPOINT,
    // Check other possible LiveKit variables
    LIVEKIT_WS_URL: !!process.env.LIVEKIT_WS_URL,
    LIVEKIT_SERVER: !!process.env.LIVEKIT_SERVER,
    NEXT_PUBLIC_LIVEKIT_URL: !!process.env.NEXT_PUBLIC_LIVEKIT_URL,
    NODE_ENV: process.env.NODE_ENV
  };
  
  console.log('LiveKit environment variables present:', envVars);
  
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
    const { room, identity } = await req.json();
    
    if (!room) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Use session user ID as default identity if available
    const effectiveIdentity = identity || session?.user?.id || `user-${Date.now()}`;
    
    // Get environment variables
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');
    
    // Ensure URL has the correct wss:// protocol
    if (livekitUrl && !livekitUrl.startsWith('wss://')) {
      livekitUrl = livekitUrl.replace(/^http(s?):\/\//, 'wss://');
      console.log('Converted LiveKit URL to WebSocket format:', livekitUrl);
    }
    
    console.log(`LiveKit token using - API Key: ${apiKey ? apiKey.substring(0, 4) + '...' : 'MISSING'}, Secret length: ${apiSecret.length || 'MISSING'}, URL: ${livekitUrl || 'MISSING'}`);

    // Handle missing LiveKit config more gracefully
    if (!apiKey || !apiSecret || !livekitUrl) {
      const missingVars = [];
      if (!apiKey) missingVars.push('LIVEKIT_API_KEY');
      if (!apiSecret) missingVars.push('LIVEKIT_API_SECRET');
      if (!livekitUrl) missingVars.push('LIVEKIT_URL');
      
      console.error(`LiveKit environment variables not set: ${missingVars.join(', ')}`);
      
      // Check environment variables one by one to see if they're in different formats
      const altApiKey = process.env.LIVEKIT_KEY || process.env.LIVEKIT_API_KEY || '';
      const altApiSecret = process.env.LIVEKIT_SECRET || process.env.LIVEKIT_API_SECRET || '';
      const altLivekitUrl = process.env.LIVEKIT_ENDPOINT || process.env.LIVEKIT_URL || '';
      
      // Try with alternative environment variables if available
      if (altApiKey && altApiSecret && altLivekitUrl) {
        console.log('Found alternative LiveKit configuration, using it instead');
        
        // Create token with alternative config
        const at = new AccessToken(
          cleanEnvVar(altApiKey), 
          cleanEnvVar(altApiSecret), 
          {
            identity: effectiveIdentity,
            ttl: 3600 * 6, // 6 hours
          }
        );
        
        at.addGrant({ 
          roomJoin: true, 
          room,
          canPublish: true,
          canSubscribe: true,
          canPublishData: true,
        });
        
        const token = at.toJwt();
        let url = cleanEnvVar(altLivekitUrl);
        
        // Ensure URL has the correct wss:// protocol
        if (url && !url.startsWith('wss://')) {
          url = url.replace(/^http(s?):\/\//, 'wss://');
        }
        
        console.log(`Generated LiveKit token with alternative config for ${effectiveIdentity}`);
        
        return NextResponse.json({ 
          token, 
          url,
          room,
          identity: effectiveIdentity 
        });
      }
      
      // In development or with bypass, provide a mock token only as a last resort
      if (process.env.NODE_ENV === 'development' || bypassAuth) {
        console.log('Providing mock token for development/bypass mode');
        // Create a simple JWT-like string for testing
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
          error: 'LiveKit env vars not set',
          details: `Missing environment variables: ${missingVars.join(', ')}`
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
