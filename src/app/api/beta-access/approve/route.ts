import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { nanoid } from 'nanoid';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// Validation schema for approval request
const approvalSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  adminNotes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Verify admin session
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate the request body
    const body = await req.json();
    const { requestId, adminNotes } = approvalSchema.parse(body);
    
    // Find the beta access request
    const betaRequest = await prisma.betaAccessRequest.findUnique({
      where: { id: requestId },
    });
    
    if (!betaRequest) {
      return NextResponse.json(
        { success: false, error: 'Beta access request not found' },
        { status: 404 }
      );
    }
    
    // Generate invite code
    const inviteCode = nanoid(12); // Generate a 12-character invite code
    
    // Update the request status and store the invite code
    const updatedRequest = await prisma.betaAccessRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        inviteCode,
        approvalDate: new Date(),
        adminNotes: adminNotes || null,
      },
    });
    
    // Send approval email with invite code to the user
    await sendEmail({
      to: betaRequest.email,
      from: 'beta@isyncso.com',
      subject: 'Your SYNC Beta Access Has Been Approved!',
      text: `
        Hi ${betaRequest.firstName},
        
        Great news! Your application for SYNC beta access has been approved.
        
        Your invite code is: ${inviteCode}
        
        You can now sign up for an account by going to:
        ${process.env.NEXTAUTH_URL}/signup
        
        Enter your invite code when prompted during the registration process.
        
        We're excited to have you as part of our beta program and look forward to your valuable feedback.
        
        Best regards,
        The SYNC Team
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SYNC Beta Access Approved</title>
          <style>
            body { 
              font-family: 'Segoe UI', Helvetica, Arial, sans-serif; 
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 1px solid #eaeaea;
            }
            .logo {
              max-width: 180px;
              margin-bottom: 15px;
            }
            h1 {
              color: #111;
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 20px;
            }
            .content {
              padding: 30px 20px;
            }
            .code-box {
              background: linear-gradient(135deg, #3CDFFF 0%, #4AFFD4 100%);
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
              color: #111111;
            }
            .code {
              font-family: 'Courier New', monospace;
              font-size: 24px;
              font-weight: bold;
              background: rgba(255,255,255,0.2);
              padding: 10px 15px;
              border-radius: 4px;
              letter-spacing: 1px;
            }
            .btn {
              display: inline-block;
              background: linear-gradient(135deg, #3CDFFF 0%, #4AFFD4 100%);
              color: #111111;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: 600;
              margin-top: 20px;
              text-align: center;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #eaeaea;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img class="logo" src="${process.env.NEXTAUTH_URL}/ISYNCSO_LOGO.png" alt="SYNC Logo">
              <h1>Your Beta Access is Approved! 🎉</h1>
            </div>
            
            <div class="content">
              <p>Hi ${betaRequest.firstName},</p>
              
              <p>Great news! Your application for SYNC beta access has been <strong>approved</strong>.</p>
              
              <div class="code-box">
                <p style="margin-bottom:10px;"><strong>Your invite code is:</strong></p>
                <div class="code">${inviteCode}</div>
                <p style="margin-top:10px; font-size:12px;">Use this code to complete your registration</p>
              </div>
              
              <p>You can now sign up for an account and start exploring what SYNC has to offer.</p>
              
              <p style="text-align:center;">
                <a href="${process.env.NEXTAUTH_URL}/signup" class="btn">Sign Up Now</a>
              </p>
              
              <p>During the registration process, you'll be asked to enter your invite code to activate your account.</p>
              
              <p>We're excited to have you as part of our beta program and look forward to your valuable feedback. If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@isyncso.com">support@isyncso.com</a>.</p>
              
              <p>Best regards,<br>The SYNC Team</p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} SYNC. All rights reserved.</p>
              <p>This email was sent to ${betaRequest.email} because you requested beta access to SYNC.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    return NextResponse.json({ 
      success: true, 
      inviteCode,
      requestId: updatedRequest.id 
    });
  } catch (error) {
    console.error('Beta access approval error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to approve beta access request' },
      { status: 500 }
    );
  }
} 