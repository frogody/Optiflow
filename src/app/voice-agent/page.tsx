'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from '@livekit/components-react';
import { Track, Room, RoomEvent, ConnectionState, RoomOptions, DisconnectReason } from 'livekit-client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import '@livekit/components-styles';

export default function VoiceAgent() {
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const initializeAudio = useCallback(async () => {
    try {
      if (audioContext) {
        await audioContext.resume();
        return;
      }

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      await ctx.resume();
      setAudioContext(ctx);
      console.log('AudioContext initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      setError('Failed to initialize audio. Please check your browser permissions.');
    }
  }, [audioContext]);

  const getToken = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      console.log('Fetching token from /api/livekit/token');
      
      const response = await fetch('/api/livekit/token');
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          throw new Error('Please log in to continue');
        }
        throw new Error(data.error || 'Failed to get token');
      }
      
      if (!data.token) {
        throw new Error('No token received from server');
      }
      
      setToken(data.token);
      setDebugInfo({
        room: data.room,
        participant: data.participant,
        url: data.url,
        userId: data.userId
      });

      // Reset retry count on successful token fetch
      setRetryCount(0);
    } catch (e) {
      console.error('Error getting token:', e);
      setError(e instanceof Error ? e.message : 'Failed to get token');
      
      // Implement retry logic
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(getToken, 2000 * Math.pow(2, retryCount)); // Exponential backoff
      }
    } finally {
      setIsConnecting(false);
    }
  }, [router, retryCount]);

  useEffect(() => {
    // Check authentication
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && !token) {
      getToken();
    }

    // Cleanup function
    return () => {
      if (room) {
        room.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [status, router, token, getToken]);

  const handleRoomDisconnect = useCallback((reason?: DisconnectReason) => {
    console.log('Disconnected from room, reason:', reason);
    setRoom(null);
    
    // Handle specific disconnect reasons
    if (reason === DisconnectReason.CLIENT_INITIATED) {
      // Do nothing, this was intentional
      return;
    }
    
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      getToken();
    }
  }, [retryCount, getToken]);

  if (status === 'loading' || isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
          {retryCount > 0 && (
            <div className="text-sm text-gray-500">
              Retry attempt {retryCount} of {maxRetries}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-red-500 text-xl mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => {
            setError(null);
            setRetryCount(0);
            getToken();
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry Connection
        </button>
        {debugInfo && process.env.NODE_ENV === 'development' && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Debug Info:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  if (!token) {
    return <div className="flex items-center justify-center min-h-screen">Initializing...</div>;
  }

  const roomOptions: RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
    stopLocalTrackOnUnpublish: true,
    reconnect: true,
    rtcConfig: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    }
  };

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      onConnected={(room) => {
        console.log('Connected to room:', room.name);
        setRoom(room);
        initializeAudio();

        room.on(RoomEvent.Disconnected, handleRoomDisconnect);
        
        room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
          console.log('Connection state changed:', state);
          if (state === ConnectionState.Disconnected) {
            handleRoomDisconnect();
          }
        });

        room.on(RoomEvent.MediaDevicesError, (e: Error) => {
          console.error('Media device error:', e);
          setError(`Media device error: ${e.message}. Please check your camera/microphone permissions.`);
        });
      }}
      onDisconnected={handleRoomDisconnect}
      onError={(error) => {
        console.error('LiveKit error:', error);
        setError(error.message);
        if (error.message.includes('token')) {
          getToken();
        }
      }}
      roomOptions={roomOptions}
      data-lk-theme="default"
    >
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Voice Assistant</h1>
        <div className="space-y-4">
          <VideoConference />
          <RoomAudioRenderer />
          <ControlBar />
          {process.env.NODE_ENV === 'development' && room && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold">Debug Info:</h3>
              <pre className="text-sm">
                Room: {room.name}
                <br />
                Connection State: {room.connectionState}
                <br />
                Participants: {room.participants.size}
                <br />
                Retry Count: {retryCount}
              </pre>
            </div>
          )}
        </div>
      </div>
    </LiveKitRoom>
  );
} 