/**
 * Pipedream Slack integration module
 * 
 * This module provides type-safe interactions with Pipedream Slack workflows.
 */

import { z } from 'zod';
import { executeWorkflow } from './server';

/**
 * Slack block element schemas
 */
export const SlackTextSchema = z.object({
  type: z.literal('plain_text').or(z.literal('mrkdwn')),
  text: z.string(),
  emoji: z.boolean().optional(),
});

export const SlackBlockSchema = z.object({
  type: z.string(),
  text: SlackTextSchema.optional(),
  elements: z.array(z.any()).optional(),
  accessory: z.any().optional(),
  fields: z.array(z.any()).optional(),
  block_id: z.string().optional(),
});

/**
 * Slack message payload schema with validation
 */
export const SlackPayloadSchema = z.object({
  channel: z.string(),
  text: z.string(),
  blocks: z.array(SlackBlockSchema).optional(),
  thread_ts: z.string().optional(),
  mrkdwn: z.boolean().optional(),
  unfurl_links: z.boolean().optional(),
  unfurl_media: z.boolean().optional(),
  username: z.string().optional(),
  icon_emoji: z.string().optional(),
  icon_url: z.string().optional(),
  link_names: z.boolean().optional(),
  reply_broadcast: z.boolean().optional(),
});

/**
 * Extracted type from the Slack payload schema
 */
export type SlackPayload = z.infer<typeof SlackPayloadSchema>;

/**
 * Slack response schema
 */
export const SlackResponseSchema = z.object({
  success: z.boolean(),
  ts: z.string().optional(),
  channel: z.string().optional(),
  message: z.any().optional(),
  error: z.string().optional(),
});

/**
 * Extracted type from the Slack response schema
 */
export type SlackResponse = z.infer<typeof SlackResponseSchema>;

/**
 * Execute a Slack workflow to send a message via Pipedream
 * 
 * @param payload The Slack payload to send
 * @returns Promise containing the Slack send result
 * @throws Error if validation fails or execution fails
 * 
 * @example
 * ```typescript
 * const result = await execute({
 *   channel: 'general',
 *   text: 'Hello from Optiflow!',
 *   blocks: [
 *     {
 *       type: 'section',
 *       text: {
 *         type: 'mrkdwn',
 *         text: '*Workflow Completed*: Your data processing job has finished.'
 *       }
 *     }
 *   ]
 * });
 * 
 * if (result.success) {
 *   console.log('Slack message sent successfully with timestamp:', result.ts);
 * } else {
 *   console.error('Slack message send failed:', result.error);
 * }
 * ```
 */
export async function execute(payload: SlackPayload): Promise<SlackResponse> {
  try {
    // Validate the payload
    const validatedPayload = SlackPayloadSchema.parse(payload);
    
    // Execute the workflow
    const response = await executeWorkflow({
      workflowKey: 'send_slack_message',
      payload: validatedPayload,
    });
    
    // Validate and return the response
    return SlackResponseSchema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      throw new Error(`Invalid Slack payload: ${error.message}`);
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to send Slack message: ${errorMessage}`,
    };
  }
} 