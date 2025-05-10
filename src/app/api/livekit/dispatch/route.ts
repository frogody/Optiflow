import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AccessToken } from 'livekit-server-sdk';
import { AgentAPI, RoomServiceClient } from 'livekit-server-sdk';

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
    const { roomName = 'optiflow-jarvis-room' } = await req.json();
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

    // Initialize agent API client
    const agentApi = new AgentAPI(livekitUrl, apiKey, apiSecret);

    // Create identity for agent
    const agentIdentity = `agent-jarvis-${Date.now()}`;

    // Create agent token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: agentIdentity,
      name: 'Jarvis',
    });
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Dispatch agent to room
    console.log(`Dispatching agent ${agentIdentity} to room ${roomName}`);
    
    // Determine the user's identity that the agent will be serving
    const userIdentity = userId;

    // Dispatch agent - the LiveKit agent service will handle this
    const result = await agentApi.startAgent({
      agentId: agentIdentity,
      agentName: 'Jarvis',
      roomName: roomName,
      identity: agentIdentity,
      roomToken: at.toJwt(),
      participantId: userIdentity, // Target user's identity
    });

    return NextResponse.json({
      success: true,
      message: 'Agent dispatched successfully',
      roomName,
      agentIdentity,
    });
  } catch (error: any) {
    console.error('Error dispatching agent:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch agent: ' + error.message },
      { status: 500 }
    );
  }
} 