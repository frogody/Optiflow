/**
 * Pipedream Calendar integration module
 * 
 * This module provides type-safe interactions with calendar services
 * (Google Calendar, Microsoft Calendar, etc.) via Pipedream workflows.
 */

import { z } from 'zod';
import { executeWorkflow } from './server';

/**
 * Calendar attendee schema with validation
 */
export const CalendarAttendeeSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().optional(),
  optional: z.boolean().optional(),
  responseStatus: z.enum(['needsAction', 'declined', 'tentative', 'accepted']).optional(),
});

/**
 * Calendar event time schema with validation
 */
export const CalendarTimeSchema = z.object({
  dateTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/, {
    message: "dateTime must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)",
  }),
  timeZone: z.string().optional(),
});

/**
 * Calendar event date-only schema with validation
 */
export const CalendarDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "date must be in YYYY-MM-DD format",
  }),
});

/**
 * Calendar event reminder schema with validation
 */
export const CalendarReminderSchema = z.object({
  method: z.enum(['email', 'popup']),
  minutes: z.number().int().positive(),
});

/**
 * Calendar event recurrence schema with validation
 */
export const CalendarRecurrenceSchema = z.string().regex(/^RRULE:/, {
  message: "Recurrence rule must start with 'RRULE:'",
});

/**
 * Calendar event payload schema with validation for creating events
 */
export const CalendarEventPayloadSchema = z.object({
  summary: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  start: z.union([CalendarTimeSchema, CalendarDateSchema]),
  end: z.union([CalendarTimeSchema, CalendarDateSchema]),
  attendees: z.array(CalendarAttendeeSchema).optional(),
  reminders: z.object({
    useDefault: z.boolean().optional(),
    overrides: z.array(CalendarReminderSchema).optional(),
  }).optional(),
  recurrence: z.array(CalendarRecurrenceSchema).optional(),
  colorId: z.string().optional(),
  visibility: z.enum(['default', 'public', 'private']).optional(),
  transparency: z.enum(['opaque', 'transparent']).optional(),
  calendarId: z.string().default('primary'),
  sendNotifications: z.boolean().optional(),
  conferenceData: z.object({
    createRequest: z.object({
      requestId: z.string(),
      conferenceSolutionKey: z.object({
        type: z.string(),
      }),
    }).optional(),
  }).optional(),
});

/**
 * Extracted type from the calendar event payload schema
 */
export type CalendarEventPayload = z.infer<typeof CalendarEventPayloadSchema>;

/**
 * Calendar query payload schema with validation for retrieving events
 */
export const CalendarQueryPayloadSchema = z.object({
  calendarId: z.string().default('primary'),
  timeMin: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/, {
    message: "timeMin must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)",
  }).optional(),
  timeMax: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/, {
    message: "timeMax must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)",
  }).optional(),
  q: z.string().optional(),
  maxResults: z.number().int().positive().max(2500).optional(),
  singleEvents: z.boolean().optional(),
  orderBy: z.enum(['startTime', 'updated']).optional(),
});

/**
 * Extracted type from the calendar query payload schema
 */
export type CalendarQueryPayload = z.infer<typeof CalendarQueryPayloadSchema>;

/**
 * Calendar operation types
 */
export enum CalendarOperation {
  CREATE_EVENT = 'create_event',
  GET_EVENTS = 'get_events',
  UPDATE_EVENT = 'update_event',
  DELETE_EVENT = 'delete_event',
}

/**
 * Calendar response schema
 */
export const CalendarResponseSchema = z.object({
  success: z.boolean(),
  eventId: z.string().optional(),
  eventLink: z.string().optional(),
  events: z.array(z.any()).optional(),
  error: z.string().optional(),
});

/**
 * Extracted type from the calendar response schema
 */
export type CalendarResponse = z.infer<typeof CalendarResponseSchema>;

/**
 * Execute a calendar workflow via Pipedream
 * 
 * @param operation The calendar operation to perform
 * @param payload The calendar payload for the operation
 * @returns Promise containing the calendar operation result
 * @throws Error if validation fails or execution fails
 * 
 * @example
 * ```typescript
 * // Create a new calendar event
 * const result = await execute(CalendarOperation.CREATE_EVENT, {
 *   summary: 'Project Kickoff Meeting',
 *   description: 'Discuss project timeline and deliverables',
 *   start: {
 *     dateTime: '2023-06-15T10:00:00-07:00',
 *     timeZone: 'America/Los_Angeles'
 *   },
 *   end: {
 *     dateTime: '2023-06-15T11:00:00-07:00',
 *     timeZone: 'America/Los_Angeles'
 *   },
 *   attendees: [
 *     { email: 'team@example.com' },
 *     { email: 'client@example.com' }
 *   ],
 *   reminders: {
 *     useDefault: false,
 *     overrides: [
 *       { method: 'email', minutes: 30 },
 *       { method: 'popup', minutes: 10 }
 *     ]
 *   }
 * });
 * 
 * if (result.success) {
 *   console.log('Calendar event created:', result.eventId);
 * } else {
 *   console.error('Calendar event creation failed:', result.error);
 * }
 * ```
 */
export async function execute(
  operation: CalendarOperation,
  payload: CalendarEventPayload | CalendarQueryPayload
): Promise<CalendarResponse> {
  try {
    let validatedPayload;
    
    switch (operation) {
      case CalendarOperation.CREATE_EVENT:
      case CalendarOperation.UPDATE_EVENT:
        validatedPayload = CalendarEventPayloadSchema.parse(payload);
        break;
      case CalendarOperation.GET_EVENTS:
        validatedPayload = CalendarQueryPayloadSchema.parse(payload);
        break;
      case CalendarOperation.DELETE_EVENT:
        validatedPayload = z.object({
          calendarId: z.string().default('primary'),
          eventId: z.string(),
          sendNotifications: z.boolean().optional(),
        }).parse(payload);
        break;
      default:
        throw new Error(`Unsupported calendar operation: ${operation}`);
    }
    
    // Execute the workflow
    const response = await executeWorkflow({
      workflowKey: `calendar_${operation}`,
      payload: validatedPayload,
    });
    
    // Validate and return the response
    return CalendarResponseSchema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      throw new Error(`Invalid calendar payload: ${error.message}`);
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to execute calendar operation: ${errorMessage}`,
    };
  }
} 