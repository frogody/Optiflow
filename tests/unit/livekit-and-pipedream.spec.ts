import { ConnectionState, Room, RoomEvent } from 'livekit-client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as livekitModule from '../../src/lib/livekit';
import * as calendarModule from '../../src/lib/pipedream/calendar';
import * as emailModule from '../../src/lib/pipedream/email';
import { executeWorkflow } from '../../src/lib/pipedream/server';
import * as slackModule from '../../src/lib/pipedream/slack';

// Mock the fetch API
global.fetch = vi.fn();

// Mock the LiveKit Room class
vi.mock('livekit-client', async () => {
  const actual = await vi.importActual('livekit-client');
  return {
    ...actual as any,
    Room: vi.fn().mockImplementation(() => ({
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
      url: 'wss://livekit.example.com',
      localParticipant: {
        publishTrack: vi.fn().mockResolvedValue(undefined),
        getTrackPublications: vi.fn().mockReturnValue(new Map())
      },
      connectionState: ConnectionState.Connected
    })),
    RoomEvent: {
      ...actual.RoomEvent,
    },
    ConnectionState: {
      ...actual.ConnectionState,
    }
  };
});

// Mock the executeWorkflow function
vi.mock('../../src/lib/pipedream/server', () => ({
  executeWorkflow: vi.fn()
}));

describe('LiveKit Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful fetch responses
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token', url: 'wss://livekit.example.com' })
    });
    
    // Mock Room.createLocalAudioTrack
    (Room.createLocalAudioTrack as any) = vi.fn().mockResolvedValue({
      stop: vi.fn()
    });
  });

  describe('connect()', () => {
    it('should connect to a LiveKit room successfully', async () => {
      const result = await livekitModule.connect({
        roomName: 'test-room'
      });
      
      expect(result).toHaveProperty('room');
      expect(result).toHaveProperty('localParticipant');
      expect(result).toHaveProperty('disconnect');
      
      // Verify fetch calls
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(1, '/api/livekit/dispatch', expect.any(Object));
      expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/livekit/token', expect.any(Object));
      
      // Verify Room methods were called
      expect(Room).toHaveBeenCalledTimes(1);
      const roomInstance = (Room as any).mock.results[0].value;
      expect(roomInstance.connect).toHaveBeenCalledWith('wss://livekit.example.com', 'test-token');
      
      // Test the disconnect function
      await result.disconnect();
      expect(roomInstance.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle dispatch agent failure', async () => {
      // Override first fetch mock to simulate dispatch failure
      (global.fetch as any).mockReset();
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to dispatch agent' })
      });
      
      await expect(livekitModule.connect({
        roomName: 'test-room'
      })).rejects.toThrow('Failed to dispatch agent');
      
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(Room).not.toHaveBeenCalled();
    });

    it('should handle token fetch failure', async () => {
      // Override second fetch mock to simulate token fetch failure
      (global.fetch as any).mockReset();
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      }).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized'
      });
      
      await expect(livekitModule.connect({
        roomName: 'test-room'
      })).rejects.toThrow('Failed to fetch LiveKit token');
      
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(Room).toHaveBeenCalledTimes(1);
    });
  });

  describe('onReconnect()', () => {
    it('should reconnect to a room successfully', async () => {
      const mockRoom = {
        connect: vi.fn().mockResolvedValue(undefined),
        url: 'wss://livekit.example.com',
        connectionState: ConnectionState.Disconnected
      };
      
      await livekitModule.onReconnect(mockRoom as any, 'test-token');
      
      expect(mockRoom.connect).toHaveBeenCalledWith('wss://livekit.example.com', 'test-token');
    });

    it('should not reconnect if already connected', async () => {
      const mockRoom = {
        connect: vi.fn().mockResolvedValue(undefined),
        url: 'wss://livekit.example.com',
        connectionState: ConnectionState.Connected
      };
      
      await livekitModule.onReconnect(mockRoom as any, 'test-token');
      
      expect(mockRoom.connect).not.toHaveBeenCalled();
    });
  });

  describe('isMuted()', () => {
    it('should return true when no audio track exists', () => {
      const mockRoom = {
        localParticipant: {
          getTrackPublications: vi.fn().mockReturnValue(new Map())
        }
      };
      
      const result = livekitModule.isMuted(mockRoom as any);
      
      expect(result).toBe(true);
    });

    it('should return the mute state of the audio track', () => {
      const mockPublications = new Map();
      mockPublications.set('audio-track', {
        kind: 'audio',
        isMuted: false
      });
      
      const mockRoom = {
        localParticipant: {
          getTrackPublications: vi.fn().mockReturnValue(mockPublications)
        }
      };
      
      const result = livekitModule.isMuted(mockRoom as any);
      
      expect(result).toBe(false);
    });
  });

  describe('toggleMic()', () => {
    it('should mute the microphone if unmuted', async () => {
      const mockAudioTrack = {
        kind: 'audio',
        isMuted: false,
        mute: vi.fn().mockResolvedValue(undefined),
        unmute: vi.fn().mockResolvedValue(undefined)
      };
      
      const mockPublications = new Map();
      mockPublications.set('audio-track', mockAudioTrack);
      
      const mockRoom = {
        localParticipant: {
          getTrackPublications: vi.fn().mockReturnValue(mockPublications)
        }
      };
      
      const result = await livekitModule.toggleMic(mockRoom as any);
      
      expect(result).toBe(true); // Now muted
      expect(mockAudioTrack.mute).toHaveBeenCalledTimes(1);
      expect(mockAudioTrack.unmute).not.toHaveBeenCalled();
    });

    it('should unmute the microphone if muted', async () => {
      const mockAudioTrack = {
        kind: 'audio',
        isMuted: true,
        mute: vi.fn().mockResolvedValue(undefined),
        unmute: vi.fn().mockResolvedValue(undefined)
      };
      
      const mockPublications = new Map();
      mockPublications.set('audio-track', mockAudioTrack);
      
      const mockRoom = {
        localParticipant: {
          getTrackPublications: vi.fn().mockReturnValue(mockPublications)
        }
      };
      
      const result = await livekitModule.toggleMic(mockRoom as any);
      
      expect(result).toBe(false); // Now unmuted
      expect(mockAudioTrack.unmute).toHaveBeenCalledTimes(1);
      expect(mockAudioTrack.mute).not.toHaveBeenCalled();
    });
  });
});

describe('Pipedream Email Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (executeWorkflow as any).mockResolvedValue({
      success: true,
      messageId: 'test-message-id'
    });
  });

  describe('execute()', () => {
    it('should send an email successfully', async () => {
      const emailPayload = {
        to: { email: 'recipient@example.com', name: 'Recipient' },
        subject: 'Test Subject',
        body: 'Test Body',
        isHtml: false
      };
      
      const result = await emailModule.execute(emailPayload);
      
      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-message-id');
      expect(executeWorkflow).toHaveBeenCalledWith({
        workflowKey: 'send_email',
        payload: emailPayload
      });
    });

    it('should handle validation errors', async () => {
      const invalidPayload = {
        to: { email: 'invalid-email', name: 'Recipient' },
        subject: 'Test Subject',
        body: 'Test Body'
      };
      
      await expect(emailModule.execute(invalidPayload as any)).rejects.toThrow('Invalid email payload');
      expect(executeWorkflow).not.toHaveBeenCalled();
    });

    it('should handle execution errors', async () => {
      (executeWorkflow as any).mockRejectedValue(new Error('Execution failed'));
      
      const emailPayload = {
        to: { email: 'recipient@example.com', name: 'Recipient' },
        subject: 'Test Subject',
        body: 'Test Body',
        isHtml: false
      };
      
      const result = await emailModule.execute(emailPayload);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to send email');
    });
  });
});

describe('Pipedream Slack Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (executeWorkflow as any).mockResolvedValue({
      success: true,
      ts: '1234567890.123456',
      channel: 'test-channel'
    });
  });

  describe('execute()', () => {
    it('should send a Slack message successfully', async () => {
      const slackPayload = {
        channel: 'general',
        text: 'Hello from tests!',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Test Message*'
            }
          }
        ]
      };
      
      const result = await slackModule.execute(slackPayload);
      
      expect(result.success).toBe(true);
      expect(result.ts).toBe('1234567890.123456');
      expect(result.channel).toBe('test-channel');
      expect(executeWorkflow).toHaveBeenCalledWith({
        workflowKey: 'send_slack_message',
        payload: slackPayload
      });
    });

    it('should handle validation errors', async () => {
      const invalidPayload = {
        text: 'Missing channel!'
      };
      
      await expect(slackModule.execute(invalidPayload as any)).rejects.toThrow('Invalid Slack payload');
      expect(executeWorkflow).not.toHaveBeenCalled();
    });
  });
});

describe('Pipedream Calendar Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (executeWorkflow as any).mockResolvedValue({
      success: true,
      eventId: 'test-event-id',
      eventLink: 'https://calendar.example.com/event/test-event-id'
    });
  });

  describe('execute()', () => {
    it('should create a calendar event successfully', async () => {
      const calendarPayload = {
        summary: 'Test Event',
        description: 'Test Description',
        start: {
          dateTime: '2023-06-15T10:00:00Z',
          timeZone: 'UTC'
        },
        end: {
          dateTime: '2023-06-15T11:00:00Z',
          timeZone: 'UTC'
        },
        attendees: [
          { email: 'attendee@example.com' }
        ]
      };
      
      const result = await calendarModule.execute(
        calendarModule.CalendarOperation.CREATE_EVENT,
        calendarPayload
      );
      
      expect(result.success).toBe(true);
      expect(result.eventId).toBe('test-event-id');
      expect(executeWorkflow).toHaveBeenCalledWith({
        workflowKey: 'calendar_create_event',
        payload: calendarPayload
      });
    });

    it('should query calendar events successfully', async () => {
      (executeWorkflow as any).mockResolvedValue({
        success: true,
        events: [{ id: 'event-1' }, { id: 'event-2' }]
      });
      
      const queryPayload = {
        timeMin: '2023-06-15T00:00:00Z',
        timeMax: '2023-06-15T23:59:59Z'
      };
      
      const result = await calendarModule.execute(
        calendarModule.CalendarOperation.GET_EVENTS,
        queryPayload
      );
      
      expect(result.success).toBe(true);
      expect(result.events).toHaveLength(2);
      expect(executeWorkflow).toHaveBeenCalledWith({
        workflowKey: 'calendar_get_events',
        payload: queryPayload
      });
    });

    it('should handle validation errors', async () => {
      const invalidPayload = {
        summary: 'Test Event',
        // Missing required start and end fields
      };
      
      await expect(calendarModule.execute(
        calendarModule.CalendarOperation.CREATE_EVENT,
        invalidPayload as any
      )).rejects.toThrow('Invalid calendar payload');
      
      expect(executeWorkflow).not.toHaveBeenCalled();
    });

    it('should handle unsupported operations', async () => {
      const payload = { calendarId: 'primary' };
      
      await expect(calendarModule.execute(
        'unsupported_operation' as any,
        payload
      )).rejects.toThrow('Unsupported calendar operation');
      
      expect(executeWorkflow).not.toHaveBeenCalled();
    });
  });
}); 