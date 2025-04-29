import { NextResponse } from 'next/server';
import { createBackendClient } from '@pipedream/sdk/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      console.error('Authentication failed: No session or user ID');
      return NextResponse.json(
        { error: 'You must be logged in to connect your Pipedream account' },
        { status: 401 }
      );
    }

    // Verify environment variables
    if (!process.env.PIPEDREAM_CLIENT_ID || !process.env.PIPEDREAM_CLIENT_SECRET || !process.env.PIPEDREAM_PROJECT_ID) {
      console.error('Missing required Pipedream environment variables');
      return NextResponse.json(
        { error: 'Pipedream configuration is incomplete' },
        { status: 500 }
      );
    }

    // Create Pipedream client
    const pd = createBackendClient({
      environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT || 'development',
      credentials: {
        clientId: process.env.PIPEDREAM_CLIENT_ID,
        clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
      },
      projectId: process.env.PIPEDREAM_PROJECT_ID,
    });

    console.log('Creating connect token for user:', session.user.id);

    // Generate connect token
    const { token, expires_at, connect_link_url } = await pd.createConnectToken({
      external_user_id: session.user.id,
      user_facing_label: `Connect account for ${session.user.email}`,
    });

    console.log('Connect token generated successfully');

    return NextResponse.json({ 
      token, 
      expires_at, 
      connect_link_url 
    });
  } catch (error) {
    console.error('Error generating Pipedream Connect Token:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate Connect Token' },
      { status: 500 }
    );
  }
} 