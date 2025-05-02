'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { LiveKitRoom, VideoConference, ControlBar } from '@livekit/components-react';
import { Room, RoomOptions, RemoteParticipant, LocalParticipant, DisconnectReason, RoomEvent, ConnectionState, Track } from 'livekit-client';
import { useSession } from 'next-auth/react';
import '@livekit/components-styles';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import Image from 'next/image';

export default function VoiceAgent() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Initializing...');
  const [room, setRoom] = useState<Room | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleTokenRefresh = useCallback(async () => {
    console.log('Token about to expire, refreshing...');
    try {
      const data = await fetchToken();
      if (room) {
        // @ts-expect-error - updateToken exists at runtime but not in types
        await room.updateToken(data.token);
        console.log('Token refreshed successfully');
      }
    } catch (err) {
      console.error('Failed to refresh token:', err);
      setError('Failed to refresh token');
    }
  }, [room]);

  const handleParticipantConnected = useCallback((participant: RemoteParticipant) => {
    console.log('Participant connected:', participant.identity);
    setParticipants(prev => [...prev, participant]);
  }, []);

  const handleParticipantDisconnected = useCallback((participant: RemoteParticipant) => {
    console.log('Participant disconnected:', participant.identity);
    setParticipants(prev => prev.filter(p => p.identity !== participant.identity));
  }, []);

  const handleDisconnected = useCallback((reason?: DisconnectReason) => {
    console.log('Disconnected from room:', reason);
    setRoom(null);
    setConnectionStatus('Disconnected');
  }, []);

  const handleConnectionStateChanged = useCallback((state: ConnectionState) => {
    console.log('Connection state changed:', state);
    if (state === 'disconnected') {
      setConnectionStatus('Disconnected');
      setRoom(null);
    } else if (state === 'connected') {
      setConnectionStatus('Connected');
    }
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('LiveKit error:', error);
    setError(error?.message || 'Connection error');
    setConnectionStatus('Error occurred');
    setRoom(null);
  }, []);

  // Initialize audio after user gesture
  const initializeAudio = useCallback(async (room: Room) => {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');

      // Create audio context after user gesture
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        await audioContextRef.current.resume();
        console.log('AudioContext resumed');
      }

      // Create audio track
      const audioTrack = stream.getAudioTracks()[0];
      console.log('Audio track created:', {
        id: audioTrack.id,
        label: audioTrack.label,
        enabled: audioTrack.enabled,
        muted: audioTrack.muted
      });

      // Publish with logging and timeout
      console.log('About to publish audio track...');
      try {
        await Promise.race([
          room.localParticipant.publishTrack(audioTrack, {
            source: Track.Source.Microphone,
            dtx: true
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Track publish timeout')), 10000)
          )
        ]);
        console.log('Audio track published successfully');
      } catch (pubError) {
        console.error('Failed to publish audio track:', pubError);
        throw pubError;
      }

    } catch (err) {
      console.error('Error initializing audio:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize audio');
    }
  }, []);

  const handleConnected = useCallback((connectedRoom: Room) => {
    if (!connectedRoom) {
      console.error('handleConnected called without a valid room!');
      return;
    }

    // Prevent duplicate connection handling
    if (room === connectedRoom) {
      console.log('Room already connected and handled');
      return;
    }

    try {
      console.log('Initializing audio...');
      
      // Initialize audio context after user gesture
      audioContextRef.current = new AudioContext();
      audioContextRef.current.resume().then(() => {
        console.log('Audio context resumed');
        initializeAudio(connectedRoom);
      });

      // Add event listeners
      connectedRoom.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
      connectedRoom.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      connectedRoom.on(RoomEvent.Disconnected, handleDisconnected);
      connectedRoom.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
      
      console.log('Attached event listeners');

    } catch (err) {
      console.error('Error in handleConnected:', err);
      setError(err instanceof Error ? err.message : 'Failed to handle room connection');
      setConnectionStatus('Connection error');
    }
  }, [handleParticipantConnected, handleParticipantDisconnected, handleDisconnected, handleConnectionStateChanged, initializeAudio, room]);

  // Add cleanup effect that only runs on unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting – doing final cleanup');
      
      if (room) {
        // Remove all event listeners
        room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
        room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
        room.off(RoomEvent.Disconnected, handleDisconnected);
        room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
        room.off(RoomEvent.ConnectionQualityChanged, () => {});
        
        // Only disconnect if still connected
        if (room.state === 'connected') {
          room.disconnect();
        }
      }

      if (audioContextRef.current) {
        console.log('Closing audio context during cleanup');
        audioContextRef.current.close();
      }
    };
  }, []); // Empty dependency array - only runs on unmount

  // Handle explicit disconnect
  const handleDisconnectClick = useCallback(() => {
    if (room) {
      console.log('User clicked Disconnect');
      // Remove all event listeners
      // @ts-expect-error - tokenAboutToExpire exists at runtime but not in types
      room.off('tokenAboutToExpire', handleTokenRefresh);
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
      // @ts-expect-error - dataChannelError exists at runtime but not in types
      room.off('dataChannelError', undefined);
      room.off(RoomEvent.ConnectionQualityChanged, () => {});
      
      // Only disconnect if still connected
      if (room.state === 'connected') {
        room.disconnect();
      }
      setRoom(null);
    }
    if (audioContextRef.current) {
      console.log('User clicked Disconnect: closing audio context');
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [room, handleTokenRefresh, handleParticipantConnected, handleParticipantDisconnected, handleDisconnected, handleConnectionStateChanged]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
        };

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          
          setTranscript(transcript);
          if (event.results[0].isFinal) {
            processVoiceCommand(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event);
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };
      } else {
        setError('Speech recognition is not supported in this browser');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processVoiceCommand = async (text: string) => {
    try {
      console.log('Processing voice command:', text);
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to process voice command');
      }

      const result = await response.json();
      console.log('Voice command response:', result);

      // Send response back to the room chat
      if (room && result.response) {
        room.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify({
            type: 'assistant_response',
            text: result.response,
          }))
        );
      }
    } catch (err) {
      console.error('Error processing voice command:', err);
      setError('Failed to process voice command');
    }
  };

  const handleMicrophoneToggle = useCallback((enabled: boolean) => {
    if (enabled && recognitionRef.current) {
      recognitionRef.current.start();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const fetchToken = async () => {
    const response = await fetch('/api/livekit/token/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to get token: ${response.status}`);
    }

    return response.json();
  };

  const handleJoinCall = async () => {
    try {
      setConnectionStatus('Fetching token...');
      const data = await fetchToken();
      
      console.log('Token response:', {
        hasToken: !!data.token,
        tokenLength: data.token?.length,
        url: data.url,
        identity: data.identity,
        room: data.room
      });

      if (!data.token) throw new Error('No token received');
      if (!data.url) throw new Error('No server URL received');

      // Ensure the URL uses wss:// protocol
      let serverUrl = data.url;
      try {
        const url = new URL(serverUrl);
        if (!url.protocol.startsWith('wss:')) {
          serverUrl = `wss://${url.host}`;
        }
      } catch (err) {
        throw new Error('Invalid server URL format');
      }

      setConnectionStatus('Connecting to room...');
      setToken(data.token);
      setServerUrl(serverUrl);
      setError('');

      // Connect to room and store the instance
      const lkRoom = new Room({
        publishDefaults: {
          simulcast: true,
        },
        dynacast: true,
        adaptiveStream: true,
        audioCaptureDefaults: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Connect first
      await lkRoom.connect(serverUrl, data.token);
      console.log("Room connected successfully");
      
      // Set room after successful connection
      setRoom(lkRoom);

      // Wait for full connection before initializing audio
      lkRoom.once(RoomEvent.Connected, () => {
        console.log("RoomEvent.Connected fired - SID:", (lkRoom as any).sid);
        handleConnected(lkRoom);
      });

      // Add global error handlers
      lkRoom.on(RoomEvent.ConnectionQualityChanged, () => {
        // Suppress connection quality noise
      });

      // Add error handler for data channel issues
      // @ts-expect-error - dataChannelError exists at runtime but not in types
      lkRoom.on('dataChannelError', (err: Error) => {
        console.warn('DataChannel error:', err);
        // Don't set error state - just log it
      });

    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setConnectionStatus('Connection failed');
    }
  };

  useEffect(() => {
    // Clear invalid session cookies
    if (status === 'unauthenticated' && window.location.pathname === '/voice-agent') {
      // Clear next-auth cookies
      document.cookie = 'next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      // Redirect to sign in
      window.location.href = '/api/auth/signin';
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="p-4">
        <div className="text-gray-500">Loading session...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">Please sign in to use the voice assistant</div>
        <button 
          onClick={() => window.location.href = '/api/auth/signin'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-lg font-semibold mb-4">{connectionStatus}</div>
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
        <button
          onClick={handleJoinCall}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Join Call
        </button>
      </div>
    );
  }

  const roomOptions: RoomOptions = {
    publishDefaults: {
      simulcast: true,
    },
    dynacast: true,
    adaptiveStream: true,
    audioCaptureDefaults: {
      autoGainControl: true,
      echoCancellation: true,
      noiseSuppression: true,
    },
  };

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      options={roomOptions}
      onDisconnected={handleDisconnected}
      onError={handleError}
      className="h-full"
      audio={true}
      video={false}
      connectOptions={{
        peerConnectionTimeout: 15000,
        websocketTimeout: 15000,
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Voice Assistant</h1>
        <div className="text-lg font-semibold mb-4">{connectionStatus}</div>
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
        {room && room.state === 'connected' && (
          <>
            <VoiceAssistant room={room} />
            <button
              onClick={handleDisconnectClick}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Participants</h2>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.identity} className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <Image
                        src="/default-avatar.svg"
                        alt={participant.identity}
                        width={32}
                        height={32}
                        className="rounded-full"
                        priority
                      />
                    </div>
                    <span>{participant.identity}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </LiveKitRoom>
  );
}