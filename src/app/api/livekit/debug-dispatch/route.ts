import { AgentDispatchClient, RoomServiceClient } from 'livekit-server-sdk';
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

export async function POST(req: NextRequest) {
  try {
    const { roomName = 'debug-room-' + Date.now() } = await req.json();
    
    // Get environment variables
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');
    
    // Ensure URL uses HTTPS format to avoid TLD errors
    if (livekitUrl.startsWith('wss://')) {
      livekitUrl = livekitUrl.replace('wss://', 'https://');
      console.log('Converted LiveKit URL from WSS to HTTPS format');
    }

    console.log(`Debug dispatch using - API Key: ${apiKey}, Secret length: ${apiSecret.length}, URL: ${livekitUrl}`);

    if (!apiKey || !apiSecret || !livekitUrl) {
      console.error('LiveKit environment variables are not set properly');
      return NextResponse.json(
        { error: 'LiveKit env vars not set' },
        { status: 500 }
      );
    }

    // Create room service client
    const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);

    // Ensure the room exists
    try {
      await roomService.getRoom(roomName);
      console.log(`Room ${roomName} exists, proceeding with agent dispatch`);
    } catch (error) {
      // Room doesn't exist, create it
      console.log(`Creating room ${roomName}`);
      await roomService.createRoom({
        name: roomName,
        emptyTimeout: 5 * 60, // 5 minutes
        maxParticipants: 10,
      });
    }

    // Initialize agent dispatch client
    const agentDispatchClient = new AgentDispatchClient(livekitUrl, apiKey, apiSecret);

    // Create identity for agent
    const agentIdentity = `agent-debug-${Date.now()}`;

    // Dispatch agent to room
    console.log(`Dispatching agent ${agentIdentity} to room ${roomName}`);
    const dispatch = await agentDispatchClient.createDispatch(
      roomName,
      'Jarvis', // Assuming 'Jarvis' is the registered agent_name
      {
        metadata: JSON.stringify({
          debug: true,
          timestamp: new Date().toISOString()
        }),
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Debug agent dispatched successfully',
      roomName,
      agentIdentity,
      dispatchId: dispatch.id,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error dispatching debug agent:', error);
    return NextResponse.json(
      { 
        error: 'Failed to dispatch agent',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 