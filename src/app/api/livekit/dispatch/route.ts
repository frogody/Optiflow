import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions, verifyAgentBypass } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Mem0MemoryService } from '@/services/Mem0MemoryService';

// Initialize Mem0 memory service
const memoryService = new Mem0MemoryService();

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
  // Check authentication
  const session = await getServerSession(authOptions);
  
  // Get bypass token from header
  const bypassToken = req.headers.get('x-agent-bypass');
  
  // Check auth status using helper function
  const bypassAuth = process.env.NODE_ENV === 'development' || verifyAgentBypass(bypassToken);
  
  console.log('Auth check:', { 
    isDev: process.env.NODE_ENV === 'development',
    hasSession: !!session?.user?.id,
    bypassToken: bypassToken ? 'present' : 'missing',
    bypassResult: bypassAuth
  });

  // Skip authentication check if bypassed or in development
  if (!bypassAuth && !session?.user?.id) {
    console.error('Authentication required but user not found in session and bypass token invalid');
    return NextResponse.json({ 
      error: 'Unauthorized',
      details: 'Authentication required. Please login or provide bypass token.',
    }, { status: 401 });
  }

  // Use anonymous ID if no session available but auth is bypassed
  const effectiveUserId = (session?.user?.id || `anon-${Date.now()}`);

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
    const targetUserId = body.userId || effectiveUserId;
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
    
    // Enhance metadata with memory context and ensure proper agent initialization
    const enhancedMetadata = {
      ...metadata,
      memoryContext,
      mem0Enabled: true,
      userId: targetUserId,
      sessionId: `${finalRoomName}-${Date.now()}`,
      systemPrompt: "You are Jarvis, a friendly AI assistant for Optiflow. Greet users warmly when they join.",
      agentConfig: {
        name: "Jarvis",
        identity: `agent-jarvis-${Date.now()}`,
        autoGreet: true
      }
    };
    
    // Find or create a persistent room for this user
    let userRoom = await prisma.userRoom.findUnique({ where: { userId: targetUserId } });
    
    if (!userRoom) {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 10);
      const newRoomName = roomName || `user-${targetUserId.substring(0, 8)}-${timestamp}-${randomId}`;
      
      try {
        userRoom = await prisma.userRoom.create({
          data: {
            userId: targetUserId,
            roomName: newRoomName,
            metadata: metadata || {},
            agents: agent ? [agent] : [],
            sessionHistory: action ? [action] : []
          }
        });
      } catch (createError) {
        console.error('Error creating user room:', createError);
        // If we hit a unique constraint error, try again with a different name
        if (createError.code === 'P2002') {
          const retryRandomId = Math.random().toString(36).substring(2, 15);
          const retryRoomName = `retry-${timestamp}-${retryRandomId}`;
          console.log(`Room name collision, retrying with name: ${retryRoomName}`);
          
          userRoom = await prisma.userRoom.create({
            data: {
              userId: targetUserId,
              roomName: retryRoomName,
              metadata: metadata || {},
              agents: agent ? [agent] : [],
              sessionHistory: action ? [action] : []
            }
          });
        } else {
          throw createError; // Re-throw if it's not a uniqueness issue
        }
      }
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

    // Direct API call for agent dispatch instead of using AgentDispatchClient
    // This is a workaround for compatibility with livekit-server-sdk v1.2.7
    const agentIdentity = agent?.id || `agent-jarvis-${Date.now()}`;
    
    console.log(`Dispatching agent ${agentIdentity} to room ${finalRoomName} with memory context`);
    
    // Make a direct fetch call to the LiveKit API
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await generateAgentDispatchToken(apiKey, apiSecret)}`
    };
    
    const dispatchResponse = await fetch(`${livekitUrl}/agent/dispatch`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        room_name: finalRoomName,
        agent_name: 'Jarvis',
        metadata: JSON.stringify(enhancedMetadata),
      })
    });
    
    if (!dispatchResponse.ok) {
      const errorText = await dispatchResponse.text();
      throw new Error(`Agent dispatch failed: ${dispatchResponse.status} ${errorText}`);
    }
    
    // Check response content type to determine how to parse it
    const contentType = dispatchResponse.headers.get('content-type');
    let dispatch;
    
    if (contentType && contentType.includes('application/json')) {
      dispatch = await dispatchResponse.json();
    } else {
      // If not JSON, create a simple object with the response text
      const responseText = await dispatchResponse.text();
      console.log(`LiveKit dispatch response (non-JSON): ${responseText}`);
      dispatch = { 
        id: `dispatch-${Date.now()}`,
        status: 'success',
        response: responseText
      };
    }

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
        where: { 
          id: `${dbAgent.id}-${userRoom.id}` // Construct a unique ID
        },
        update: { role: agent.role || 'assistant' },
        create: {
          id: `${dbAgent.id}-${userRoom.id}`,
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
    // Enhanced error logging
    console.error('Error dispatching agent:', error);
    if (error && error.stack) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to dispatch agent: ' + (error.message || error), stack: error && error.stack },
      { status: 500 }
    );
  }
}

// Helper function to generate a JWT token for agent dispatch
async function generateAgentDispatchToken(apiKey: string, apiSecret: string): Promise<string> {
  const token = new AccessToken(apiKey, apiSecret, {
    identity: 'agent-dispatcher',
    name: 'Agent Dispatcher',
  });
  token.addGrant({ 
    roomAdmin: true,
    roomCreate: true,
  });
  return token.toJwt();
} 