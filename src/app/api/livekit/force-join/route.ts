import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { AgentDispatchClient } from 'livekit-server-sdk';

import { authOptions } from '@/lib/auth';
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
  console.log('Force-join endpoint called');
  
  // Check authentication
  const session = await getServerSession(authOptions);

  // Allow connections without authentication in development OR if the request contains a special bypass token
  const bypassAuth = process.env.NODE_ENV === 'development' || req.headers.get('x-agent-bypass') === process.env.AGENT_BYPASS_SECRET;

  // Skip authentication check in development mode
  if (!bypassAuth && !session?.user?.id) {
    console.error('Authentication required but user not found in session');
    return NextResponse.json({ 
      error: 'Unauthorized',
      details: 'Authentication required. Please login or provide bypass token.',
    }, { status: 401 });
  }

  // Use anonymous ID if no session available but auth is bypassed
  const effectiveUserId = (session?.user?.id || `anon-${Date.now()}`);

  try {
    const body = await req.json();
    let { roomName } = body;
    
    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    console.log(`Processing force-join for room: ${roomName}`);

    // Get environment variables
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');

    // Ensure URL uses HTTPS format to avoid TLD errors
    if (livekitUrl.startsWith('wss://')) {
      livekitUrl = livekitUrl.replace('wss://', 'https://');
      console.log('Converted LiveKit URL from WSS to HTTPS format');
    }

    console.log(`LiveKit force-join - API Key: ${apiKey ? apiKey.substring(0, 4) + '...' : 'MISSING'}, Secret length: ${apiSecret.length || 'MISSING'}, URL: ${livekitUrl || 'MISSING'}`);

    if (!apiKey || !apiSecret || !livekitUrl) {
      const missingVars = [];
      if (!apiKey) missingVars.push('LIVEKIT_API_KEY');
      if (!apiSecret) missingVars.push('LIVEKIT_API_SECRET');
      if (!livekitUrl) missingVars.push('LIVEKIT_URL');
      
      console.error(`LiveKit environment variables not set: ${missingVars.join(', ')}`);
      return NextResponse.json(
        { 
          error: 'LiveKit configuration is not available',
          details: `Missing environment variables: ${missingVars.join(', ')}`
        },
        { status: 500 }
      );
    }

    console.log('Initializing LiveKit AgentDispatchClient');
    const agentDispatchClient = new AgentDispatchClient(livekitUrl, apiKey, apiSecret);

    // Create a unique agent identity for this force-join
    const agentIdentity = `agent-jarvis-force-${Date.now()}`;

    // Retrieve memory context for this user
    console.log(`Retrieving memory context for user: ${effectiveUserId}`);
    let memoryContext = [];
    try {
      const memories = await memoryService.getAll('user', effectiveUserId);
      if (memories && Array.isArray(memories)) {
        // Limit to most recent 10 memories to keep context manageable
        memoryContext = memories.slice(-10);
        console.log(`Retrieved ${memoryContext.length} memory items for user`);
      }
    } catch (memoryError) {
      console.error('Failed to retrieve memories:', memoryError);
      // Continue even if memory retrieval fails
    }

    // Try to get existing room to check if it exists
    try {
      const userRoom = await prisma.userRoom.findFirst({
        where: { roomName }
      });

      if (!userRoom) {
        console.log(`Room ${roomName} not found in database, creating new room entry`);
        await prisma.userRoom.create({
          data: {
            userId: effectiveUserId,
            roomName,
            metadata: { forcedJoin: true, joinedAt: new Date().toISOString() }
          }
        });
      }
    } catch (dbError) {
      console.error('Database error checking for room:', dbError);
      // Continue anyway - this is just for tracking
    }

    // Dispatch agent to room with memory context
    console.log(`Forcefully dispatching agent ${agentIdentity} to room ${roomName} with memory context`);
    const dispatch = await agentDispatchClient.createDispatch(
      roomName,
      'Jarvis', // The registered agent name
      {
        metadata: JSON.stringify({ 
          userId: effectiveUserId,
          forcedJoin: true,
          joinedAt: new Date().toISOString(),
          memoryContext,
          mem0Enabled: true
        }),
      }
    );

    console.log('Force dispatch successful:', dispatch.id);
    
    return NextResponse.json({
      success: true,
      message: 'Agent dispatched successfully with memory integration',
      roomName,
      agentIdentity,
      dispatchId: dispatch.id,
      timestamp: new Date().toISOString(),
      memoryEnabled: true,
      memoryItemsCount: memoryContext.length
    });
  } catch (error: any) {
    console.error('Error in force-join endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to force agent to join',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
} 