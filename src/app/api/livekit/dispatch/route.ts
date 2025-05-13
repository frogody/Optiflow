import { AccessToken, RoomServiceClient, AgentDispatchClient } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Mem0MemoryService } from '@/services/Mem0MemoryService';

// Initialize Mem0 memory service
const memoryService = new Mem0MemoryService();

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
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get environment variables - simplified approach
  const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
  const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
  let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');

  // Ensure URL uses HTTPS format to avoid TLD errors
  if (livekitUrl.startsWith('wss://')) {
    livekitUrl = livekitUrl.replace('wss://', 'https://');
    console.log('Converted LiveKit URL from WSS to HTTPS format');
  }

  console.log(`LiveKit dispatch using - API Key: ${apiKey ? apiKey.substring(0, 4) + '...' : 'MISSING'}, Secret length: ${apiSecret.length || 'MISSING'}, URL: ${livekitUrl || 'MISSING'}`);

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
    const body = await req.json();
    
    // Allow agents/integrations to specify a userId to dispatch to that user's room
    const targetUserId = body.userId || session.user.id;
    const roomName = body.roomName; // Allow specifying room name directly
    const metadata = body.metadata || {};
    const agent = body.agent; // { id, capabilities, joinedAt }
    const action = body.action; // { actor, action, timestamp }
    
    // Retrieve memory context for this user to inject into agent
    console.log(`Retrieving memory context for user: ${targetUserId}`);
    let memoryContext = [];
    try {
      const memories = await memoryService.getAll('user', targetUserId);
      if (memories && Array.isArray(memories)) {
        // Limit to most recent 10 memories to keep context manageable
        memoryContext = memories.slice(-10);
        console.log(`Retrieved ${memoryContext.length} memory items for user`);
      }
    } catch (memoryError) {
      console.error('Failed to retrieve memories:', memoryError);
      // Continue even if memory retrieval fails
    }
    
    // Enhance metadata with memory context
    const enhancedMetadata = {
      ...metadata,
      memoryContext,
      mem0Enabled: true,
      userId: targetUserId,
    };
    
    // Find or create a persistent room for this user
    let userRoom = await prisma.userRoom.findUnique({ where: { userId: targetUserId } });
    
    if (!userRoom) {
      const newRoomName = roomName || `user-${targetUserId}-${Date.now()}`;
      userRoom = await prisma.userRoom.create({
        data: {
          userId: targetUserId,
          roomName: newRoomName,
          metadata: metadata || {},
          agents: agent ? [agent] : [],
          sessionHistory: action ? [action] : []
        }
      });
    } else {
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
          agents,
          sessionHistory,
          metadata: newMetadata
        }
      });
    }
    const finalRoomName = userRoom.roomName;

    // Create room service client
    const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);

    // Ensure the room exists
    try {
      await roomService.getRoom(finalRoomName);
      console.log(`Room ${finalRoomName} exists, proceeding with agent dispatch`);
    } catch (error) {
      // Room doesn't exist, create it
      console.log(`Creating room ${finalRoomName}`);
      await roomService.createRoom({
        name: finalRoomName,
        emptyTimeout: 5 * 60, // 5 minutes
        maxParticipants: 10, // Multi-user + multi-agent
      });
    }

    // Initialize agent dispatch client
    const agentDispatchClient = new AgentDispatchClient(livekitUrl, apiKey, apiSecret);

    // Create identity for agent if not provided
    const agentIdentity = agent?.id || `agent-jarvis-${Date.now()}`;

    // Dispatch agent to room with enhanced metadata including memory context
    console.log(`Dispatching agent ${agentIdentity} to room ${finalRoomName} with memory context`);
    const dispatch = await agentDispatchClient.createDispatch(
      finalRoomName,
      'Jarvis', // Assuming 'Jarvis' is the registered agent_name
      {
        metadata: JSON.stringify(enhancedMetadata),
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
    const assignments = await prisma.orchestratorAssignment.findMany({ 
      where: { roomId: userRoom.id }, 
      include: { agent: true } 
    });
    
    return NextResponse.json({
      success: true,
      message: 'Agent dispatched successfully with memory integration',
      roomName: finalRoomName,
      agentIdentity,
      dispatchId: dispatch.id,
      agents: userRoom.agents,
      sessionHistory: userRoom.sessionHistory,
      metadata: userRoom.metadata,
      assignments,
      memoryEnabled: true,
      memoryItemsCount: memoryContext.length,
    });
  } catch (error: any) {
    console.error('Error dispatching agent:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch agent: ' + error.message },
      { status: 500 }
    );
  }
} 