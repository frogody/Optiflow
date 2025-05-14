import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
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
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1);
  }
  return value;
}

export async function POST(req: NextRequest) {
  console.log('Enhanced force-join endpoint called');
  
  try {
    // Get authentication/session
    const { verifyAgentBypass } = await import('@/lib/auth');
    const session = await getServerSession(authOptions);
    
    // Get bypass token from header
    const bypassToken = req.headers.get('x-agent-bypass');
    
    // Skip auth in development or with valid bypass
    const bypassAuth = process.env.NODE_ENV === 'development' || verifyAgentBypass(bypassToken);
    
    if (!bypassAuth && !session?.user?.id) {
      console.error('Force-join: Auth required but no valid session or bypass token');
      return NextResponse.json({ 
        error: 'Unauthorized access',
        details: 'Valid session or bypass token required'
      }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json();
    const { roomName, metadata = {} } = body;
    
    if (!roomName) {
      return NextResponse.json({
        error: 'Missing room name',
        details: 'Room name is required'
      }, { status: 400 });
    }
    
    // Get environment variables
    const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
    let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');
    
    // Ensure URL uses HTTPS format
    if (livekitUrl.startsWith('wss://')) {
      livekitUrl = livekitUrl.replace('wss://', 'https://');
      console.log('Force-join: Converted LiveKit URL from WSS to HTTPS format');
    }
    
    console.log(`Force-join: Using LiveKit URL: ${livekitUrl}, API key: ${apiKey ? 'present' : 'missing'}, API secret: ${apiSecret ? 'present' : 'missing'}`);
    
    if (!apiKey || !apiSecret || !livekitUrl) {
      const missingVars = [];
      if (!apiKey) missingVars.push('LIVEKIT_API_KEY');
      if (!apiSecret) missingVars.push('LIVEKIT_API_SECRET');
      if (!livekitUrl) missingVars.push('LIVEKIT_URL');
      
      return NextResponse.json({
        error: 'Missing LiveKit configuration',
        details: `Missing: ${missingVars.join(', ')}`
      }, { status: 500 });
    }
    
    // Create room service client and ensure room exists
    const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
    
    try {
      await roomService.getRoom(roomName);
      console.log(`Force-join: Room ${roomName} exists`);
    } catch (error) {
      console.log(`Force-join: Room ${roomName} doesn't exist, creating it`);
      await roomService.createRoom({
        name: roomName,
        emptyTimeout: 5 * 60, // 5 minutes
        maxParticipants: 10,
      });
    }
    
    // Create unique agent identity
    const timestamp = Date.now();
    const agentIdentity = `agent-jarvis-force-${timestamp}`;
    
    // Enhanced metadata for agent
    const enhancedMetadata = {
      ...metadata,
      forcedJoin: true,
      joinedAt: new Date().toISOString(),
      systemPrompt: metadata.systemPrompt || "You are Jarvis, a helpful voice assistant. The user has requested you to rejoin this session. Greet them immediately with a clear voice message.",
      agentConfig: {
        name: "Jarvis",
        identity: agentIdentity,
        autoGreet: true,
        voice: {
          enabled: true,
          provider: "elevenlabs",
          voice_id: "21m00Tcm4TlvDq8ikWAM", // Default male voice 
          model: "eleven_monolingual_v1"
        },
        announceOnJoin: true,
        defaultGreeting: "Hello, I am Jarvis. I have reconnected to this session. Can you hear me clearly? Please let me know if my voice is coming through."
      }
    };
    
    // Create JWT token for agent dispatch
    const token = new AccessToken(apiKey, apiSecret, {
      identity: 'agent-dispatcher',
      name: 'Agent Dispatcher',
    });
    token.addGrant({ 
      roomAdmin: true,
      roomCreate: true,
    });
    const jwt = await token.toJwt();
    
    console.log(`Force-join: Dispatching agent ${agentIdentity} to room ${roomName}`);
    
    // Make 3 attempts to dispatch the agent
    let success = false;
    let dispatchResponse;
    let errorDetails = '';
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Force-join: Attempt ${attempt} to dispatch agent`);
        
        dispatchResponse = await fetch(`${livekitUrl}/agent/dispatch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
          body: JSON.stringify({
            room_name: roomName,
            agent_name: 'Jarvis',
            metadata: JSON.stringify(enhancedMetadata)
          })
        });
        
        if (dispatchResponse.ok) {
          success = true;
          console.log(`Force-join: Successful on attempt ${attempt}`);
          break;
        } else {
          const errorText = await dispatchResponse.text();
          errorDetails = `Attempt ${attempt} failed: ${dispatchResponse.status} ${errorText}`;
          console.error(`Force-join: ${errorDetails}`);
          
          // Wait before retry
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      } catch (error) {
        errorDetails = `Network error on attempt ${attempt}: ${error.message}`;
        console.error(`Force-join: ${errorDetails}`);
        
        // Wait before retry
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    if (!success) {
      return NextResponse.json({
        error: 'Failed to force-join agent after multiple attempts',
        details: errorDetails
      }, { status: 500 });
    }
    
    // Check response content type and parse response
    let dispatch;
    const contentType = dispatchResponse.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      dispatch = await dispatchResponse.json();
    } else {
      const responseText = await dispatchResponse.text();
      console.log(`Force-join: Non-JSON response: ${responseText}`);
      dispatch = { 
        id: `dispatch-${timestamp}`,
        status: 'success',
        response: responseText
      };
    }
    
    return NextResponse.json({
      success: true,
      message: 'Agent forced to join room successfully',
      roomName,
      agentIdentity,
      dispatchId: dispatch.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Force-join: Unexpected error:', error);
    return NextResponse.json({
      error: 'Failed to force agent to join',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
} 