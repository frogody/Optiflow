import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { userId, participant, agent, action, metadata } = await req.json().catch(() => ({}));
  const targetUserId = userId || session.user.id;
  let userRoom = await prisma.userRoom.findUnique({ where: { userId: targetUserId } });
  if (!userRoom) {
    const roomName = `user-${targetUserId}-${Date.now()}`;
    userRoom = await prisma.userRoom.create({
      data: {
        userId: targetUserId,
        roomName,
        metadata: metadata || {},
        participants: participant ? [participant] : [],
        agents: agent ? [agent] : [],
        sessionHistory: action ? [action] : []
      }
    });
  } else {
    // Update participants
    const participants = Array.isArray(userRoom.participants) ? userRoom.participants : [];
    if (participant) {
      // Add if not already present
      if (!participants.find((p: any) => p.id === participant.id)) {
        participants.push(participant);
      }
    }
    // Update agents
    const agents = Array.isArray(userRoom.agents) ? userRoom.agents : [];
    if (agent) {
      if (!agents.find((a: any) => a.id === agent.id)) {
        agents.push(agent);
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
      where: { userId: targetUserId },
      data: {
        participants,
        agents,
        sessionHistory,
        metadata: newMetadata
      }
    });
  }
  return NextResponse.json({
    roomName: userRoom.roomName,
    participants: userRoom.participants,
    agents: userRoom.agents,
    sessionHistory: userRoom.sessionHistory,
    metadata: userRoom.metadata
  });
} 