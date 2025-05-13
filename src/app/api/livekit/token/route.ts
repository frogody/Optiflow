import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { metadata, participant, action, room: requestedRoom } = await req.json().catch(() => ({}));
  
  // Find or create a persistent room for this user
  let userRoom = await prisma.userRoom.findUnique({ where: { userId } });
  if (!userRoom) {
    const roomName = requestedRoom || `user-${userId}-${Date.now()}`;
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

  // Get environment variables and clean them properly - simplified approach
  const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
  const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
  let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');

  // Ensure URL uses HTTPS format to avoid TLD errors
  if (livekitUrl.startsWith('wss://')) {
    livekitUrl = livekitUrl.replace('wss://', 'https://');
    console.log('Converted LiveKit URL from WSS to HTTPS format');
  }

  console.log(`LiveKit variables - API Key: ${apiKey ? apiKey.substring(0, 4) + '...' : 'MISSING'}, Secret length: ${apiSecret.length || 'MISSING'}, URL: ${livekitUrl || 'MISSING'}`);

  if (!apiKey || !apiSecret || !livekitUrl) {
    const missingVars = [];
    if (!apiKey) missingVars.push('LIVEKIT_API_KEY');
    if (!apiSecret) missingVars.push('LIVEKIT_API_SECRET');
    if (!livekitUrl) missingVars.push('LIVEKIT_URL');
    
    console.error(`LiveKit environment variables not set: ${missingVars.join(', ')}`);
    return NextResponse.json(
      { 
        error: 'LiveKit env vars not set',
        details: `Missing environment variables: ${missingVars.join(', ')}`
      },
      { status: 500 }
    );
  }

  try {
    // Create and configure the token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      ttl: 3 * 60 * 60, // 3 hours (increased from 1 hour)
      name: 'User token',
    });
    
    at.addGrant({ 
      room, 
      roomJoin: true, 
      canPublish: true, 
      canSubscribe: true,
      canPublishData: true
    });
    
    // Generate the JWT token with await
    const token = await at.toJwt();
    console.log(`Generated token for room: ${room}, token length: ${token.length}`);
    
    return NextResponse.json({
      token,
      url: livekitUrl,
      room,
      participants: userRoom.participants,
      sessionHistory: userRoom.sessionHistory,
      metadata: userRoom.metadata
    });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    return NextResponse.json(
      { error: 'Failed to generate LiveKit token: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
