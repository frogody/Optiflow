import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PipedreamService } from '@/services/PipedreamService';

/**
 * Send a message via Slack using Pipedream
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure user is authenticated (or API key is valid if using one)
    const session = await getServerSession(authOptions);
    const authHeader = request.headers.get('authorization');
    
    if (!session && (!authHeader || !authHeader.startsWith('Bearer '))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // If using API key auth, validate the key here
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const apiKey = authHeader.substring(7);
      if (apiKey !== process.env.API_KEY) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
    }
    
    // Parse request body
    const messageData = await request.json();
    
    // Validate the message data
    if (!messageData.channel || !messageData.text) {
      return NextResponse.json(
        { error: 'Channel and text are required' },
        { status: 400 }
      );
    }
    
    // Get the user ID from the session or use a default for API calls
    const userId = session?.user?.id || 'system';
    
    // Initialize the Pipedream service
    const pipedreamService = PipedreamService.getInstance();
    
    // Use the Pipedream service to send the message
    const result = await pipedreamService.makeApiRequest(
      'slack',
      userId,
      '/chat.postMessage',
      'POST',
      {
        channel: messageData.channel,
        text: messageData.text
      }
    );
    
    // Return the result
    return NextResponse.json({
      success: true,
      message: `Message sent to ${messageData.channel}`,
      result
    });
    
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
} 