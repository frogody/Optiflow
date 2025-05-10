/**
 * Pipedream email integration module
 * 
 * This module provides type-safe interactions with Pipedream email workflows.
 */

import { z } from 'zod';

import { executeWorkflow } from './server';

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
 * Execute an email workflow to send an email via Pipedream
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
    // Validate the payload
    const validatedPayload = EmailPayloadSchema.parse(payload);
    
    // Execute the workflow
    const response = await executeWorkflow({
      workflowKey: 'send_email',
      payload: validatedPayload,
    });
    
    // Validate and return the response
    return EmailResponseSchema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      throw new Error(`Invalid email payload: ${error.message}`);
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to send email: ${errorMessage}`,
    };
  }
} 