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

import DivBarVisualizer from './DivBarVisualizer';
import ErrorMessage from './ErrorMessage';

interface VoiceAgentInterfaceProps {
  className?: string;
}

const ORB_SIZE = 64;

const VoiceAgentInterface: React.FC<VoiceAgentInterfaceProps> = ({ className }) => {
  const { data: session } = useSession();
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
  
  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  const agentAudioTrackRef = useRef<RemoteAudioTrack | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const connectToLiveKit = useCallback(async () => {
    setIsLoading(true);
    
    // Generate a unique room name for this session
    const generatedRoomName = `sync-jarvis-${Date.now()}`;
    setRoomName(generatedRoomName);

    // Use session user ID or generate anonymous ID
    const userId = session?.user?.id || `anon-${Math.random().toString(36).slice(2)}`;
    
    // First, dispatch the agent to the room
    try {
      // Use debug endpoint in development if not authenticated
      const dispatchEndpoint = process.env.NODE_ENV === 'development' && !session?.user?.id 
        ? '/api/livekit/debug-dispatch' 
        : '/api/livekit/dispatch';
      
      console.log(`Using dispatch endpoint: ${dispatchEndpoint}`);
      
      const dispatchResponse = await fetch(dispatchEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: generatedRoomName, userId })
      });
      
      if (!dispatchResponse.ok) {
        const errorData = await dispatchResponse.json();
        throw new Error(`Failed to dispatch agent: ${errorData.error || dispatchResponse.statusText}`);
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
      // Use debug endpoint in development if not authenticated
      const tokenEndpoint = process.env.NODE_ENV === 'development' && !session?.user?.id 
        ? '/api/livekit/debug-token' 
        : '/api/livekit/token';
      
      console.log(`Using token endpoint: ${tokenEndpoint}`);
      
      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: generatedRoomName, userId })
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
      console.error('Error fetching token:', e);
      setError(`Failed to get LiveKit token: ${e.message}`);
      setIsLoading(false);
      return;
    }
    
    // Create and configure room
    const newRoom = new Room({
      adaptiveStream: true,
      dynacast: true,
    });
    
    // Set up event listeners
    newRoom
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
      .on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from LiveKit room');
        setIsConnected(false);
        setRoom(null);
        setIsListening(false);
        setIsLoading(false);
        
        // Clean up audio elements
        if (audioElementRef.current) {
          audioElementRef.current.remove();
          audioElementRef.current = null;
        }
      });
    
    // Connect to room and publish local audio
    try {
      await newRoom.connect(livekitUrl, token);
      console.log('Connected to LiveKit room:', newRoom.name);
      setIsConnected(true);
      setRoom(newRoom);
      setError(null);
      
      // Publish local audio
      const audioTrack = await createLocalAudioTrack({
        noiseSuppression: true,
        echoCancellation: true,
      });
      
      await newRoom.localParticipant.publishTrack(audioTrack);
      localAudioTrackRef.current = audioTrack;
      console.log('Local audio track published');
      setIsListening(true);
      toast.success('Connected to Sync voice agent');
    } catch (e: any) {
      console.error('Failed to connect to LiveKit room or publish audio:', e);
      setError('Connection failed: ' + e.message);
      setIsConnected(false);
      setRoom(null);
      toast.error('Failed to connect to voice agent');
    } finally {
      setIsLoading(false);
    }
  }, [session]);
  
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
      const forceJoinEndpoint = process.env.NODE_ENV === 'development' && !session?.user?.id 
        ? '/api/livekit/debug-force-join' 
        : '/api/livekit/force-join';
      
      console.log(`Using force-join endpoint: ${forceJoinEndpoint}`);

      const response = await fetch(forceJoinEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to force agent to join: ${errorData.error || response.statusText}`);
      }
      
      toast.success('Manual agent join command sent');
      setAgentResponse(prev => prev + '\n[System: Manual agent join command sent]');
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
    if (room) {
      // First disconnect properly
      await disconnectFromRoom();
    }
    
    // Set a short timeout to ensure cleanup is complete
    setTimeout(() => {
      // Then connect again, which will create a fresh room and agent
      connectToLiveKit();
    }, 1000);
    
    toast.success('Reconnecting agent with a fresh session...');
  }, [room, disconnectFromRoom, connectToLiveKit]);

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
        <button
          onClick={() => setMinimized(true)}
          className="ml-2 px-2 py-1 rounded-full hover:bg-[#22223B] text-[#A855F7] text-lg font-bold transition"
          title="Minimize"
        >
          &minus;
        </button>
      </div>
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