import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

// Validation schema for invite code verification
const inviteCodeSchema = z.object({
  inviteCode: z.string().min(1, 'Invite code is required'),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const { inviteCode } = inviteCodeSchema.parse(body);
    
    // Check if invite code exists and is valid
    const betaRequest = await prisma.betaAccessRequest.findFirst({
      where: {
        inviteCode,
        status: 'APPROVED',
      },
    });
    
    if (!betaRequest) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired invite code' },
        { status: 400 }
      );
    }
    
    // Check if invite code has already been used
    if (betaRequest.inviteCodeUsed) {
      return NextResponse.json(
        { valid: false, error: 'This invite code has already been used' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      valid: true,
      email: betaRequest.email, // Return the associated email for auto-fill
      firstName: betaRequest.firstName,
      lastName: betaRequest.lastName
    });
  } catch (error) {
    console.error('Invite code verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { valid: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { valid: false, error: 'Failed to verify invite code' },
      { status: 500 }
    );
  }
} 