import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Environment variables:', {
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    ELEVENLABS_AGENT_ID: process.env.ELEVENLABS_AGENT_ID,
    NODE_ENV: process.env.NODE_ENV
  });

  return NextResponse.json({
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY ? 'Present' : 'Not found',
    elevenlabsAgentId: process.env.ELEVENLABS_AGENT_ID ? 'Present' : 'Not found',
    elevenlabsApiKeyValue: process.env.ELEVENLABS_API_KEY ? process.env.ELEVENLABS_API_KEY.substring(0, 5) + '...' : 'Not available',
    nodeEnv: process.env.NODE_ENV
  });
} 