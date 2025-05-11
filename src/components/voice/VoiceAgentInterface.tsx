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
  RoomEvent 
} from 'livekit-client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

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
      return localStorage.getItem('jarvis_minimized') === 'true';
    }
    return false;
  });
  const [unread, setUnread] = useState(false);
  
  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  const agentAudioTrackRef = useRef<RemoteAudioTrack | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const connectToLiveKit = useCallback(async () => {
    if (!session?.user) {
      setError('You must be logged in to use the voice agent.');
      return;
    }

    setIsLoading(true);
    
    // Generate a unique room name for this session
    const generatedRoomName = `optiflow-jarvis-${Date.now()}`;
    setRoomName(generatedRoomName);
    
    // First, dispatch the agent to the room
    try {
      const dispatchResponse = await fetch('/api/livekit/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: generatedRoomName })
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
      const tokenResponse = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: generatedRoomName })
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
          toast.success('Jarvis agent has joined the room');
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
            } else if (data.type === 'user_transcript') {
              setTranscript(prev => prev + '\nYou: ' + data.transcript);
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
      const audioTrack = await Room.createLocalAudioTrack({
        noiseSuppression: true,
        echoCancellation: true,
      });
      
      await newRoom.localParticipant.publishTrack(audioTrack);
      localAudioTrackRef.current = audioTrack;
      console.log('Local audio track published');
      setIsListening(true);
      toast.success('Connected to Jarvis voice agent');
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
      
      toast.success('Disconnected from Jarvis voice agent');
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
      localStorage.setItem('jarvis_minimized', minimized ? 'true' : 'false');
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
    <div className={`bg-[#18181B] text-[#E5E7EB] shadow-lg rounded-lg p-6 border border-[#374151] ${className} fixed bottom-6 right-6 z-50 w-[360px] max-w-[90vw]`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-[#22D3EE]">Jarvis Voice Assistant</h2>
        <button
          onClick={() => setMinimized(true)}
          className="ml-2 px-2 py-1 rounded hover:bg-[#22223B] text-[#A855F7] text-lg font-bold"
          title="Minimize"
        >
          &minus;
        </button>
      </div>
      
      {error && <ErrorMessage message={error} onDismiss={clearError} />}
      
      <div className="flex flex-col space-y-6">
        <button
          onClick={isConnected ? disconnectFromRoom : connectToLiveKit}
          disabled={isLoading}
          className={`px-5 py-3 rounded-md font-medium transition-colors ${
            isConnected 
              ? 'bg-[#4B5563] hover:bg-[#6B7280] text-[#E5E7EB] border border-[#A855F7]' 
              : 'bg-[#06B6D4] hover:bg-[#0EA5E9] text-[#111111] font-semibold'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading 
            ? 'Connecting...' 
            : isConnected 
              ? 'Disconnect from Jarvis' 
              : 'Connect to Jarvis'
          }
        </button>
        
        {isConnected && (
          <div className="flex items-center space-x-3 text-sm font-medium bg-[#111111] p-3 rounded-md border border-[#374151]">
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
        
        <div className="border border-[#374151] rounded-md p-4 bg-[#111111] min-h-[240px] max-h-[400px] overflow-y-auto">
          <h3 className="font-medium mb-4 text-[#9CA3AF]">Conversation:</h3>
          
          <div className="space-y-2">
            {!transcript && !agentResponse && (
              <p className="text-[#6B7280] italic text-sm">
                {isConnected 
                  ? 'Start speaking or type a message below to interact with Jarvis' 
                  : 'Connect to Jarvis to start a conversation'}
              </p>
            )}
            
            {transcript && (
              <pre className="whitespace-pre-wrap text-sm font-mono text-[#D1D5DB] bg-[#1F2937] p-3 rounded-md border-l-2 border-[#6B7280]">{transcript}</pre>
            )}
            
            {agentResponse && (
              <pre className="whitespace-pre-wrap text-sm font-mono text-[#22D3EE] bg-[#1E293B] p-3 rounded-md border-l-2 border-[#22D3EE]">{agentResponse}</pre>
            )}
          </div>
        </div>
        
        {isConnected && (
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem('message') as HTMLInputElement;
              
              if (input.value) {
                await sendTextMessage(input.value);
                input.value = '';
              }
            }}
            className="flex space-x-3"
          >
            <input
              type="text"
              name="message"
              placeholder="Type a message to Jarvis"
              className="flex-1 px-4 py-3 bg-[#111111] border border-[#374151] rounded-md focus:outline-none focus:ring-2 focus:ring-[#22D3EE] text-[#E5E7EB] placeholder-[#6B7280]"
            />
            <button 
              type="submit"
              className="px-5 py-3 bg-[#A855F7] hover:bg-[#C026D3] text-white rounded-md transition-colors font-medium"
            >
              Send
            </button>
          </form>
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
  const bgColor = color === 'purple' ? '[#A855F7]' : '[#22D3EE]';
  
  return (
    <div className="relative inline-flex h-3 w-3">
      <span className={`absolute inline-flex h-full w-full rounded-full ${active ? `bg-${bgColor}` : 'bg-[#4B5563]'} opacity-75 ${active ? 'animate-ping' : ''}`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${active ? `bg-${bgColor}` : 'bg-[#4B5563]'}`}></span>
    </div>
  );
};

export default VoiceAgentInterface; 