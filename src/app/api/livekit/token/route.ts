import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    // Debug session info
    console.log('Session check:', {
      exists: !!session,
      user: session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      } : null
    });

    if (!session?.user?.id) {
      console.error('Unauthorized: Invalid session', { session });
      return NextResponse.json(
        { error: 'Unauthorized - Please log in again' },
        { status: 401 }
      );
    }

    // Get credentials from environment variables
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    // Debug logging
    console.log('Environment variables check:', {
      LIVEKIT_API_KEY: !!apiKey,
      LIVEKIT_API_SECRET: !!apiSecret,
      NEXT_PUBLIC_LIVEKIT_URL: url,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL
    });

    if (!apiKey || !apiSecret) {
      console.error('Missing LiveKit credentials');
      return NextResponse.json(
        { error: 'LiveKit credentials not configured' },
        { status: 500 }
      );
    }

    if (!url) {
      console.error('Missing LiveKit URL');
      return NextResponse.json(
        { error: 'LiveKit URL not configured' },
        { status: 500 }
      );
    }

    // Create a room name based on the user's ID
    const roomName = `voice-room-${session.user.id}`;
    const participantName = session.user.name || session.user.email || session.user.id;

    console.log('Creating token for:', { roomName, participantName, userId: session.user.id });

    const at = new AccessToken(apiKey, apiSecret, {
      identity: session.user.id,
      name: participantName,
      metadata: JSON.stringify({
        userId: session.user.id,
        name: participantName
      })
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = at.toJwt();
    console.log('Token generated successfully');

    // Make sure the URL is properly formatted
    const cleanUrl = url.trim().replace(/\/$/, '');
    if (!cleanUrl.startsWith('wss://')) {
      console.error('Invalid LiveKit URL format');
      return NextResponse.json(
        { error: 'Invalid LiveKit URL format' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      token,
      room: roomName,
      participant: participantName,
      url: cleanUrl,
      userId: session.user.id
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('Unauthorized: No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { roomName } = await req.json();

    if (!roomName) {
      return NextResponse.json(
        { error: 'Missing roomName' },
        { status: 400 }
      );
    }

    // Get credentials from environment variables
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    // Debug logging
    console.log('Environment variables check:');
    console.log('LIVEKIT_API_KEY exists:', !!apiKey);
    console.log('LIVEKIT_API_SECRET exists:', !!apiSecret);
    console.log('NEXT_PUBLIC_LIVEKIT_URL:', url);

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'LiveKit credentials not configured' },
        { status: 500 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { error: 'LiveKit URL not configured' },
        { status: 500 }
      );
    }

    const participantName = session.user.name || session.user.email || session.user.id;

    // Create a new token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: session.user.id,
      name: participantName,
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Generate the token
    const token = at.toJwt();
    
    // Debug logging
    console.log('Token generated successfully for:', participantName);

    // Make sure the URL is properly formatted
    const cleanUrl = url.trim().replace(/\/$/, '');
    if (!cleanUrl.startsWith('wss://')) {
      return NextResponse.json(
        { error: 'Invalid LiveKit URL format' },
        { status: 500 }
      );
    }

    return NextResponse.json({ token, url: cleanUrl });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 