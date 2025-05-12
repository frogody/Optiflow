import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to strip quotes from environment variables
function cleanEnvVar(value: string | undefined): string {
  if (!value) return '';
  // Remove surrounding quotes if present
  return value.replace(/^["'](.*)["']$/, '$1');
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { metadata, participant, action } = await req.json().catch(() => ({}));
  // Find or create a persistent room for this user
  let userRoom = await prisma.userRoom.findUnique({ where: { userId } });
  if (!userRoom) {
    const roomName = `user-${userId}-${Date.now()}`;
    userRoom = await prisma.userRoom.create({
      data: {
        userId,
        roomName,
        metadata: metadata || {},
        participants: participant ? [participant] : [],
        sessionHistory: action ? [action] : []
      }
    });
  } else {
    // Update participants
    const participants = Array.isArray(userRoom.participants) ? userRoom.participants : [];
    if (participant) {
      if (!participants.find((p: any) => p.id === participant.id)) {
        participants.push(participant);
      }
    }
    // Update sessionHistory
    const sessionHistory = Array.isArray(userRoom.sessionHistory) ? userRoom.sessionHistory : [];
    if (action) {
      sessionHistory.push(action);
    }
    // Merge metadata
    const newMetadata = metadata ? { ...(userRoom.metadata || {}), ...metadata } : userRoom.metadata;
    userRoom = await prisma.userRoom.update({
      where: { userId },
      data: {
        participants,
        sessionHistory,
        metadata: newMetadata
      }
    });
  }
  const room = userRoom.roomName;

  // Clean environment variables to remove any quotes
  const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY);
  const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET);
  const livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL);

  if (!apiKey || !apiSecret || !livekitUrl) {
    return NextResponse.json(
      { error: 'LiveKit env vars not set' },
      { status: 500 }
    );
  }

  console.log(`Creating token for room: ${room} with key length: ${apiKey.length} and secret length: ${apiSecret.length}`);
  
  const at = new AccessToken(apiKey, apiSecret, {
    identity: userId,
    ttl: 60 * 60, // 1 hour
  });
  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json({
    token: at.toJwt(),
    url: livekitUrl,
    room,
    participants: userRoom.participants,
    sessionHistory: userRoom.sessionHistory,
    metadata: userRoom.metadata
  });
}
