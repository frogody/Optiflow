/**
 * Pipedream email integration module
 * 
 * This module provides type-safe interactions with Pipedream email workflows.
 */

import { z } from 'zod';

// Changed from importing executeWorkflow to using fetch for webhook
// import { executeWorkflow } from './server';

/**
 * Email recipient schema with validation
 */
export const EmailRecipientSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().optional(),
});

/**
 * Email attachment schema with validation
 */
export const EmailAttachmentSchema = z.object({
  filename: z.string(),
  content: z.string(), // Base64 encoded content
  contentType: z.string().optional(),
});

/**
 * Email payload schema with validation
 */
export const EmailPayloadSchema = z.object({
  to: z.union([
    EmailRecipientSchema,
    z.array(EmailRecipientSchema)
  ]),
  cc: z.union([
    EmailRecipientSchema,
    z.array(EmailRecipientSchema)
  ]).optional(),
  bcc: z.union([
    EmailRecipientSchema,
    z.array(EmailRecipientSchema)
  ]).optional(),
  subject: z.string(),
  body: z.string(),
  isHtml: z.boolean().default(false),
  attachments: z.array(EmailAttachmentSchema).optional(),
  replyTo: EmailRecipientSchema.optional(),
  important: z.boolean().optional(),
  tracking: z.boolean().optional(),
});

/**
 * Extracted type from the email payload schema
 */
export type EmailPayload = z.infer<typeof EmailPayloadSchema>;

/**
 * Email response schema
 */
export const EmailResponseSchema = z.object({
  success: z.boolean(),
  messageId: z.string().optional(),
  error: z.string().optional(),
});

/**
 * Extracted type from the email response schema
 */
export type EmailResponse = z.infer<typeof EmailResponseSchema>;

/**
 * Execute an email workflow to send an email via Pipedream webhook
 * 
 * @param payload The email payload to send
 * @returns Promise containing the email send result
 * @throws Error if validation fails or execution fails
 * 
 * @example
 * ```typescript
 * const result = await execute({
 *   to: { email: 'recipient@example.com', name: 'Recipient Name' },
 *   subject: 'Hello from Optiflow',
 *   body: 'This is a test email from Optiflow',
 *   isHtml: false
 * });
 * 
 * if (result.success) {
 *   console.log('Email sent successfully with ID:', result.messageId);
 * } else {
 *   console.error('Email send failed:', result.error);
 * }
 * ```
 */
export async function execute(payload: EmailPayload): Promise<EmailResponse> {
  try {
    // Get the webhook URL from environment variable
    const webhookUrl = process.env.PIPEDREAM_EMAIL_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error("Missing PIPEDREAM_EMAIL_WEBHOOK_URL environment variable");
      return {
        success: false,
        error: "Email service not configured: missing webhook URL"
      };
    }
    
    // Validate the payload
    const validatedPayload = EmailPayloadSchema.parse(payload);
    
    // Log sending attempt
    console.log(`Sending email to ${typeof validatedPayload.to === 'object' && 'email' in validatedPayload.to 
      ? validatedPayload.to.email 
      : Array.isArray(validatedPayload.to) ? validatedPayload.to.map(r => r.email).join(', ') : 'unknown recipient'}`);
    
    // Send the email via HTTP POST to the Pipedream webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validatedPayload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pipedream webhook responded with status ${response.status}: ${errorText}`);
    }
    
    const responseData = await response.json();
    
    // Return success response
    return {
      success: true,
      messageId: `webhook-${Date.now()}`
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      throw new Error(`Invalid email payload: ${error.message}`);
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Email sending error:", errorMessage);
    
    return {
      success: false,
      error: `Failed to send email: ${errorMessage}`,
    };
  }
} 