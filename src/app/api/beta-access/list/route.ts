import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Verify admin session
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch all beta access requests
    const requests = await prisma.betaAccessRequest.findMany({
      orderBy: [
        { status: 'asc' },
        { requestDate: 'desc' }
      ],
    });
    
    return NextResponse.json({ 
      success: true, 
      requests 
    });
  } catch (error) {
    console.error('Error fetching beta access requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch beta access requests' },
      { status: 500 }
    );
  }
} 