import { NextRequest, NextResponse } from 'next/server';

import { registerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, inviteCode } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if invite code is valid and not used yet
    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code is required for registration' },
        { status: 400 }
      );
    }

    const betaRequest = await prisma.betaAccessRequest.findFirst({
      where: {
        inviteCode,
        status: 'APPROVED',
        inviteCodeUsed: false,
      },
    });

    if (!betaRequest) {
      return NextResponse.json(
        { error: 'Invalid or already used invite code' },
        { status: 400 }
      );
    }

    // Register the user
    const user = await registerUser({
      email,
      password,
      name: name || undefined,
    });

    // Mark the invite code as used
    await prisma.betaAccessRequest.update({
      where: { id: betaRequest.id },
      data: { inviteCodeUsed: true },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
} 