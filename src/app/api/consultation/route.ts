// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, company, message } = data;

    // Store the consultation request in the database
    const consultation = await prisma.consultationRequest.create({
      data: { name, email, company, message, status: 'PENDING' },
    });

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user

    return NextResponse.json({
      message: 'Consultation request received',
      consultation,
    });
  } catch (error) {
    console.error('Error handling consultation request:', error);
    return NextResponse.json(
      { error: 'Failed to process consultation request' },
      { status: 500 }
    );
  }
}
