/**
 * Email service utility
 * 
 * This module provides email sending capabilities for the application.
 * It utilizes the Pipedream integration if available, or falls back to console logging in development.
 */

import { execute as executePipedreamEmail } from './pipedream/email';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

/**
 * Send an email with the provided options
 * 
 * @param options Email sending options
 * @returns Promise resolving to success status and any relevant information
 */
export async function sendEmail(options: EmailOptions): Promise<{success: boolean; messageId?: string; error?: string}> {
  // Use environment variable for default sender
  const defaultSender = process.env.DEFAULT_EMAIL_SENDER || 'no-reply@isyncso.com';
  
  // Check if we're in development without email capabilities
  if (process.env.NODE_ENV === 'development' && process.env.DISABLE_EMAILS === 'true') {
    console.log('=== EMAIL SENDING DISABLED IN DEVELOPMENT ===');
    console.log(`To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`From: ${options.from || defaultSender}`);
    console.log('--- Body ---');
    console.log(options.text);
    console.log('------------');
    
    // Return a mock success response
    return {
      success: true,
      messageId: `mock-email-${Date.now()}`,
    };
  }
  
  try {
    // Convert recipients to proper format for Pipedream
    const formatRecipients = (recipients: string | string[]) => {
      if (Array.isArray(recipients)) {
        return recipients.map(email => ({ email }));
      }
      return { email: recipients };
    };
    
    // Execute the email send via Pipedream
    const result = await executePipedreamEmail({
      to: formatRecipients(options.to),
      subject: options.subject,
      body: options.html || options.text,
      isHtml: !!options.html,
      cc: options.cc ? formatRecipients(options.cc) : undefined,
      bcc: options.bcc ? formatRecipients(options.bcc) : undefined,
      replyTo: options.replyTo ? { email: options.replyTo } : undefined,
    });
    
    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email sending error',
    };
  }
} 