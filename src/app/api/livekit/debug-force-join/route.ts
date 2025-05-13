import { NextRequest, NextResponse } from 'next/server';
import { AgentDispatchClient } from 'livekit-server-sdk';

// Helper function to strip quotes from environment variables
function cleanEnvVar(value: string | undefined): string {
  if (!value) return '';
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1);
  }
  return value;
}

export async function POST(req: NextRequest) {
  console.log('Debug force-join endpoint called');
  
  try {
    const body = await req.json();
    let { roomName } = body;
    
    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    console.log(`Processing debug force-join for room: ${roomName}`);

    // Get environment variables
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    const livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');

    if (!apiKey || !apiSecret || !livekitUrl) {
      console.error('LiveKit environment variables not set');
      return NextResponse.json(
        { error: 'LiveKit configuration is not available' },
        { status: 500 }
      );
    }

    console.log('Initializing LiveKit AgentDispatchClient');
    const agentDispatchClient = new AgentDispatchClient(livekitUrl, apiKey, apiSecret);

    // Create a unique agent identity for this force-join
    const agentIdentity = `agent-jarvis-force-${Date.now()}`;

    // Dispatch agent to room 
    console.log(`Forcefully dispatching agent ${agentIdentity} to room ${roomName}`);
    const dispatch = await agentDispatchClient.createDispatch(
      roomName,
      'Jarvis', // The registered agent name
      {
        metadata: JSON.stringify({ 
          forcedJoin: true,
          debug: true,
          joinedAt: new Date().toISOString()
        }),
      }
    );

    console.log('Debug force dispatch successful:', dispatch.id);
    
    return NextResponse.json({
      success: true,
      message: 'Debug agent forcefully dispatched successfully',
      roomName,
      agentIdentity,
      dispatchId: dispatch.id,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in debug force-join endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to force agent to join',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
} 