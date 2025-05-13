/** @jsxImportSource react */
'use client';

import { 
  DataPacket_Kind, 
  LocalAudioTrack, 
  LocalParticipant, 
  ParticipantEvent, 
  RemoteAudioTrack, 
  RemoteParticipant, 
  Room, 
  RoomEvent, 
  createLocalAudioTrack 
} from 'livekit-client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import ConnectionDebugger from './ConnectionDebugger';
import DivBarVisualizer from './DivBarVisualizer';
import ErrorMessage from './ErrorMessage';

interface VoiceAgentInterfaceProps {
  className?: string;
  debug?: boolean;
}

const ORB_SIZE = 64;

const VoiceAgentInterface: React.FC<VoiceAgentInterfaceProps> = ({ 
  className,
  debug = process.env.NODE_ENV === 'development'
}) => {
  // Use a try-catch for session to handle errors gracefully
  const sessionData = (() => {
    try {
      return useSession();
    } catch (error) {
      console.warn('NextAuth session error (safe to ignore in test mode):', error);
      return { data: null, status: 'unauthenticated' };
    }
  })();
  
  // Handle undefined data property safely
  const session = sessionData?.data || null;
  
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [agentResponse, setAgentResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomName, setRoomName] = useState<string>('');
  const [minimized, setMinimized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sync_minimized') === 'true';
    }
    return false;
  });
  const [unread, setUnread] = useState(false);
  const [showDebugger, setShowDebugger] = useState(debug);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  const agentAudioTrackRef = useRef<RemoteAudioTrack | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const retryAttemptedRef = useRef<boolean>(false);

  const connectToLiveKit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Increment connection attempts counter
    setConnectionAttempts(prev => prev + 1);
    const currentAttempt = connectionAttempts + 1;
    
    // Log connection attempt
    console.log(`LiveKit connection attempt #${currentAttempt}`);
    
    try {
      // Generate a unique room name for this session
      const generatedRoomName = `sync-jarvis-${Date.now()}`;
      setRoomName(generatedRoomName);
  
      // Use session user ID or generate anonymous ID
      const userId = session?.user?.id || `anon-${Math.random().toString(36).slice(2)}`;
      
      // First, dispatch the agent to the room
      try {
        // Use debug endpoint in development if not authenticated
        const dispatchEndpoint = process.env.NODE_ENV === 'development' 
          ? '/api/livekit/debug-dispatch' 
          : '/api/livekit/dispatch';
        
        console.log(`Using dispatch endpoint: ${dispatchEndpoint}`);
        
        // Define headers with bypass token if needed
        const headers: HeadersInit = { 
          'Content-Type': 'application/json',
        };
        
        // Add bypass header for all environments when not authenticated
        if (!session?.user?.id) {
          headers['x-agent-bypass'] = 'production-bypass-token';
          console.log('Adding bypass token header for force-join request');
        }
        
        const dispatchResponse = await fetch(dispatchEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ roomName: generatedRoomName, userId })
        });
        
        if (!dispatchResponse.ok) {
          const errorText = await dispatchResponse.text();
          let errorMessage = dispatchResponse.statusText;
          
          try {
            // Try to parse as JSON for more detailed error
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.details || errorMessage;
            console.error('Agent dispatch error details:', errorData);
          } catch (e) {
            // If not JSON, use the text as is
            console.error('Agent dispatch error (raw):', errorText);
          }
          
          throw new Error(`Failed to dispatch agent: ${errorMessage}`);
        }
        
        console.log('Agent dispatched successfully');
      } catch (e: any) {
        console.error('Error dispatching agent:', e);
        setError(`Failed to dispatch agent: ${e.message}`);
        setIsLoading(false);
        return;
      }
      
      // Now get a token for the user to join the room
      let token = '';
      let livekitUrl = '';
      try {
        // Use debug endpoint in development
        const tokenEndpoint = process.env.NODE_ENV === 'development' 
          ? '/api/livekit/debug-token' 
          : '/api/livekit/token';
        
        console.log(`Using token endpoint: ${tokenEndpoint}`);
        
        // Set the same headers for token request as for dispatch
        const tokenHeaders: HeadersInit = { 
          'Content-Type': 'application/json',
        };
        
        // Add bypass header for unauthenticated requests
        if (!session?.user?.id) {
          tokenHeaders['x-agent-bypass'] = 'production-bypass-token';
          console.log('Adding bypass token header for token request');
        }
        
        const tokenResponse = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: tokenHeaders,
          body: JSON.stringify({ room: generatedRoomName, userId })
        });
        
        if (!tokenResponse.ok) {
          throw new Error('Failed to fetch LiveKit token: ' + tokenResponse.statusText);
        }
        
        const tokenData = await tokenResponse.json();
        
        // Log the token data structure to debug
        console.log('Token response structure:', {
          hasToken: !!tokenData.token,
          tokenType: typeof tokenData.token,
          tokenLength: tokenData.token ? tokenData.token.length : 0,
          urlPresent: !!tokenData.url
        });
        
        // Extract token and URL safely
        token = tokenData.token;
        livekitUrl = tokenData.url;
        
        // Fix URL format: ensure we're using a valid URL format that won't trigger TLD errors
        // Convert from wss:// to https:// if needed
        if (livekitUrl && livekitUrl.startsWith('wss://')) {
          livekitUrl = livekitUrl.replace('wss://', 'https://');
          console.log('Converted LiveKit URL to https format:', livekitUrl);
        }
        
        if (!token || !livekitUrl) {
          throw new Error('Invalid LiveKit configuration received from server');
        }
        
        console.log('Connecting to LiveKit with URL:', livekitUrl);
      } catch (e: any) {
        console.error('Error fetching token:', e);
        setError(`Failed to get LiveKit token: ${e.message}`);
        setIsLoading(false);
        return;
      }
      
      // Create and configure room with increased timeout
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        // Increase connection timeout
        connectionTimeout: 30000, // 30 seconds
      });
      
      // Set up event listeners
      newRoom
        .on(RoomEvent.Connected, () => {
          console.log('LiveKit room connected successfully');
        })
        .on(RoomEvent.Connecting, () => {
          console.log('Connecting to LiveKit room...');
        })
        .on(RoomEvent.Reconnecting, () => {
          console.log('Reconnecting to LiveKit room...');
        })
        .on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
          console.log('Participant connected:', participant.identity);
          
          // Check if this is an agent
          if (participant.identity.startsWith('agent-')) {
            toast.success('Sync agent has joined the room');
          }
          
          // Listen for agent tracks
          participant.on(ParticipantEvent.TrackSubscribed, (track) => {
            if (track.kind === 'audio' && participant.identity.startsWith('agent-')) {
              agentAudioTrackRef.current = track as RemoteAudioTrack;
              const audioEl = track.attach();
              audioEl.autoplay = true;
              audioEl.playsInline = true;
              audioElementRef.current = audioEl;
              document.body.appendChild(audioEl);
              console.log('Agent audio track attached');
              setIsAgentSpeaking(true);
            }
          });
          
          participant.on(ParticipantEvent.TrackUnsubscribed, (track) => {
            if (track.kind === 'audio' && participant.identity.startsWith('agent-')) {
              track.detach();
              setIsAgentSpeaking(false);
            }
          });
        })
        .on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
          if (participant.identity.startsWith('agent-')) {
            toast.error('Agent has disconnected from the room');
            setAgentResponse(prev => prev + '\n[System: Agent disconnected from room]');
          }
        })
        .on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: RemoteParticipant, kind?: DataPacket_Kind) => {
          if (participant?.identity.startsWith('agent-') && kind === DataPacket_Kind.RELIABLE) {
            const message = new TextDecoder().decode(payload);
            try {
              const data = JSON.parse(message);
              if (data.type === 'agent_transcript') {
                setAgentResponse(prev => prev + '\nAgent: ' + data.transcript);
                if (minimized) setUnread(true);
              } else if (data.type === 'user_transcript') {
                console.log('Received user transcript:', data.transcript);
                setTranscript(prev => prev + '\nYou: ' + data.transcript);
                const transcriptContainer = document.querySelector('.transcript-container');
                if (transcriptContainer) {
                  transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
                }
              } else if (data.type === 'error') {
                toast.error(data.message);
              }
            } catch (e) {
              console.error('Error parsing data from agent:', e);
            }
          }
        })
        .on(RoomEvent.Disconnected, (reason) => {
          console.log('Disconnected from LiveKit room. Reason:', reason);
          setIsConnected(false);
          setRoom(null);
          setIsListening(false);
          setIsLoading(false);
          
          // Clean up audio elements
          if (audioElementRef.current) {
            audioElementRef.current.remove();
            audioElementRef.current = null;
          }
        })
        .on(RoomEvent.MediaDevicesError, (e: Error) => {
          console.error('Media device error:', e);
          setError(`Media device error: ${e.message}`);
        })
        .on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
          console.log(`Connection quality changed to ${quality} for ${participant.identity}`);
        })
        .on(RoomEvent.SignalConnected, () => {
          console.log('Signal connection established');
        });
      
      // Connect to room and publish local audio
      try {
        console.log(`Connecting to LiveKit room with URL: ${livekitUrl}`);
        
        // Ensure token is a string, not an object
        if (typeof token !== 'string') {
          console.error('Token is not a string:', token);
          throw new Error('Invalid token format');
        }
        
        // Make sure URL is in the right format for WebSocket connection (wss://)
        let connectionUrl = livekitUrl;
        if (connectionUrl.startsWith('https://')) {
          connectionUrl = connectionUrl.replace('https://', 'wss://');
          console.log('Corrected connection URL for WebSocket:', connectionUrl);
        }
        
        await newRoom.connect(connectionUrl, token, {
          autoSubscribe: true,
        });
        console.log('Connected to LiveKit room:', newRoom.name);
        setIsConnected(true);
        setRoom(newRoom);
        setError(null);
        
        // Request microphone permission and publish local audio
        try {
          console.log('Requesting microphone access...');
          // Give the browser more time after connection before requesting microphone
          await new Promise(resolve => setTimeout(resolve, 2000)); // Increased from 1000ms to 2000ms
          
          const audioTrack = await createLocalAudioTrack({
            noiseSuppression: true,
            echoCancellation: true,
            // Additional constraints for more reliable audio capture
            constraints: {
              audio: {
                channelCount: 1,
                sampleRate: 44100,
              }
            }
          });
          
          console.log('Audio track created, waiting for engine to be ready...');
          // Add an additional delay to ensure the audio engine is fully initialized
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('Attempting to publish audio track...');
          await newRoom.localParticipant.publishTrack(audioTrack, {
            // Use more reliable publishing options
            source: 'microphone',
            stopMicTrackOnMute: false,
            // Much longer timeout for publishing
            publishTimeout: 30000, // 30 seconds (doubled from 15)
          });
          
          localAudioTrackRef.current = audioTrack;
          console.log('Local audio track published successfully');
          setIsListening(true);
          toast.success('Connected to Sync voice agent');
        } catch (audioError: any) {
          console.error('Failed to publish audio track:', audioError);
          // Don't disconnect - just update UI to show connected but not listening
          setIsListening(false);
          
          // Make a second attempt to publish the track after a delay
          if (!retryAttemptedRef.current) {
            retryAttemptedRef.current = true;
            console.log('Scheduling retry for audio publishing...');
            
            setTimeout(async () => {
              try {
                console.log('Retrying audio track publishing...');
                const retryAudioTrack = await createLocalAudioTrack({
                  noiseSuppression: true,
                  echoCancellation: true,
                });
                
                await newRoom.localParticipant.publishTrack(retryAudioTrack, {
                  source: 'microphone',
                  stopMicTrackOnMute: false,
                  publishTimeout: 30000,
                });
                
                localAudioTrackRef.current = retryAudioTrack;
                console.log('Retry successful! Audio track published');
                setIsListening(true);
                toast.success('Microphone connected successfully');
              } catch (retryError) {
                console.error('Retry failed:', retryError);
                toast.error('Connected, but microphone access failed even after retry');
              }
            }, 5000); // Wait 5 seconds before retry
          } else {
            toast.error('Connected, but microphone access failed: ' + audioError.message);
          }
        }
      } catch (e: any) {
        console.error('Failed to connect to LiveKit room:', e);
        
        // Categorize and handle specific error types
        let errorMessage = 'Connection failed';
        
        // Check for authorization errors
        if (e.message && (
            e.message.includes('unauthorized') || 
            e.message.includes('invalid authorization') ||
            e.message.includes('invalid token')
          )) {
          errorMessage = 'Authorization failed. Please try again.';
          console.error('Auth token error:', e.message);
        } 
        // Check for network errors
        else if (e.message && (
            e.message.includes('network') || 
            e.message.includes('connection') ||
            e.message.includes('timeout')
          )) {
          errorMessage = 'Network connection failed. Please check your connection.';
        }
        // Add detailed error info to the message
        errorMessage += ' ' + e.message;
        
        setError(errorMessage);
        setIsConnected(false);
        setRoom(null);
        toast.error('Failed to connect to voice agent');
      }
    } catch (e: any) {
      console.error('Unexpected error during connection:', e);
      setError(`Unexpected error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [session, connectionAttempts]);
  
  const disconnectFromRoom = useCallback(async () => {
    if (room) {
      // Stop the local audio track
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current = null;
      }
      
      // Disconnect from the room
      await room.disconnect();
      setRoom(null);
      setIsConnected(false);
      setIsListening(false);
      setIsAgentSpeaking(false);
      
      // Clear transcript and response
      setTranscript('');
      setAgentResponse('');
      
      toast.success('Disconnected from Sync voice agent');
    }
  }, [room]);
  
  // Send a text message for testing
  const sendTextMessage = async (message: string) => {
    if (room && room.localParticipant && isConnected) {
      const strData = JSON.stringify({ type: 'user_text_input', text: message });
      const data = new TextEncoder().encode(strData);
      await room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE);
      setTranscript(prev => prev + `\nYou (text): ${message}`);
    }
  };
  
  // Clear error message
  const clearError = () => {
    setError(null);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
      }
      
      if (room) {
        room.disconnect();
      }
      
      if (audioElementRef.current) {
        audioElementRef.current.remove();
      }
    };
  }, [room]);

  // Persist minimized state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sync_minimized', minimized ? 'true' : 'false');
    }
  }, [minimized]);

  // Mark unread if agent responds while minimized
  useEffect(() => {
    if (minimized && agentResponse) {
      setUnread(true);
    }
  }, [agentResponse, minimized]);

  // Clear unread when expanded
  useEffect(() => {
    if (!minimized) setUnread(false);
  }, [minimized]);

  // New function to force the agent to join the room
  const forceAgentToJoin = async () => {
    if (!room || !roomName) return;
    
    try {
      setIsLoading(true);

      // Use debug endpoint in development if not authenticated
      const forceJoinEndpoint = process.env.NODE_ENV === 'development' 
        ? '/api/livekit/debug-force-join' 
        : '/api/livekit/force-join';
      
      console.log(`Using force-join endpoint: ${forceJoinEndpoint}`);

      // Define headers with bypass token if needed
      const headers: HeadersInit = { 
        'Content-Type': 'application/json',
      };
      
      // Add bypass header if not authenticated
      if (!session?.user?.id) {
        headers['x-agent-bypass'] = 'production-bypass-token';
        console.log('Adding bypass token header for force-join request');
      }
      
      // First attempt
      let response = await fetch(forceJoinEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ roomName })
      });
      
      // If the first attempt fails, try once more after a delay
      if (!response.ok) {
        console.log('First force-join attempt failed, retrying in 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        response = await fetch(forceJoinEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ roomName })
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to force agent to join: ${errorData.error || response.statusText}`);
      }
      
      toast.success('Manual agent join command sent');
      setAgentResponse(prev => prev + '\n[System: Manual agent join command sent]');
      
      // Wait for agent to connect for a bit
      console.log('Waiting for agent to join room...');
      let waitTime = 0;
      const checkInterval = setInterval(() => {
        const hasAgent = room.participants.size > 1 || 
                       Array.from(room.participants.values()).some(p => p.identity.startsWith('agent-'));
        
        if (hasAgent) {
          clearInterval(checkInterval);
          toast.success('Agent has joined the room!');
        } else if (waitTime >= 10000) { // Wait up to 10 seconds
          clearInterval(checkInterval);
          console.log('Agent did not join within timeout period');
        }
        
        waitTime += 1000;
      }, 1000);
      
    } catch (e: any) {
      console.error('Error forcing agent to join:', e);
      setError(`Failed to force agent to join: ${e.message}`);
      toast.error('Failed to force agent to join');
    } finally {
      setIsLoading(false);
    }
  };

  // Full disconnect and reconnect
  const reconnectAgent = useCallback(async () => {
    // First set loading state
    setIsLoading(true);
    toast.info('Reconnecting agent with a fresh session...');
    
    // Clean up the old room if it exists
    if (room) {
      try {
        // Stop the local audio track
        if (localAudioTrackRef.current) {
          localAudioTrackRef.current.stop();
          localAudioTrackRef.current = null;
        }
        
        // Disconnect from the room
        await room.disconnect();
        setRoom(null);
        setIsConnected(false);
        setIsListening(false);
        setIsAgentSpeaking(false);
        
        // Clear transcript and response
        setTranscript('');
        setAgentResponse('');
        
        console.log('Successfully disconnected from previous room');
      } catch (error) {
        console.error('Error during disconnect:', error);
        // Continue with reconnect attempt even if disconnection fails
      }
    }
    
    // Set a short timeout to ensure cleanup is complete
    console.log('Waiting before reconnecting...');
    
    setTimeout(() => {
      // Then connect again, which will create a fresh room and agent
      connectToLiveKit();
    }, 2000); // longer delay of 2 seconds
  }, [room, connectToLiveKit]);

  const handleMixerClick = () => {
    if (!isConnected && !isLoading) connectToLiveKit();
  };

  if (minimized) {
    // Orb mode
    return (
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        style={{ width: ORB_SIZE, height: ORB_SIZE }}
        onClick={() => setMinimized(false)}
        title="Open Jarvis Voice Assistant"
      >
        <div className={`relative flex items-center justify-center w-full h-full rounded-full shadow-lg bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 animate-pulse ${isListening ? 'ring-4 ring-cyan-300' : ''} ${isAgentSpeaking ? 'ring-4 ring-purple-400' : ''}`}
        >
          {/* Animated orb */}
          <span className="absolute w-full h-full rounded-full bg-cyan-400 opacity-30 blur-xl animate-ping" />
          <span className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 shadow-inner" />
          {/* Notification badge */}
          {unread && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white animate-bounce" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[95vw] p-0 ${!isConnected ? 'cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-[#22D3EE]/60 transition-all' : ''}`}
      style={{
        borderRadius: '1.5rem',
        background: 'linear-gradient(135deg, #23243a 60%, #2d1e4f 100%)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1.5px solid rgba(34,211,238,0.12)',
        overflow: 'hidden',
      }}
      onClick={!isConnected && !isLoading ? handleMixerClick : undefined}
      tabIndex={!isConnected ? 0 : -1}
      aria-label={!isConnected ? 'Click to connect to Sync Voice Mixer' : undefined}
    >
      {/* Mixer header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2 bg-gradient-to-r from-[#23243a]/80 to-[#2d1e4f]/80">
        <h2 className="text-xl font-bold text-[#22D3EE] tracking-widest drop-shadow">Sync Voice Mixer</h2>
        <div className="flex items-center space-x-2">
          {debug && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDebugger(!showDebugger);
              }}
              className="p-1 rounded-full hover:bg-[#22223B] text-[#22D3EE] text-sm font-bold transition"
              title="Toggle Debug Panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(true);
            }}
            className="p-1 rounded-full hover:bg-[#22223B] text-[#A855F7] text-lg font-bold transition"
            title="Minimize"
          >
            &minus;
          </button>
        </div>
      </div>
      
      {/* Connection Debugger */}
      {showDebugger && (
        <div className="px-6 pt-3">
          <ConnectionDebugger
            isConnected={isConnected}
            isListening={isListening}
            isAgentSpeaking={isAgentSpeaking}
            roomName={roomName}
            error={error}
            isLoading={isLoading}
          />
        </div>
      )}
      
      {/* Visualizer */}
      {isConnected && (
        <div className="flex flex-col items-center justify-center px-6 pt-2 pb-4">
          <div className="w-full flex flex-col items-center">
            <DivBarVisualizer
              width={320}
              height={36}
              barCount={24}
              isActive={isAgentSpeaking}
              className="my-2"
            />
            <div className="text-xs text-[#A855F7] mt-1 tracking-widest uppercase">
              {isAgentSpeaking ? 'Agent Speaking' : isListening ? 'Listening...' : 'Connected'}
            </div>
          </div>
        </div>
      )}
      {/* Controls and status */}
      <div className="flex flex-col space-y-6 px-6 pb-6">
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={clearError}
          />
        )}
        
        {process.env.NODE_ENV === 'development' && !session?.user?.id && (
          <div className="text-xs text-yellow-400 text-center mb-2 font-mono">
            Using debug endpoints (auth bypassed)
          </div>
        )}
        <button
          onClick={isConnected ? disconnectFromRoom : connectToLiveKit}
          disabled={isLoading}
          className={`w-full py-3 rounded-full font-semibold text-lg shadow transition-all duration-200
            ${isConnected
              ? 'bg-gradient-to-r from-[#4B5563] to-[#A855F7] text-white hover:from-[#6B7280] hover:to-[#C084FC] border border-[#A855F7]'
              : 'bg-gradient-to-r from-[#22D3EE] to-[#A855F7] text-[#18181B] hover:from-[#06B6D4] hover:to-[#C084FC]'}
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading 
            ? 'Connecting...' 
            : isConnected 
              ? 'Disconnect from Sync' 
              : 'Connect to Sync'
          }
        </button>
        {/* Add buttons for force join and reconnect */}
        <div className="flex space-x-2">
          {/* Force join button */}
          {isConnected && !isAgentSpeaking && (
            <button
              onClick={forceAgentToJoin}
              disabled={isLoading}
              className="flex-1 py-3 rounded-full font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-[#18181B] hover:from-yellow-300 hover:to-orange-400 shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Force Sync to Join
            </button>
          )}
          {/* Reconnect button - always visible when connected */}
          {isConnected && (
            <button
              onClick={reconnectAgent}
              disabled={isLoading}
              className="flex-1 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-400 hover:to-fuchsia-500 shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Reconnect Agent
            </button>
          )}
        </div>
        {isConnected && (
          <div className="flex items-center space-x-3 text-sm font-medium bg-[#23243a] p-3 rounded-xl border border-[#374151] mt-2">
            <StatusIndicator active={isListening} />
            <span>
              {isListening ? 'Listening...' : 'Connected, not listening'}
            </span>
            {isAgentSpeaking && (
              <div className="flex items-center ml-4">
                <StatusIndicator active={true} color="purple" />
                <span className="ml-2 text-[#A855F7]">Agent is speaking</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface StatusIndicatorProps {
  active: boolean;
  color?: 'blue' | 'purple';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ active, color = 'blue' }) => {
  // Use predefined class names instead of dynamic template interpolation
  const activeClass = active ? 
    (color === 'purple' ? 'bg-[#A855F7]' : 'bg-[#22D3EE]') : 
    'bg-[#4B5563]';
  
  const animationClass = active ? 'animate-ping' : '';
  
  return (
    <div className="relative inline-flex h-3 w-3">
      <span className={`absolute inline-flex h-full w-full rounded-full ${activeClass} opacity-75 ${animationClass}`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${activeClass}`}></span>
    </div>
  );
};

export default VoiceAgentInterface; 