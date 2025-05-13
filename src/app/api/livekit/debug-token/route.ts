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
    const { room = 'test-room', userId = 'test-user-' + Date.now() } = await req.json();
    
    // Get environment variables and clean them properly
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');
    
    // Ensure URL uses HTTPS format to avoid TLD errors
    if (livekitUrl.startsWith('wss://')) {
      livekitUrl = livekitUrl.replace('wss://', 'https://');
      console.log('Converted LiveKit URL from WSS to HTTPS format');
    }

    console.log(`Debug token endpoint - LiveKit variables - API Key: ${apiKey}, Secret length: ${apiSecret.length}, URL: ${livekitUrl}`);

    if (!apiKey || !apiSecret || !livekitUrl) {
      console.error('LiveKit environment variables are not set properly');
      return NextResponse.json(
        { error: 'LiveKit env vars not set' },
        { status: 500 }
      );
    }

    // Create and configure the token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      ttl: 60 * 60, // 1 hour
    });
    
    at.addGrant({ 
      room, 
      roomJoin: true, 
      canPublish: true, 
      canSubscribe: true 
    });
    
    // Generate the JWT token
    const token = await at.toJwt();
    console.log(`Generated debug token for room: ${room}, token length: ${token.length}`);
    
    return NextResponse.json({
      token,
      url: livekitUrl,
      room,
      debug: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating debug LiveKit token:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate LiveKit token',
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null
      },
      { status: 500 }
    );
  }
} 