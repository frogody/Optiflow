import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// Validation schema for beta access request
const betaRequestSchema = z.object({
  intendedUse: z.string().min(1, 'Intended use is required'),
  usageFrequency: z.string().min(1, 'Usage frequency is required'),
  isAiConsultant: z.boolean(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  companyName: z.string().min(1, 'Company name is required'),
  companyWebsite: z.string().url('Valid website URL is required'),
  companySize: z.string().min(1, 'Company size is required'),
  industry: z.string().min(1, 'Industry is required'),
  useCase: z.string().min(1, 'Use case is required'),
  additionalInfo: z.string().min(10, 'Please provide more details about your use case'),
  joinReason: z.string().min(10, 'Please explain why you want to join the beta program'),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const validatedData = betaRequestSchema.parse(body);
    
    // Store beta access request in the database
    const betaRequest = await prisma.betaAccessRequest.create({
      data: {
        ...validatedData,
        status: 'PENDING',
        requestDate: new Date(),
      },
    });
    
    // Send notification email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@isyncso.com',
      subject: 'New Beta Access Request',
      text: `
        New beta access request from ${validatedData.firstName} ${validatedData.lastName}
        
        Email: ${validatedData.email}
        Company: ${validatedData.companyName} (${validatedData.companySize})
        Website: ${validatedData.companyWebsite}
        Industry: ${validatedData.industry}
        
        Intended Use: ${validatedData.intendedUse}
        Usage Frequency: ${validatedData.usageFrequency}
        Is AI Consultant: ${validatedData.isAiConsultant ? 'Yes' : 'No'}
        Use Case: ${validatedData.useCase}
        
        Additional Info:
        ${validatedData.additionalInfo}
        
        Reason for Joining Beta:
        ${validatedData.joinReason}
        
        Review this application in the admin dashboard.
      `,
      html: `
        <h2>New Beta Access Request</h2>
        <p><strong>From:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Company:</strong> ${validatedData.companyName} (${validatedData.companySize})</p>
        <p><strong>Website:</strong> ${validatedData.companyWebsite}</p>
        <p><strong>Industry:</strong> ${validatedData.industry}</p>
        <p><strong>Intended Use:</strong> ${validatedData.intendedUse}</p>
        <p><strong>Usage Frequency:</strong> ${validatedData.usageFrequency}</p>
        <p><strong>Is AI Consultant:</strong> ${validatedData.isAiConsultant ? 'Yes' : 'No'}</p>
        <p><strong>Use Case:</strong> ${validatedData.useCase}</p>
        <h3>Additional Information:</h3>
        <p>${validatedData.additionalInfo}</p>
        <h3>Reason for Joining Beta:</h3>
        <p>${validatedData.joinReason}</p>
        <p>Review this application in the <a href="${process.env.NEXTAUTH_URL}/admin/beta-requests">admin dashboard</a>.</p>
      `,
    });
    
    return NextResponse.json({ success: true, id: betaRequest.id });
  } catch (error) {
    console.error('Beta access request error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to process beta access request' },
      { status: 500 }
    );
  }
} 