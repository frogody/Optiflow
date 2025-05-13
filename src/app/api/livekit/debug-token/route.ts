import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

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
  try {
    // Extract parameters from request 
    const params = await req.json().catch(() => ({}));
    const { room = 'test-room', userId = 'test-user-' + Date.now() } = params;
    
    console.log(`Debug token requested for room: ${room}, userId: ${userId}`);
    
    // Get environment variables and clean them properly
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');
    
    // Ensure URL uses HTTPS format to avoid TLD errors
    if (livekitUrl.startsWith('wss://')) {
      livekitUrl = livekitUrl.replace('wss://', 'https://');
      console.log('Converted LiveKit URL from WSS to HTTPS format');
    }

    console.log(`Debug token endpoint - LiveKit variables - API Key: ${apiKey ? apiKey.substring(0, 4) + '...' : 'MISSING'}, Secret length: ${apiSecret.length || 'MISSING'}, URL: ${livekitUrl || 'MISSING'}`);

    // Check for missing environment variables
    if (!apiKey || !apiSecret || !livekitUrl) {
      const missingVars = [];
      if (!apiKey) missingVars.push('LIVEKIT_API_KEY');
      if (!apiSecret) missingVars.push('LIVEKIT_API_SECRET');
      if (!livekitUrl) missingVars.push('LIVEKIT_URL');
      
      console.error(`LiveKit environment variables not set: ${missingVars.join(', ')}`);
      return NextResponse.json(
        { 
          error: 'LiveKit env vars not set',
          details: `Missing environment variables: ${missingVars.join(', ')}`
        },
        { status: 500 }
      );
    }

    // Create and configure the token
    try {
      const at = new AccessToken(apiKey, apiSecret, {
        identity: userId,
        ttl: 3 * 60 * 60, // 3 hours (increased from 1 hour)
        name: 'Debug token',
      });
      
      at.addGrant({ 
        room, 
        roomJoin: true, 
        canPublish: true, 
        canSubscribe: true,
        canPublishData: true,
        // Add additional permissions that might help with connectivity
        roomAdmin: process.env.NODE_ENV === 'development', // Allow admin capabilities in dev
      });
      
      // Generate the JWT token
      const token = await at.toJwt();
      console.log(`Generated debug token for room: ${room}, token length: ${token.length}`);
      
      return NextResponse.json({
        token,
        url: livekitUrl,
        room,
        userId,
        debug: true,
        timestamp: new Date().toISOString(),
        // Additional debugging info
        urlFormat: livekitUrl.startsWith('https://') ? 'https' : (livekitUrl.startsWith('wss://') ? 'wss' : 'other'),
        apiKeyValid: apiKey.length > 0,
        apiSecretValid: apiSecret.length > 0,
      });
    } catch (tokenError) {
      console.error('Error generating LiveKit token:', tokenError);
      return NextResponse.json(
        { 
          error: 'Failed to generate LiveKit token',
          details: tokenError instanceof Error ? tokenError.message : String(tokenError),
          code: 'TOKEN_GENERATION_ERROR'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in debug token endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate LiveKit token',
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null,
        code: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
} 