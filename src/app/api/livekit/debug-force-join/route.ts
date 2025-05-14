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
  console.log('Debug force-join endpoint called');
  
  // Get environment variables - simplified approach
  const apiKey = cleanEnvVar(process.env.LIVEKIT_API_KEY || '');
  const apiSecret = cleanEnvVar(process.env.LIVEKIT_API_SECRET || '');
  let livekitUrl = cleanEnvVar(process.env.LIVEKIT_URL || '');

  try {
    const body = await req.json();
    
    // Required parameters
    const roomName = body.roomName;
    const userId = body.userId;
    
    console.log(`Force-join request for room: ${roomName}, user: ${userId}`);
    
    if (!roomName || !userId) {
      return NextResponse.json({ 
        error: 'Missing parameters',
        details: 'Both roomName and userId are required'
      }, { status: 400 });
    }
    
    // Ensure URL uses HTTPS format to avoid TLD errors
    if (livekitUrl.startsWith('wss://')) {
      livekitUrl = livekitUrl.replace('wss://', 'https://');
      console.log('Converted LiveKit URL from WSS to HTTPS format');
    }

    // Check for required environment variables
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
      // Create identity for agent
      const agentIdentity = `agent-jarvis-force-${Date.now()}`;

      // Make a direct fetch call to the LiveKit API
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await generateAgentDispatchToken(apiKey, apiSecret)}`
      };
      
      console.log(`Forcefully dispatching agent ${agentIdentity} to room ${roomName}`);
      
      const dispatchResponse = await fetch(`${livekitUrl}/agent/dispatch`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          room_name: roomName,
          agent_name: 'Jarvis',
          metadata: JSON.stringify({ 
            forcedJoin: true,
            debug: true,
            joinedAt: new Date().toISOString()
          }),
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
      
      console.log('Debug force dispatch successful:', dispatch.id);
      
      return NextResponse.json({
        success: true,
        message: 'Debug agent forcefully dispatched successfully',
        roomName,
        agentIdentity,
        dispatchId: dispatch.id,
        timestamp: new Date().toISOString()
      });
    } catch (dispatchError: any) {
      console.error('Error during agent dispatch:', dispatchError);
      return NextResponse.json({ 
        error: 'Failed to force agent to join',
        details: dispatchError.message,
        stack: process.env.NODE_ENV === 'development' ? dispatchError.stack : undefined,
        code: dispatchError.code || 'UNKNOWN_DISPATCH_ERROR'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in debug force-join endpoint:', error);
    
    return NextResponse.json({ 
      error: 'Failed to force agent to join',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      code: error.code || 'UNKNOWN_ERROR'
    }, { status: 500 });
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