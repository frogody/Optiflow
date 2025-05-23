import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { validateRequestBody } from '@/lib/inputValidation';

// Connection input validation schema
const connectionSchema = z.object({ userId: z.string().uuid('Invalid user ID format'),
  appId: z.string().min(1, 'App ID is required'),
  status: z.string().optional(),
  connectionUrl: z.string().url('Invalid connection URL').optional(),
    });

type ConnectionInput = z.infer<typeof connectionSchema>;

export async function GET(req: NextRequest) {
  try {
    // Get user ID from request (attached by middleware)
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access'     },
        { status: 401     }
      );
    }
    
    // Get connections for the user
    const connections = await prisma.connection.findMany({
      where: { userId: user.id     },
      include: { app: true     }
    });
    
    return NextResponse.json({ connections });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections'     },
      { status: 500     }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user from request (attached by middleware)
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access'     },
        { status: 401     }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate request body
    const connectionData = validateRequestBody<ConnectionInput>(
      connectionSchema,
      { ...body, userId: user.id     } // Override userId with authenticated user's ID
    );
    
    // Create connection
    const connection = await prisma.connection.create({
      data: connectionData,
      include: { app: true     }
    });
    
    return NextResponse.json(
      { connection },
      { status: 201     }
    );
  } catch (error: any) {
    console.error('Error creating connection:', error);
    
    // Check if validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors     },
        { status: 400     }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create connection'     },
      { status: 500     }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Get user from request (attached by middleware)
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access'     },
        { status: 401     }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate connectionId
    if (!body.id) {
      return NextResponse.json(
        { error: 'Connection ID is required'     },
        { status: 400     }
      );
    }
    
    // Update connection
    const connection = await prisma.connection.update({
      where: {
  id: body.id,
        userId: user.id
          },
      data: {
  status: body.status,
        connectionUrl: body.connectionUrl,
          },
      include: { app: true     }
    });
    
    return NextResponse.json({ connection });
  } catch (error: any) {
    console.error('Error updating connection:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Connection not found or access denied'     },
        { status: 403     }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update connection'     },
      { status: 500     }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get user from request (attached by middleware)
    const user = (req as any).user;
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    // Parse request body
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }
    // Delete connection
    await prisma.connection.delete({
      where: {
        id: body.id,
        userId: user.id
      }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting connection:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Connection not found or access denied' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete connection' },
      { status: 500 }
    );
  }
} 