import { NextRequest, NextResponse } from 'next/server';

// Helper function to strip quotes from environment variables
function cleanEnvVar(value: string | undefined): string {
  if (!value) return '';
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1);
  }
  return value;
}

// Function to mask sensitive values
function maskValue(key: string, value: string): string {
  if (!value) return '';
  
  // Mask secrets and keys
  if (key.includes('KEY') || key.includes('SECRET') || key.includes('TOKEN')) {
    if (value.length <= 8) return '********';
    return value.substring(0, 4) + '...' + value.substring(value.length - 4);
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
    // Check LiveKit environment variables
    const livekitApiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const livekitApiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');
    
    // Check URL format
    let livekitUrlFormatted = livekitUrl;
    if (livekitUrl.startsWith('wss://')) {
      livekitUrlFormatted = livekitUrl.replace('wss://', 'https://');
    }

    // Prepare environment data for client
    const environmentData = {
      NODE_ENV: process.env.NODE_ENV,
      LIVEKIT_API_KEY: maskValue('LIVEKIT_API_KEY', livekitApiKey),
      LIVEKIT_API_SECRET: maskValue('LIVEKIT_API_SECRET', livekitApiSecret),
      LIVEKIT_URL: livekitUrl,
      LIVEKIT_URL_FORMATTED: livekitUrlFormatted,
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      VERCEL_URL: process.env.VERCEL_URL || 'not set',
      DEBUG_AGENTS: process.env.DEBUG_AGENTS || 'not set',
    };

    // Check if all required variables are set
    const isConfigValid = 
      livekitApiKey && 
      livekitApiSecret && 
      livekitUrl;

    return NextResponse.json({
      success: true,
      environment: environmentData,
      isConfigValid,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking environment variables:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
