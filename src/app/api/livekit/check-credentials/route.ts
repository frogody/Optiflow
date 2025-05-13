import { NextRequest, NextResponse } from 'next/server';
import { RoomServiceClient } from 'livekit-server-sdk';

// Helper function to strip quotes from environment variables
function cleanEnvVar(value: string | undefined): string {
  if (!value) return '';
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1);
  }
  return value;
}

export async function GET(req: NextRequest) {
  // Only allow in development mode for security
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ 
      success: false, 
      error: 'This endpoint is only available in development mode' 
    }, { status: 403 });
  }

  try {
    // Get environment variables
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');
    
    // Ensure URL uses HTTPS format to avoid TLD errors
    if (livekitUrl.startsWith('wss://')) {
      livekitUrl = livekitUrl.replace('wss://', 'https://');
      console.log('Converted LiveKit URL from WSS to HTTPS format');
    }

    // Check if all required variables are set
    if (!apiKey || !apiSecret || !livekitUrl) {
      const missingVars = [];
      if (!apiKey) missingVars.push('LIVEKIT_API_KEY');
      if (!apiSecret) missingVars.push('LIVEKIT_API_SECRET');
      if (!livekitUrl) missingVars.push('LIVEKIT_URL');
      
      console.error(`LiveKit environment variables missing: ${missingVars.join(', ')}`);
      return NextResponse.json({ 
        success: false, 
        error: 'Missing LiveKit credentials',
        missingVars 
      }, { status: 400 });
    }

    // Try to create a room service client and list rooms
    const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
    
    try {
      console.log(`Checking LiveKit connectivity with URL: ${livekitUrl}`);
      const response = await roomService.listRooms();
      
      console.log(`Successfully connected to LiveKit, found ${response.length} rooms`);
      return NextResponse.json({
        success: true,
        message: 'LiveKit credentials are valid',
        roomCount: response.length,
        livekitUrl: livekitUrl,
        apiKeyValid: true,
        timestamp: new Date().toISOString()
      });
    } catch (apiError: any) {
      console.error('Error communicating with LiveKit API:', apiError);
      return NextResponse.json({ 
        success: false, 
        error: 'LiveKit API connection failed',
        details: apiError.message,
        livekitUrl,
        apiKey: apiKey ? apiKey.substring(0, 4) + '...' : 'invalid', 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Unexpected error checking LiveKit credentials:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error',
      details: error.message 
    }, { status: 500 });
  }
} 