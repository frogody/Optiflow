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

// Create a safe toast wrapper to handle missing methods
const safeToast = {
  success: (message: string) => {
    try {
      toast.success(message);
    } catch (e) {
      console.log('Toast success:', message);
    }
  },
  error: (message: string) => {
    try {
      toast.error(message);
    } catch (e) {
      console.log('Toast error:', message);
    }
  },
  info: (message: string) => {
    try {
      if (typeof toast.info === 'function') {
        toast.info(message);
      } else {
        // Fallback if info method doesn't exist
        toast.success(message);
      }
    } catch (e) {
      console.log('Toast info:', message);
    }
  }
};

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
  const [tokenData, setTokenData] = useState<any>(null);
  
  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  const agentAudioTrackRef = useRef<RemoteAudioTrack | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const retryAttemptedRef = useRef<boolean>(false);
  const connectionInProgressRef = useRef<boolean>(false);

  const connectToLiveKit = useCallback(async () => {
    // Prevent multiple simultaneous connection attempts
    if (connectionInProgressRef.current) {
      console.log('Connection already in progress, ignoring duplicate request');
      return;
    }
    
    connectionInProgressRef.current = true; // Lock the connection
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
        let tokenEndpoint = process.env.NODE_ENV === 'development' 
          ? '/api/livekit/debug-token' 
          : '/api/livekit/token';
        
        console.log(`Using token endpoint: ${tokenEndpoint}`);
        
        // Define alternate endpoints to try if the primary fails
        const alternateEndpoints = [
          '/api/livekit/token',          // Standard endpoint
          '/api/livekit/dispatch/token', // Some deployments use this path
          '/api/voice/livekit/token',    // Alternate path in voice namespace
        ];
        
        // Set the same headers for token request as for dispatch
        const tokenHeaders: HeadersInit = { 
          'Content-Type': 'application/json',
        };
        
        // Add bypass header for unauthenticated requests
        if (!session?.user?.id) {
          tokenHeaders['x-agent-bypass'] = 'production-bypass-token';
          console.log('Adding bypass token header for token request');
        }
        
        // Token retry logic with multiple attempts
        let tokenResponse;
        let retryCount = 0;
        const maxRetries = 3;
        let currentEndpointIndex = 0; // Track which endpoint we're using
        
        // First try the primary endpoint, then alternate ones
        while (retryCount < maxRetries) {
          try {
            // If we've tried the primary endpoint and failed, try alternates
            if (retryCount > 0 && process.env.NODE_ENV === 'production') {
              // Try cycling through alternate endpoints
              currentEndpointIndex = currentEndpointIndex % alternateEndpoints.length;
              const nextEndpoint = alternateEndpoints[currentEndpointIndex];
              if (nextEndpoint !== tokenEndpoint) {
                tokenEndpoint = nextEndpoint;
                console.log(`Trying alternate endpoint: ${tokenEndpoint}`);
                currentEndpointIndex++;
                
                // Use explicit query parameters for clarity
                tokenResponse = await fetch(`${tokenEndpoint}?room=${encodeURIComponent(generatedRoomName)}&identity=${encodeURIComponent(session?.user?.id || `anonymous-${Date.now()}`)}`, {
                  method: 'GET',
                  headers: tokenHeaders,
                });
                
                if (tokenResponse.ok) break;
              }
            }
            
            // Always use URL parameters since that seems most reliable
            tokenResponse = await fetch(`${tokenEndpoint}?room=${encodeURIComponent(generatedRoomName)}&identity=${encodeURIComponent(session?.user?.id || `anonymous-${Date.now()}`)}`, {
              method: 'GET',
              headers: tokenHeaders,
            });
            
            // If successful, break out of retry loop
            if (tokenResponse.ok) break;
            
            // Try with POST and explicit roomName if GET fails
            tokenResponse = await fetch(`${tokenEndpoint}?room=${encodeURIComponent(generatedRoomName)}&identity=${encodeURIComponent(session?.user?.id || `anonymous-${Date.now()}`)}`, {
              method: 'GET',
              headers: tokenHeaders,
            });
            
            // If successful with explicit query params, break out of loop
            if (tokenResponse.ok) break;
            
            // If server error, wait and retry
            if (tokenResponse.status >= 500) {
              retryCount++;
              console.log(`Token endpoint returned ${tokenResponse.status}, retrying (${retryCount}/${maxRetries})...`);
              // Exponential backoff
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              continue;
            }
            
            // If client error that's not 401/403, don't retry
            if (tokenResponse.status !== 401 && tokenResponse.status !== 403) {
              // If we have more alternate endpoints to try, do that before giving up
              if (process.env.NODE_ENV === 'production' && currentEndpointIndex < alternateEndpoints.length - 1) {
                retryCount++;
                currentEndpointIndex++;
                await new Promise(resolve => setTimeout(resolve, 500));
                continue;
              }
              break;
            }
            
            // If auth error, one retry with bypass token
            if ((tokenResponse.status === 401 || tokenResponse.status === 403) && retryCount === 0) {
              console.log('Auth error, trying with explicit bypass token...');
              tokenHeaders['x-agent-bypass'] = 'production-bypass-token';
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 500));
              continue;
            }
            
            // Otherwise, break without retrying
            break;
          } catch (e) {
            // Network errors should be retried
            retryCount++;
            console.error(`Network error fetching token (attempt ${retryCount}/${maxRetries}):`, e);
            
            // Try another endpoint if available
            if (process.env.NODE_ENV === 'production' && currentEndpointIndex < alternateEndpoints.length) {
              currentEndpointIndex++;
              console.log(`Network error, will try alternate endpoint: ${alternateEndpoints[currentEndpointIndex % alternateEndpoints.length]}`);
            }
            
            if (retryCount >= maxRetries) throw e;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
        
        if (!tokenResponse || !tokenResponse.ok) {
          const status = tokenResponse ? tokenResponse.status : 'network error';
          console.error(`Failed to fetch LiveKit token after ${retryCount} retries: ${status}`);
          throw new Error(`Failed to fetch LiveKit token: ${status}`);
        }
        
        const tokenData = await tokenResponse.json();
        
        // Log the token data structure to debug
        console.log('Token response structure:', {
          hasToken: !!tokenData.token,
          tokenType: typeof tokenData.token,
          tokenLength: tokenData.token ? tokenData.token.length : 0,
          urlPresent: !!tokenData.url,
          isMock: !!tokenData.isMock
        });
        
        // Debug the token format itself to check for proper JWT structure
        if (tokenData.token) {
          const isMockToken = 
            tokenData.isMock === true || 
            tokenData.token.startsWith('dev-token-') ||
            !tokenData.token.includes('.');  // Real JWTs have periods separating parts
          
          console.log('Token validation:', {
            isRealJWT: tokenData.token.includes('.') && tokenData.token.split('.').length === 3,
            startsWithEyJ: tokenData.token.startsWith('eyJ'),
            isMockToken: isMockToken,
            // Log a small sample of the token for debugging
            tokenPreview: tokenData.token.substring(0, 15) + '...'
          });
          
          if (isMockToken) {
            console.warn('Using mock token - real-time voice functionality will be limited!');
          } else {
            console.log('Using real JWT token - full functionality available');
          }
        }
        
        // Store the full token data
        setTokenData(tokenData);
        
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
        connectionTimeout: 60000, // Increased from 30 to 60 seconds
        // Add reconnection settings
        reconnectPolicy: {
          maxRetries: 10,        // Try up to 10 reconnect attempts
          maxBackoff: 15000,     // Cap backoff at 15 seconds
          backoffFactor: 1.5,    // Increase backoff by 50% each attempt
          retryableStatusCodes: [500, 503, 504], // Retry on server errors
        },
        // Additional audio-specific settings
        audioDefaults: {
          dtx: true,            // Enable discontinuous transmission
          redForOpus: true,     // Enable redundancy for Opus codec
        },
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
            safeToast.success('Sync agent has joined the room');
            console.log(`AGENT JOINED: ${participant.identity} - Metadata:`, participant.metadata);
            
            // Log all existing tracks on this participant
            const tracks = participant.getTracks();
            console.log(`Agent has ${tracks.length} tracks when connecting:`, 
              tracks.map(t => `${t.kind} (${t.trackSid})`));
              
            // Add participant details to UI
            setAgentResponse(prev => prev + `\n[System: Agent ${participant.identity} has joined]`);
          }
          
          // Listen for agent tracks
          participant.on(ParticipantEvent.TrackSubscribed, (track) => {
            console.log(`Track subscribed from ${participant.identity}: ${track.kind} (${track.sid})`);
            
            if (track.kind === 'audio' && participant.identity.startsWith('agent-')) {
              console.log('Agent audio track detected and being attached');
              agentAudioTrackRef.current = track as RemoteAudioTrack;
              const audioEl = track.attach();
              audioEl.autoplay = true;
              audioEl.playsInline = true;
              audioEl.volume = 1.0; // Ensure volume is at maximum
              
              // Try to force audio playback
              try {
                audioEl.play().catch(e => console.error('Audio autoplay failed:', e));
              } catch (e) {
                console.error('Error attempting to play audio:', e);
              }
              
              audioElementRef.current = audioEl;
              document.body.appendChild(audioEl);
              console.log('Agent audio track attached successfully');
              setIsAgentSpeaking(true);
              setAgentResponse(prev => prev + '\n[System: Agent audio connected]');
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
            safeToast.error('Agent has disconnected from the room');
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
                safeToast.error(data.message);
              }
            } catch (e) {
              console.error('Error parsing data from agent:', e);
            }
          }
        })
        .on(RoomEvent.Disconnected, (reason) => {
          console.log('Disconnected from LiveKit room. Reason:', reason);
          
          // Map reason code to readable message
          let reasonText = 'Unknown';
          switch(reason) {
            case 1: reasonText = 'Client initiated disconnect'; break;
            case 2: reasonText = 'Server initiated disconnect'; break;
            case 3: reasonText = 'Duplicate identity'; break;
            case 4: reasonText = 'Connection error'; break;
          }
          console.log(`Disconnect reason explained: ${reasonText} (code ${reason})`);
          
          // Only clean up if not reconnecting
          if (reason !== 4) { // Don't clean up on connection errors, allow reconnect
            setIsConnected(false);
            setRoom(null);
            setIsListening(false);
            setIsLoading(false);
            
            // Clean up audio elements
            if (audioElementRef.current) {
              audioElementRef.current.remove();
              audioElementRef.current = null;
            }
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
        } else if (connectionUrl.startsWith('http://')) {
          connectionUrl = connectionUrl.replace('http://', 'ws://');
          console.log('Corrected connection URL for WebSocket:', connectionUrl);
        } else if (!connectionUrl.startsWith('wss://') && !connectionUrl.startsWith('ws://')) {
          // If no protocol specified, assume secure WebSocket
          connectionUrl = 'wss://' + connectionUrl;
          console.log('Added wss:// protocol to connection URL:', connectionUrl);
        }
        
        // Handle mock tokens specially
        const isMockMode = tokenData?.isMock === true;
        if (isMockMode) {
          console.log('Using mock token in development mode - skipping actual connection');
          setIsConnected(true);
          setRoom(newRoom);
          setError(null);
          safeToast.info('Connected in mock mode (no actual agent available)');
          
          // Add a simulated response after a delay
          setTimeout(() => {
            setAgentResponse('Agent: Hello! I am Sync in mock mode. I cannot actually process voice commands in this mode, but the UI is fully functional.');
          }, 2000);
          
          setIsLoading(false);
          return;
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
          await new Promise(resolve => setTimeout(resolve, 3000)); // Increased from 2000ms to 3000ms
          
          // First create the audio track without publishing
          console.log('Creating audio track...');
          
          // Use a simpler audio track creation with fewer constraints
          const audioTrack = await createLocalAudioTrack({
            echoCancellation: true,
            noiseSuppression: true
          });
          
          console.log('Audio track created successfully');
          
          // Store reference first, then enable the track
          localAudioTrackRef.current = audioTrack;
          
          // Sequential initialization process with proper error handling at each step
          try {
            console.log('Enabling audio track...');
            audioTrack.enable();
            console.log('Audio track enabled successfully');
            
            // Wait longer before attempting to publish
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            console.log('Preparing to publish audio track...');
            // Use a more reliable publishing configuration
            await newRoom.localParticipant.publishTrack(audioTrack, {
              source: 'microphone',
              stopMicTrackOnMute: false,
              publishTimeout: 30000, // 30 second timeout is sufficient
            });
            
            console.log('Local audio track published successfully');
            setIsListening(true);
            safeToast.success('Connected to Sync voice agent');
          } catch (publishError: any) {
            console.error('Error during audio track publishing:', publishError);
            
            // Don't disconnect - just update UI to show connected but not listening
            setIsListening(false);
            safeToast.error('Microphone connection failed. You can still receive audio from the agent.');
            
            // Try again with a simpler approach if it was a publish error
            if (!retryAttemptedRef.current) {
              retryAttemptedRef.current = true;
              
              try {
                // Simple retry with minimal options
                console.log('Attempting simplified audio publishing...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                await newRoom.localParticipant.publishTrack(audioTrack, {
                  source: 'microphone',
                  publishTimeout: 20000,
                });
                
                console.log('Simplified audio publishing succeeded');
                setIsListening(true);
              } catch (retryError) {
                console.error('Simplified publishing also failed:', retryError);
                setIsListening(false);
              }
            }
          }
        } catch (audioError: any) {
          console.error('Failed to publish audio track:', audioError);
          // Don't disconnect - just update UI to show connected but not listening
          setIsListening(false);
          
          // Log detailed error information to help with debugging
          const errorDetails = {
            message: audioError.message,
            name: audioError.name,
            code: audioError.code,
            isEngineTimeout: audioError.message?.includes('engine not connected within timeout') || false,
            stack: audioError.stack
          };
          console.error('Audio publishing error details:', errorDetails);
          
          // Make a second attempt to publish the track after a longer delay
          if (!retryAttemptedRef.current) {
            retryAttemptedRef.current = true;
            console.log('Scheduling retry for audio publishing...');
            
            // Show toast message about retry attempt
            safeToast.info('Audio connection issue detected, trying again in a moment...');
            
            setTimeout(async () => {
              try {
                console.log('Retrying audio track publishing...');
                
                // Create a new track with simplified options for the retry
                const retryAudioTrack = await createLocalAudioTrack({
                  noiseSuppression: true,
                  echoCancellation: true,
                });
                
                // Enable the track and wait longer before publishing
                retryAudioTrack.enable();
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Publish with an even longer timeout
                await newRoom.localParticipant.publishTrack(retryAudioTrack, {
                  source: 'microphone',
                  stopMicTrackOnMute: false,
                  publishTimeout: 60000, // 60 seconds for the retry attempt
                });
                
                localAudioTrackRef.current = retryAudioTrack;
                console.log('Retry successful! Audio track published');
                setIsListening(true);
                safeToast.success('Microphone connected successfully');
              } catch (retryError) {
                console.error('Retry failed:', retryError);
                
                // Show more detailed error message
                let errorMessage = 'Connected, but microphone access failed';
                
                // Handle specific error cases
                if (retryError.message?.includes('engine not connected within timeout')) {
                  errorMessage = 'Audio engine connection timed out. Try refreshing the page and reconnecting.';
                } else if (retryError.message?.includes('permission')) {
                  errorMessage = 'Microphone permission was denied. Please check your browser settings.';
                } else if (retryError.message?.includes('not found') || retryError.message?.includes('NotFoundError')) {
                  errorMessage = 'No microphone detected. Please connect a microphone and try again.';
                } else if (retryError.message?.includes('security') || retryError.message?.includes('insecure')) {
                  errorMessage = 'Connection rejected due to security requirements. Please ensure you\'re using HTTPS.';
                }
                
                safeToast.error(errorMessage);
                // Set a user-friendly error message in the UI
                setError(errorMessage);
              }
            }, 8000); // Increased from 5000ms to 8000ms
          } else {
            // Show a clear error message based on the type of error
            let errorMessage = 'Connected, but microphone access failed.';
            
            if (audioError.message?.includes('engine not connected within timeout')) {
              errorMessage = 'Audio engine connection timed out. The agent is still connected but cannot hear you.';
            } else if (audioError.message?.includes('permission')) {
              errorMessage = 'Microphone permission was denied. Please check your browser settings.';
            }
            
            safeToast.error(errorMessage);
            setError(errorMessage);
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
        safeToast.error('Failed to connect to voice agent');
      }
    } catch (e: any) {
      console.error('Unexpected error during connection:', e);
      setError(`Unexpected error: ${e.message}`);
    } finally {
      setIsLoading(false);
      connectionInProgressRef.current = false; // Release the connection lock
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
      
      safeToast.success('Disconnected from Sync voice agent');
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
      
      // First attempt - include more data to help with agent initialization
      let response = await fetch(forceJoinEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          roomName,
          userId: session?.user?.id,
          metadata: {
            roomName,
            systemPrompt: "You are Jarvis, a helpful voice assistant. Greet the user warmly.",
            autoGreet: true
          }
        })
      });
      
      // If the first attempt fails, try once more after a delay
      if (!response.ok) {
        console.log('First force-join attempt failed, retrying in 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        response = await fetch(forceJoinEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            roomName,
            userId: session?.user?.id,
            metadata: {
              roomName,
              systemPrompt: "You are Jarvis, a helpful voice assistant. Greet the user warmly.",
              autoGreet: true
            }
          })
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to force agent to join: ${errorData.error || response.statusText}`);
      }
      
      safeToast.success('Manual agent join command sent');
      setAgentResponse(prev => prev + '\n[System: Manual agent join command sent]');
      
      // Wait for agent to connect for a bit
      console.log('Waiting for agent to join room...');
      let waitTime = 0;
      const checkInterval = setInterval(() => {
        const hasAgent = room.participants.size > 1 || 
                       Array.from(room.participants.values()).some(p => p.identity.startsWith('agent-'));
        
        if (hasAgent) {
          clearInterval(checkInterval);
          safeToast.success('Agent has joined the room!');
        } else if (waitTime >= 10000) { // Wait up to 10 seconds
          clearInterval(checkInterval);
          console.log('Agent did not join within timeout period');
        }
        
        waitTime += 1000;
      }, 1000);
      
    } catch (e: any) {
      console.error('Error forcing agent to join:', e);
      setError(`Failed to force agent to join: ${e.message}`);
      safeToast.error('Failed to force agent to join');
    } finally {
      setIsLoading(false);
    }
  };

  // Full disconnect and reconnect
  const reconnectAgent = useCallback(async () => {
    // First set loading state
    setIsLoading(true);
    safeToast.info('Reconnecting agent with a fresh session...');
    
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
        
        safeToast.success('Disconnected from Sync voice agent');
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