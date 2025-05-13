import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// Validation schema for rejection request
const rejectionSchema = z.object({
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
    const { requestId, adminNotes } = rejectionSchema.parse(body);
    
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
    
    // Update the request status
    const updatedRequest = await prisma.betaAccessRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        rejectionDate: new Date(),
        adminNotes: adminNotes || null,
      },
    });
    
    // Optionally send rejection email to the user
    if (process.env.SEND_REJECTION_EMAILS === 'true') {
      await sendEmail({
        to: betaRequest.email,
        from: 'beta@isyncso.com',
        subject: 'Update on Your SYNC Beta Access Request',
        text: `
          Hi ${betaRequest.firstName},
          
          Thank you for your interest in joining our SYNC beta program.
          
          After careful consideration, we regret to inform you that we are unable to approve your request for beta access at this time. We received an overwhelming number of applications, and our capacity is limited for the current beta phase.
          
          We will keep your information on file and may reach out to you for future beta opportunities.
          
          Best regards,
          The SYNC Team
        `,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SYNC Beta Access Update</title>
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
              .notice-box {
                background-color: #f5f7f9;
                border-left: 4px solid #3CDFFF;
                padding: 15px;
                margin: 25px 0;
                border-radius: 4px;
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
                <h1>Update on Your Beta Access Request</h1>
              </div>
              
              <div class="content">
                <p>Hi ${betaRequest.firstName},</p>
                
                <p>Thank you for your interest in joining our SYNC beta program.</p>
                
                <div class="notice-box">
                  <p>After careful consideration, we regret to inform you that we are unable to approve your request for beta access at this time.</p>
                  <p>We received an overwhelming number of applications, and our capacity is limited for the current beta phase.</p>
                </div>
                
                <p>We will keep your information on file and may reach out to you for future beta opportunities as we expand our platform.</p>
                
                <p>If you have any questions or would like to learn more about our timeline, feel free to contact our support team at <a href="mailto:support@isyncso.com">support@isyncso.com</a>.</p>
                
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
    }
    
    return NextResponse.json({ 
      success: true,
      requestId: updatedRequest.id 
    });
  } catch (error) {
    console.error('Beta access rejection error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to reject beta access request' },
      { status: 500 }
    );
  }
} 