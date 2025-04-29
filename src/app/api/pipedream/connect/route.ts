import { NextResponse } from 'next/server';
import { createBackendClient } from '@pipedream/sdk/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const pd = createBackendClient({
      environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT || 'development',
      credentials: {
        clientId: process.env.PIPEDREAM_CLIENT_ID!,
        clientSecret: process.env.PIPEDREAM_CLIENT_SECRET!,
      },
      projectId: process.env.PIPEDREAM_PROJECT_ID!,
    });

    const { token, expires_at, connect_link_url } = await pd.createConnectToken({
      external_user_id: session.user.id,
    });

    return NextResponse.json({ 
      token, 
      expires_at, 
      connect_link_url 
    });
  } catch (error) {
    console.error('Error generating Pipedream Connect Token:', error);
    return NextResponse.json(
      { error: 'Failed to generate Connect Token' },
      { status: 500 }
    );
  }
} 