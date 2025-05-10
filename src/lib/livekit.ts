/**
 * LiveKit integration utilities for voice agent functionality
 * 
 * This module provides a standardized interface for interacting with LiveKit
 * in the Optiflow voice agent system. It handles room connections,
 * audio tracks, and microphone state management with typesafe interfaces.
 */

import { Room, RoomEvent, LocalParticipant, LocalAudioTrack, ConnectionState, ConnectionQuality } from 'livekit-client';

/**
 * Configuration options for LiveKit connection
 */
export interface LiveKitConnectionOptions {
  /** Room name to connect to */
  roomName: string;
  /** Optional participant identity override */
  identity?: string;
  /** Optional callback for when connection state changes */
  onConnectionStateChange?: (state: ConnectionState) => void;
  /** Optional callback for when remote participants join */
  onParticipantConnected?: (participantId: string) => void;
  /** Optional callback for when remote participants leave */
  onParticipantDisconnected?: (participantId: string) => void;
  /** Optional callback for when agent transcript is received */
  onAgentTranscript?: (transcript: string) => void;
  /** Optional callback for when user transcript is received */
  onUserTranscript?: (transcript: string) => void;
  /** Optional callback for when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * Result of a successful LiveKit connection
 */
export interface LiveKitConnectionResult {
  /** The connected Room instance */
  room: Room;
  /** The local participant instance */
  localParticipant: LocalParticipant;
  /** The local audio track if created */
  localAudioTrack?: LocalAudioTrack;
  /** Function to disconnect from the room */
  disconnect: () => Promise<void>;
}

/**
 * Connects to a LiveKit room with the specified options
 * 
 * This is the main entry point for voice agent functionality. It handles:
 * - Fetching a LiveKit token from the server
 * - Creating and configuring a Room instance
 * - Setting up event listeners for participant and connection events
 * - Publishing local audio if requested
 * 
 * @param options Configuration options for the connection
 * @returns Promise that resolves to a LiveKitConnectionResult on success
 * @throws Error if connection fails or token can't be obtained
 * 
 * @example
 * ```typescript
 * const { room, localParticipant, disconnect } = await connect({
 *   roomName: "voice-assistant-123",
 *   onParticipantConnected: (id) => console.log(`Agent ${id} connected`),
 *   onAgentTranscript: (text) => updateTranscript(text),
 * });
 * ```
 */
export async function connect(
  options: LiveKitConnectionOptions
): Promise<LiveKitConnectionResult> {
  // Generate a unique room name if not provided
  const roomName = options.roomName || `optiflow-voice-${Date.now()}`;
  
  // First, dispatch the agent to the room
  try {
    const dispatchResponse = await fetch('/api/livekit/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName })
    });
    
    if (!dispatchResponse.ok) {
      const errorData = await dispatchResponse.json();
      throw new Error(`Failed to dispatch agent: ${errorData.error || dispatchResponse.statusText}`);
    }
  } catch (e: any) {
    if (options.onError) {
      options.onError(new Error(`Failed to dispatch agent: ${e.message}`));
    }
    throw e;
  }
  
  // Now get a token for the user to join the room
  let token = '';
  let livekitUrl = '';
  try {
    const tokenResponse = await fetch('/api/livekit/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        room: roomName,
        identity: options.identity
      })
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to fetch LiveKit token: ' + tokenResponse.statusText);
    }
    
    const tokenData = await tokenResponse.json();
    token = tokenData.token;
    livekitUrl = tokenData.url;
    
    if (!token || !livekitUrl) {
      throw new Error('Invalid LiveKit configuration received from server');
    }
  } catch (e: any) {
    if (options.onError) {
      options.onError(new Error(`Failed to get LiveKit token: ${e.message}`));
    }
    throw e;
  }
  
  // Create and configure room
  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
  });
  
  // Set up event listeners
  room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
    if (options.onConnectionStateChange) {
      options.onConnectionStateChange(state);
    }
  });
  
  room.on(RoomEvent.ParticipantConnected, (participant) => {
    if (options.onParticipantConnected) {
      options.onParticipantConnected(participant.identity);
    }
  });
  
  room.on(RoomEvent.ParticipantDisconnected, (participant) => {
    if (options.onParticipantDisconnected) {
      options.onParticipantDisconnected(participant.identity);
    }
  });
  
  // Data messages handler
  room.on(RoomEvent.DataReceived, (payload, participant, kind) => {
    if (participant?.identity.startsWith('agent-')) {
      const message = new TextDecoder().decode(payload);
      try {
        const data = JSON.parse(message);
        if (data.type === 'agent_transcript' && options.onAgentTranscript) {
          options.onAgentTranscript(data.transcript);
        } else if (data.type === 'user_transcript' && options.onUserTranscript) {
          options.onUserTranscript(data.transcript);
        } else if (data.type === 'error' && options.onError) {
          options.onError(new Error(data.message));
        }
      } catch (e) {
        console.error('Error parsing data from agent:', e);
      }
    }
  });
  
  // Connect to room
  try {
    await room.connect(livekitUrl, token);
    
    // Create disconnect function
    const disconnect = async (): Promise<void> => {
      try {
        await room.disconnect();
      } catch (e) {
        console.error('Error disconnecting from room:', e);
      }
    };
    
    // Publish local audio if requested
    let localAudioTrack: LocalAudioTrack | undefined;
    
    try {
      localAudioTrack = await Room.createLocalAudioTrack({
        noiseSuppression: true,
        echoCancellation: true,
      });
      
      await room.localParticipant.publishTrack(localAudioTrack);
    } catch (e) {
      console.error('Failed to publish local audio track:', e);
      // Continue without local audio if it fails
    }
    
    return {
      room,
      localParticipant: room.localParticipant,
      localAudioTrack,
      disconnect,
    };
  } catch (e: any) {
    if (options.onError) {
      options.onError(new Error(`Failed to connect to LiveKit room: ${e.message}`));
    }
    throw e;
  }
}

/**
 * Handles reconnection to a LiveKit room
 * 
 * This function should be called when connection issues are detected
 * to attempt to restore the connection without creating a new room.
 * 
 * @param room The Room instance to reconnect
 * @param token The LiveKit token to use for reconnection
 * @returns Promise that resolves when reconnection is complete
 * @throws Error if reconnection fails
 * 
 * @example
 * ```typescript
 * try {
 *   await onReconnect(room, token);
 *   console.log("Successfully reconnected to voice agent");
 * } catch (err) {
 *   console.error("Failed to reconnect:", err);
 * }
 * ```
 */
export async function onReconnect(room: Room, token: string): Promise<void> {
  if (!room) {
    throw new Error("Room is not defined");
  }
  
  if (room.connectionState !== ConnectionState.Disconnected) {
    // No need to reconnect if we're already connected or connecting
    return;
  }
  
  try {
    await room.connect(room.url, token);
  } catch (e) {
    console.error('Reconnection failed:', e);
    throw new Error(`Failed to reconnect: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/**
 * Checks if the local participant's microphone is muted
 * 
 * @param room The LiveKit room instance
 * @returns boolean indicating whether the microphone is muted
 * 
 * @example
 * ```typescript
 * const muted = isMuted(room);
 * updateMicrophoneIcon(muted ? 'muted' : 'active');
 * ```
 */
export function isMuted(room: Room): boolean {
  if (!room || !room.localParticipant) {
    return true; // Consider muted if no room or participant
  }
  
  const audioTracks = room.localParticipant.getTrackPublications();
  const audioTrack = Array.from(audioTracks.values()).find(
    pub => pub.kind === 'audio'
  );
  
  return !audioTrack || audioTrack.isMuted;
}

/**
 * Toggles the mute state of the local participant's microphone
 * 
 * @param room The LiveKit room instance
 * @returns Promise that resolves to the new mute state (true = muted)
 * @throws Error if toggling fails
 * 
 * @example
 * ```typescript
 * const micButton = document.getElementById('mic-button');
 * micButton.addEventListener('click', async () => {
 *   const muted = await toggleMic(room);
 *   micButton.textContent = muted ? 'Unmute' : 'Mute';
 * });
 * ```
 */
export async function toggleMic(room: Room): Promise<boolean> {
  if (!room || !room.localParticipant) {
    throw new Error("Room or local participant is not available");
  }
  
  const audioTracks = room.localParticipant.getTrackPublications();
  const audioTrack = Array.from(audioTracks.values()).find(
    pub => pub.kind === 'audio'
  );
  
  if (!audioTrack) {
    throw new Error("No audio track found to toggle");
  }
  
  try {
    if (audioTrack.isMuted) {
      await audioTrack.unmute();
      return false; // Not muted
    } else {
      await audioTrack.mute();
      return true; // Muted
    }
  } catch (e) {
    console.error('Failed to toggle microphone:', e);
    throw new Error(`Failed to toggle microphone: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/**
 * LiveKit connection status
 */
export const ConnectionStatus = ConnectionState;

/**
 * LiveKit connection quality
 */
export const ConnectionQualityStatus = ConnectionQuality; 