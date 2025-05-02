import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PipedreamService } from '@/services/PipedreamService';

/**
 * Send an email via Gmail using Pipedream
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
    const emailData = await request.json();
    
    // Validate the email data
    if (!emailData.to || !emailData.subject || !emailData.body) {
      return NextResponse.json(
        { error: 'To, subject, and body are required' },
        { status: 400 }
      );
    }
    
    // Get the user ID from the session or use a default for API calls
    const userId = session?.user?.id || 'system';
    
    // Initialize the Pipedream service
    const pipedreamService = PipedreamService.getInstance();
    
    // Use the Pipedream service to send the email
    const result = await pipedreamService.makeApiRequest(
      'gmail',
      userId,
      '/send',
      'POST',
      {
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        cc: emailData.cc || '',
        bcc: emailData.bcc || '',
        html: emailData.html || false
      }
    );
    
    // Return the result
    return NextResponse.json({
      success: true,
      message: `Email sent to ${emailData.to}`,
      result
    });
    
  } catch (error) {
    console.error('Error sending Gmail email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
} 