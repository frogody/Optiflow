import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * Create a workflow from a voice command
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
    const workflowData = await request.json();
    
    // Validate the workflow data
    if (!workflowData.name) {
      return NextResponse.json(
        { error: 'Workflow name is required' },
        { status: 400 }
      );
    }
    
    // In a production environment, we would save the workflow to a database
    // For now, we'll simulate a successful creation
    
    console.log('Creating workflow:', workflowData);
    
    // Generate a workflow ID
    const workflowId = `wf_${Date.now()}`;
    
    // The front-end expects a workflow in a specific format to display in the editor
    // Return a workflow that can be loaded into the editor
    return NextResponse.json({
      id: workflowId,
      name: workflowData.name,
      description: workflowData.description || '',
      nodes: workflowData.nodes || [],
      edges: workflowData.edges || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow', details: error.message },
      { status: 500 }
    );
  }
} 