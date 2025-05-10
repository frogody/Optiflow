import { NextRequest, NextResponse } from 'next/server';
import { KnowledgeBaseService } from '@/services/KnowledgeBaseService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// API endpoint to search the knowledge base
export async function POST(req: NextRequest) {
  try {
    // Check internal API key for agent requests
    const authHeader = req.headers.get('Authorization');
    const internalApiKey = process.env.OPTIFLOW_BACKEND_API_KEY;
    
    let isInternalRequest = false;
    let userId: string | null = null;
    
    // Validate request from agent (using internal API key)
    if (authHeader && authHeader.startsWith('Bearer ') && internalApiKey) {
      const token = authHeader.substring(7);
      if (token === internalApiKey) {
        isInternalRequest = true;
      }
    }
    
    // For direct web requests, use the session
    if (!isInternalRequest) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      userId = session.user.id;
    }
    
    // Parse request body
    const body = await req.json();
    
    // For agent requests, use the provided userId
    if (isInternalRequest && body.userId) {
      userId = body.userId;
    }
    
    // Ensure we have a userId
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Initialize the KnowledgeBase service
    const knowledgeBaseService = new KnowledgeBaseService();
    
    // Prepare search parameters
    const searchParams = {
      query: body.query,
      limit: body.limit || 5,
    };
    
    // Add filters based on request
    if (body.knowledgeBaseId) {
      searchParams.knowledgeBaseId = body.knowledgeBaseId;
    }
    
    if (body.knowledgeBaseType) {
      searchParams.knowledgeBaseType = body.knowledgeBaseType;
    }
    
    if (body.teamId) {
      searchParams.teamId = body.teamId;
    }
    
    if (body.organizationId) {
      searchParams.organizationId = body.organizationId;
    }
    
    // Execute search
    const documents = await knowledgeBaseService.searchDocuments(searchParams, userId);
    
    // Return search results
    return NextResponse.json({ 
      documents,
      query: body.query
    });
    
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to search knowledge base' },
      { status: 500 }
    );
  }
} 