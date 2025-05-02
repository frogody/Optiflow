import { RoomServiceClient } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      return NextResponse.json(
        { error: 'LiveKit configuration missing' },
        { status: 500 }
      );
    }

    // Create a new room service client
    const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);

    // Create a new room for the agent
    const room = await roomService.createRoom({
      name: `agent-${Date.now()}`,
      emptyTimeout: 10 * 60, // 10 minutes
      maxParticipants: 2, // Agent and user
    });

    return NextResponse.json({ 
      status: 'Room created successfully',
      room: room.name
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
} 