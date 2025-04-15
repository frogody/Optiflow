import { NextRequest, NextResponse } from 'next/server';
import { getMockConnections, updateMockConnection } from './mockConnections';

// Mock MCP server connections for development
const mockMcpServers = {
  aora: {
    url: 'http://localhost:3001',
    tools: {
      clay: { connected: false },
      lindyai: { connected: false },
      n8n: { connected: false }
    }
  }
};

export async function POST(
  request: NextRequest,
  { params }: { params: { orchestratorId: string; method: string } }
) {
  try {
    const { orchestratorId, method } = params;
    const body = await request.json();
    const userId = body.userId || 'default';
    const mcpUrl = request.headers.get('X-MCP-URL');

    if (!orchestratorId || !method) {
      return NextResponse.json(
        { error: 'Missing orchestratorId or method' },
        { status: 400 }
      );
    }

    if (!mcpUrl) {
      return NextResponse.json(
        { error: 'Missing MCP server URL' },
        { status: 400 }
      );
    }

    // Get mock data based on the actual MCP URL
    const mockData = getMockConnections(userId, orchestratorId);
    
    // For development, we'll simulate responses
    // In production, this would forward requests to mcpUrl
    switch (method) {
      case 'check_connection':
        try {
          // Simulate connection check with the MCP URL
          const url = new URL(mcpUrl);
          return NextResponse.json({ 
            connected: true,
            endpoint: url.origin
          });
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid MCP server URL' },
            { status: 400 }
          );
        }

      case 'check_tools':
        const { tools } = body;
        if (!Array.isArray(tools)) {
          return NextResponse.json(
            { error: 'Tools parameter must be an array' },
            { status: 400 }
          );
        }

        // Simulate checking tool connections
        const results = tools.map(tool => {
          const toolConnection = mockData.tools[tool] || { connected: false };
          // Randomly update connection status for simulation
          if (Math.random() > 0.5) {
            updateMockConnection(userId, orchestratorId, tool, !toolConnection.connected);
          }
          return {
            tool,
            connected: toolConnection.connected,
            endpoint: `${mcpUrl}/tools/${tool}`  // Add simulated tool endpoint
          };
        });

        return NextResponse.json({ results });

      default:
        return NextResponse.json(
          { error: 'Unknown method' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 