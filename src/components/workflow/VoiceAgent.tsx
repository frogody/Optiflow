// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFloating, offset, flip, shift, useHover, useInteractions } from '@floating-ui/react';
import MicrophonePermission from '@/components/MicrophonePermission';
// LiveKit imports
import { LiveKitRoom, useConnectionState, ConnectionState, useRoomContext } from '@livekit/components-react';
import { Room, RoomConnectOptions, createLocalTracks } from 'livekit-client';

interface VoiceAgentProps { onWorkflowGenerated: (workflow: any) => void;
    }

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({ onWorkflowGenerated }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { refs, floatingStyles, context } = useFloating({ placement: 'bottom-end',
    middleware: [offset(10), flip(), shift()],
      });
  
  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
  
  // Add LiveKit connection state
  const [livekitConnected, setLivekitConnected] = useState(false);
  const [livekitConnecting, setLivekitConnecting] = useState(false);
  const [livekitRoom, setLivekitRoom] = useState<Room | null>(null);
  const [roomName, setRoomName] = useState('demo-room');
  const [userName, setUserName] = useState('user-' + Math.floor(Math.random() * 10000));
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [livekitError, setLivekitError] = useState<string | null>(null);

  const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';
  
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      console.error('Speech recognition not supported');
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setError(null);
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event: any) => { console.log('Speech recognition result received', event);
        const transcriptResult = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(transcriptResult);
          };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
    } catch (err) { console.error('Error initializing speech recognition:', err);
      setError('Failed to initialize speech recognition. Please try reloading the page.');
        }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  const toggleListening = () => {
    console.log('Toggle listening clicked', { isListening, recognitionRef: !!recognitionRef.current     });
    
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized');
      setError('Speech recognition is not initialized. Please try reloading the page.');
      return;
    }

    try {
      if (isListening) {
        console.log('Attempting to stop speech recognition');
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        console.log('Attempting to start speech recognition');
        setTranscript('');
        setFeedback(null);
        setAudioSrc(null);
        setError(null);
        
        // Show permission dialog when starting
        setShowPermissionDialog(true);
      }
    } catch (err) {
      console.error('Error toggling speech recognition:', err);
      setError(`Failed to toggle speech recognition: ${ err instanceof Error ? err.message : 'Unknown error'    }`);
      setIsListening(false);
    }
  };

  const handlePermissionGranted = () => {
    setShowPermissionDialog(false);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handlePermissionDenied = () => {
    setShowPermissionDialog(false);
    setError('Microphone access is required for voice commands. Please allow microphone access and try again.');
  };

  const processCommand = async () => {
    if (!transcript || processing) return;
    
    try {
      setProcessing(true);
      setFeedback('Processing your request...');
      
      console.log('Starting voice command processing with text:', transcript);
      
      // Use the API route to process the voice command
      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'     },
        body: JSON.stringify({ action: 'processVoiceCommand',
          text: transcript
            })
      });
      
      console.log('Process command response status:', response.status, response.statusText);
      
      if (!response.ok) { const errorData = await response.json().catch(() => null);
        console.error('Failed to process voice command:', errorData);
        throw new Error(errorData?.error || 'Failed to process voice command');
          }
      
      const workflow = await response.json();
      console.log('Received workflow data:', workflow);
      
      if (workflow) {
        // Generate voice feedback using the API route
        const confirmationText = `I've created a workflow based on your request: "${workflow.name}". ${workflow.description}`;
        console.log('Generating voice feedback:', confirmationText);
        
        const audioResponse = await fetch('/api/elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'     },
          body: JSON.stringify({ action: 'textToSpeech',
            text: confirmationText
              })
        });
        
        console.log('Text-to-speech response status:', audioResponse.status, audioResponse.statusText);
        
        if (audioResponse.ok) {
          const audioData = await audioResponse.json();
          console.log('Received audio data of length:', audioData?.audio?.length || 0);
          setAudioSrc(`data:audio/mpeg;base64,${audioData.audio}`);
        } else { const errorData = await audioResponse.json().catch(() => null);
          console.error('Failed to generate speech:', errorData);
            }
        
        setFeedback(confirmationText);
        console.log('Calling onWorkflowGenerated with data');
        onWorkflowGenerated(workflow);
      } else {
        setFeedback('Sorry, I could not generate a workflow from your command.');
        console.warn('No workflow data received');
      }
    } catch (err: any) { console.error('Error processing command:', err);
      setError(err.message || 'Failed to process your command');
      setFeedback('Sorry, there was an error processing your request.');
        } finally {
      setProcessing(false);
    }
  };
  
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(err => { console.error('Failed to play audio:', err);
          });
    }
  }, [audioSrc]) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Add cleanup function
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) { console.error('Error stopping speech recognition during cleanup:', err);
            }
      }
    };
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Connect to LiveKit room
  const connectToLiveKit = async () => {
    setLivekitConnecting(true);
    setLivekitError(null);
    try {
      // Get token from API
      const tokenRes = await fetch(`/api/livekit/token?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(userName)}`);
      if (!tokenRes.ok) throw new Error('Failed to get LiveKit token');
      const { token } = await tokenRes.json();
      // Create room and connect
      const room = new Room();
      await room.connect(LIVEKIT_URL, token, { autoSubscribe: true,
        // Add more options as needed
          } as RoomConnectOptions);
      setLivekitRoom(room);
      setLivekitConnected(true);
      setShowConnectModal(false);
      // Optionally publish local audio
      await room.localParticipant.enableCameraAndMicrophone();
    } catch (err: any) {
      setLivekitError(err.message || 'Failed to connect to LiveKit');
      setLivekitConnected(false);
    } finally {
      setLivekitConnecting(false);
    }
  };

  const disconnectFromLiveKit = async () => {
    if (livekitRoom) {
      await livekitRoom.disconnect();
      setLivekitRoom(null);
      setLivekitConnected(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (livekitRoom) {
        livekitRoom.disconnect();
      }
    };
  }, [livekitRoom]) // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <>
      {/* Floating button with connection status */}
      <div className="fixed bottom-8 right-8 z-[9999]">
        <button
          onClick={() => setShowConnectModal(true)}
          className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer
            ${ livekitConnected ? 'bg-green-500 shadow-green-500/50' : livekitConnecting ? 'bg-amber-500 shadow-amber-500/50' : 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] shadow-[#3CDFFF]/50 hover:from-[#4AFFD4] hover:to-[#3CDFFF]'    }`}
          title={ livekitConnected ? 'Connected to LiveKit' : 'Connect to LiveKit'    }
          type="button"
          aria-label="Connect to LiveKit"
        >
          <span className="sr-only">LiveKit Connection</span>
          {/* Status icon */}
          { livekitConnected ? (
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#22c55e" /></svg>
          ) : livekitConnecting ? (
            <svg className="h-8 w-8 text-white animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="#f59e42" strokeWidth="2" fill="none" /></svg>
          ) : (
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="#3CDFFF" strokeWidth="2" fill="none" /></svg>
          )    }
        </button>
        {/* Modal for connecting to LiveKit */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-96 relative">
              <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-700" onClick={() => setShowConnectModal(false)}>&times;</button>
              <h2 className="text-lg font-bold mb-2">Connect to LiveKit Room</h2>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Room Name</label>
                <input type="text" className="w-full border rounded px-2 py-1" value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Enter room name" title="Room Name" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">User Name</label>
                <input type="text" className="w-full border rounded px-2 py-1" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter your name" title="User Name" />
              </div>
              {livekitError && <div className="text-red-600 text-sm mb-2">{livekitError}</div>}
              <button
                className="w-full py-2 rounded bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-slate-900 font-semibold hover:from-[#4AFFD4] hover:to-[#3CDFFF] disabled:opacity-50"
                onClick={connectToLiveKit}
                disabled={livekitConnecting}
              >
                { livekitConnecting ? 'Connecting...' : 'Connect'    }
              </button>
            </div>
          </div>
        )}
        {/* Connected room info popover */}
        {livekitConnected && (
          <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-xl p-4 w-80">
            <div className="mb-2 text-slate-800 font-semibold">Connected to <span className="text-[#3CDFFF]">{roomName}</span></div>
            <div className="mb-2 text-slate-600 text-sm">User: <span className="font-mono">{userName}</span></div>
            <button className="px-3 py-1 rounded bg-red-500 text-white text-xs" onClick={disconnectFromLiveKit}>Disconnect</button>
          </div>
        )}
      </div>
      {/* Existing voice agent UI, only enabled when connected */}
      {livekitConnected && (
        <div className="fixed bottom-8 right-32 z-[9999]">
          <div className="fixed bottom-8 right-8 z-[9999]">
            <button
              ref={refs.setReference}
              {...getReferenceProps()}
              onClick={toggleListening}
              className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${ isListening 
                  ? 'bg-red-500 animate-pulse shadow-red-500/50' 
                  : processing 
                    ? 'bg-amber-500 shadow-amber-500/50' 
                    : 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] shadow-[#3CDFFF]/50 hover:from-[#4AFFD4] hover:to-[#3CDFFF]'
                  }`}
              title={ isListening ? 'Stop Recording' : 'Start Recording'    }
              type="button"
              aria-label="Toggle voice recording"
            >
              <span className="sr-only">Voice Assistant</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 text-white transition-transform duration-300 ${ isListening ? 'scale-110' : ''    }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            
            {context.open && (
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className="bg-slate-800 p-4 rounded-lg shadow-xl w-80"
              >
                <div className="text-sm text-white">
                  <h3 className="font-medium mb-2">Voice Assistant</h3>
                  <p className="text-slate-300 text-xs mb-4">
                    Describe the workflow you want to create using natural language
                  </p>
                  
                  {error && (
                    <div className="bg-red-900/50 p-2 rounded text-xs text-red-200 mb-3">
                      {error}
                    </div>
                  )}
                  
                  {transcript && (
                    <div className="mb-4">
                      <div className="text-xs text-slate-400 mb-1">Your command:</div>
                      <div className="bg-slate-700 p-2 rounded text-white text-sm max-h-32 overflow-y-auto">
                        {transcript}
                      </div>
                    </div>
                  )}
                  
                  {feedback && (
                    <div className="mb-4">
                      <div className="text-xs text-slate-400 mb-1">Response:</div>
                      <div className="bg-slate-700 p-2 rounded text-white text-sm max-h-32 overflow-y-auto">
                        {feedback}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={toggleListening}
                      className={`px-3 py-1 rounded-full text-xs ${ isListening ? 'bg-red-500 text-white' : 'bg-slate-600 text-white'
                          }`}
                    >
                      { isListening ? 'Stop' : 'Record'    }
                    </button>
                    
                    <button
                      onClick={processCommand}
                      disabled={!transcript || processing || isListening}
                      className={`px-3 py-1 rounded-full text-xs ${ !transcript || processing || isListening
                          ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-slate-800'
                          }`}
                    >
                      { processing ? 'Processing...' : 'Create Workflow'    }
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {audioSrc && (
            <audio ref={audioRef} src={audioSrc} className="hidden" />
          )}
          {showPermissionDialog && (
            <MicrophonePermission
              onPermissionGranted={handlePermissionGranted}
              onPermissionDenied={handlePermissionDenied}
            />
          )}
        </div>
      )}
    </>
  );
}; 