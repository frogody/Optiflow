import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// This key must match the one used by the agent service
const OPTIFLOW_AGENT_API_KEY = process.env.OPTIFLOW_BACKEND_API_KEY;

export async function POST(req: NextRequest) {
  // 1. Authenticate the agent's request
  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${OPTIFLOW_AGENT_API_KEY}`) {
    console.error('Unauthorized agent request to Pipedream execute API');
    return NextResponse.json({ error: 'Unauthorized agent request' }, { status: 401 });
  }

  try {
    const { action_type, parameters, user_identity } = await req.json();

    if (!action_type || !parameters || !user_identity) {
      return NextResponse.json({ 
        error: 'Missing action_type, parameters, or user_identity' 
      }, { status: 400 });
    }

    console.log(`Processing Pipedream action '${action_type}' for user '${user_identity}'`);
    
    // 2. Retrieve the Pipedream access token for this user
    const userPipedreamConnection = await prisma.connection.findFirst({
      where: {
        userId: user_identity,
        provider: 'pipedream',
        active: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!userPipedreamConnection || !userPipedreamConnection.accessToken) {
      console.error(`User ${user_identity} does not have an active Pipedream connection`);
      return NextResponse.json({ 
        error: 'Pipedream account not connected for this user' 
      }, { status: 403 });
    }

    // 3. Execute the Pipedream action
    // This is where you would call the Pipedream API with the token
    // For now, we'll simulate the call
    console.log(`Executing Pipedream action: ${action_type}`);
    console.log(`Parameters: ${JSON.stringify(parameters)}`);
    
    // Implement actual Pipedream API call here
    // Example: 
    // const pipedreamUrl = `https://api.pipedream.com/v1/workflows/...`;
    // const pipedreamResponse = await fetch(pipedreamUrl, {
    //   method: 'POST', 
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${userPipedreamConnection.accessToken}`
    //   },
    //   body: JSON.stringify(parameters)
    // });
    // const result = await pipedreamResponse.json();
    
    // Simulated response for now
    const result = {
      status: "success",
      action_type: action_type,
      message: `Action '${action_type}' executed successfully for user '${user_identity}'`,
      timestamp: new Date().toISOString(),
      parameters: parameters
    };

    // Log action for auditing
    console.log(`Pipedream action completed: ${action_type}, user: ${user_identity}, result: success`);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in Pipedream execute endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to execute Pipedream action',
      message: error.message
    }, { status: 500 });
  }
} 