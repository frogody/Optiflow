import { AccessToken, RoomServiceClient, AgentDispatchClient } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get configuration from environment variables
  const apiKey = process.env.LIVEKIT_API_KEY!;
  const apiSecret = process.env.LIVEKIT_API_SECRET!;
  const livekitUrl = process.env.LIVEKIT_URL!;

  if (!apiKey || !apiSecret || !livekitUrl) {
    return NextResponse.json(
      { error: 'LiveKit env vars not set' },
      { status: 500 }
    );
  }

  try {
    const { roomName = 'optiflow-jarvis-room', metadata } = await req.json();
    const userId = session.user.id;

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
        maxParticipants: 5, // User + agent + room for growth
      });
    }

    // Initialize agent dispatch client
    const agentDispatchClient = new AgentDispatchClient(livekitUrl, apiKey, apiSecret);

    // Create identity for agent
    const agentIdentity = `agent-jarvis-${Date.now()}`;

    // Dispatch agent to room
    console.log(`Dispatching agent ${agentIdentity} to room ${roomName}`);
    
    // Adjusted to use createDispatch and its expected parameters
    const dispatch = await agentDispatchClient.createDispatch(
        roomName, 
        'Jarvis', // Assuming 'Jarvis' is the registered agent_name 
        {
            metadata: JSON.stringify({ userId, ...(metadata || {}) }), // Pass userId and any other metadata
            // participantIdentity: userIdentity, // If needed by your agent worker options
        }
    );

    return NextResponse.json({
      success: true,
      message: 'Agent dispatched successfully',
      roomName,
      agentIdentity,
      dispatchId: dispatch.id, // Return dispatch ID
    });
  } catch (error: any) {
    console.error('Error dispatching agent:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch agent: ' + error.message },
      { status: 500 }
    );
  }
} 