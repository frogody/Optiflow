import { AccessToken, RoomServiceClient, AgentDispatchClient } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

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
    const body = await req.json();
    // Allow agents/integrations to specify a userId to dispatch to that user's room
    const targetUserId = body.userId || session.user.id;
    const metadata = body.metadata;
    const agent = body.agent; // { id, capabilities, joinedAt }
    const action = body.action; // { actor, action, timestamp }
    // Find or create a persistent room for this user
    let userRoom = await prisma.userRoom.findUnique({ where: { userId: targetUserId } });
    if (!userRoom) {
      const roomName = `user-${targetUserId}-${Date.now()}`;
      userRoom = await prisma.userRoom.create({
        data: {
          userId: targetUserId,
          roomName,
          metadata: metadata || {},
          agents: agent ? [agent] : [],
          sessionHistory: action ? [action] : []
        }
      });
    } else {
      // Update agents
      let agents = Array.isArray(userRoom.agents) ? userRoom.agents : [];
      if (agent) {
        if (!agents.find((a: any) => a.id === agent.id)) {
          agents.push(agent);
        }
      }
      // Update sessionHistory
      let sessionHistory = Array.isArray(userRoom.sessionHistory) ? userRoom.sessionHistory : [];
      if (action) {
        sessionHistory.push(action);
      }
      // Merge metadata
      let newMetadata = metadata ? { ...(userRoom.metadata || {}), ...metadata } : userRoom.metadata;
      userRoom = await prisma.userRoom.update({
        where: { userId: targetUserId },
        data: {
          agents,
          sessionHistory,
          metadata: newMetadata
        }
      });
    }
    const roomName = userRoom.roomName;

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
        maxParticipants: 10, // Multi-user + multi-agent
      });
    }

    // Initialize agent dispatch client
    const agentDispatchClient = new AgentDispatchClient(livekitUrl, apiKey, apiSecret);

    // Create identity for agent if not provided
    const agentIdentity = agent?.id || `agent-jarvis-${Date.now()}`;

    // Dispatch agent to room
    console.log(`Dispatching agent ${agentIdentity} to room ${roomName}`);
    const dispatch = await agentDispatchClient.createDispatch(
      roomName,
      'Jarvis', // Assuming 'Jarvis' is the registered agent_name
      {
        metadata: JSON.stringify({ userId: targetUserId, ...(metadata || {}) }),
      }
    );

    // Register agent if not already present
    let dbAgent = null;
    if (agent) {
      dbAgent = await prisma.agent.upsert({
        where: { identity: agent.id },
        update: { name: agent.name || agent.id, capabilities: agent.capabilities || [] },
        create: {
          identity: agent.id,
          name: agent.name || agent.id,
          capabilities: agent.capabilities || [],
        },
      });
      // Assign agent to room
      await prisma.orchestratorAssignment.upsert({
        where: { agentId_roomId: { agentId: dbAgent.id, roomId: userRoom.id } },
        update: { role: agent.role || 'assistant' },
        create: {
          agentId: dbAgent.id,
          roomId: userRoom.id,
          role: agent.role || 'assistant',
        },
      });
    }

    // Return orchestrator and agent assignments
    const assignments = await prisma.orchestratorAssignment.findMany({ where: { roomId: userRoom.id }, include: { agent: true } });
    return NextResponse.json({
      success: true,
      message: 'Agent dispatched successfully',
      roomName,
      agentIdentity,
      dispatchId: dispatch.id,
      agents: userRoom.agents,
      sessionHistory: userRoom.sessionHistory,
      metadata: userRoom.metadata,
      assignments,
    });
  } catch (error: any) {
    console.error('Error dispatching agent:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch agent: ' + error.message },
      { status: 500 }
    );
  }
} 