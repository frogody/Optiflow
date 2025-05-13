'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Room, RoomEvent, createLocalAudioTrack } from 'livekit-client';

const VoiceSimpleTestPage = () => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [livekitStatus, setLivekitStatus] = useState<string>('Not connected');
  const [livekitRoom, setLivekitRoom] = useState<string>('');
  const [statusLogs, setStatusLogs] = useState<string[]>([]);
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const roomRef = useRef<Room | null>(null);
  
  const addLog = (message: string) => {
    console.log(message);
    setStatusLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };
  
  // Initialize audio analyzer
  const initAudioAnalyzer = (stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    analyserRef.current = audioContext.createAnalyser();
    analyserRef.current.fftSize = 256;
    
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    
    // Start analyzing audio levels
    const analyzeAudio = () => {
      if (!analyserRef.current || !isListening) return;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      setAudioLevel(average);
      
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    };
    
    analyzeAudio();
  };
  
  // Clean up function
  const stopListening = () => {
    setIsListening(false);
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
  };
  
  // Start listening to microphone
  const startListening = async () => {
    try {
      setErrorMessage(null);
      
      addLog('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addLog('Microphone access granted!');
      
      mediaStreamRef.current = stream;
      setHasPermission(true);
      setIsListening(true);
      
      // Initialize audio analyzer
      initAudioAnalyzer(stream);
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      setErrorMessage(`Microphone access error: ${error.message}`);
      setHasPermission(false);
      setIsListening(false);
    }
  };

  // Connect to LiveKit
  const connectToLiveKit = async () => {
    try {
      setErrorMessage(null);
      addLog('Requesting LiveKit token...');
      
      // Generate a unique room name
      const roomName = `simple-test-${Date.now()}`;
      setLivekitRoom(roomName);
      
      // Get token from debug endpoint
      const tokenResponse = await fetch('/api/livekit/debug-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          room: roomName, 
          userId: `simple-test-user-${Date.now()}` 
        })
      });
      
      if (!tokenResponse.ok) {
        throw new Error(`Token request failed: ${tokenResponse.status} ${tokenResponse.statusText}`);
      }
      
      const tokenData = await tokenResponse.json();
      addLog(`Received token for room: ${roomName}`);
      
      // Create a new room
      const room = new Room();
      roomRef.current = room;
      
      // Set up event listeners
      room.on(RoomEvent.Connected, () => {
        addLog('Connected to LiveKit room');
        setLivekitStatus('Connected');
      });
      
      room.on(RoomEvent.Disconnected, () => {
        addLog('Disconnected from LiveKit room');
        setLivekitStatus('Disconnected');
      });
      
      room.on(RoomEvent.MediaDevicesError, (error) => {
        addLog(`Media device error: ${error.message}`);
        setErrorMessage(`Media error: ${error.message}`);
      });
      
      room.on(RoomEvent.ConnectionStateChanged, (state) => {
        addLog(`Connection state changed: ${state}`);
      });
      
      // Connect to the room
      await room.connect(tokenData.url, tokenData.token);
      addLog('LiveKit connection established');
      
      // If we have microphone permission already, publish the track
      if (hasPermission && mediaStreamRef.current) {
        addLog('Publishing existing audio track...');
        await publishAudioTrack(room);
      }
      
    } catch (error: any) {
      console.error('LiveKit connection error:', error);
      setErrorMessage(`LiveKit error: ${error.message}`);
      setLivekitStatus('Error');
    }
  };
  
  // Check LiveKit credentials
  const checkLiveKitCredentials = async () => {
    try {
      addLog('Checking LiveKit credentials...');
      const response = await fetch('/api/livekit/check-credentials');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Credential check failed: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        addLog(`✅ LiveKit credentials valid. Found ${data.roomCount} active rooms.`);
        return true;
      } else {
        throw new Error(data.error || 'Unknown credential validation error');
      }
    } catch (error: any) {
      addLog(`❌ LiveKit credential check failed: ${error.message}`);
      setErrorMessage(`LiveKit credential error: ${error.message}`);
      return false;
    }
  };
  
  // Publish audio track to LiveKit
  const publishAudioTrack = async (roomToUse?: Room) => {
    try {
      const room = roomToUse || roomRef.current;
      if (!room) {
        addLog('No active room to publish to');
        return;
      }
      
      addLog('Creating audio track...');
      
      // Use a larger timeout for audio track creation
      const audioTrack = await createLocalAudioTrack({
        // Adding noise suppression and echo cancellation
        noiseSuppression: true,
        echoCancellation: true,
        // Provide more specific audio constraints
        constraints: {
          audio: {
            channelCount: 1,
            sampleRate: 44100,
          }
        }
      });
      
      // Add a delay before publishing to ensure the engine is ready
      addLog('Waiting for audio engine to initialize...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addLog('Publishing audio track...');
      try {
        await room.localParticipant.publishTrack(audioTrack, {
          source: 'microphone',
          stopMicTrackOnMute: false,
          // Increased timeout for publishing to avoid the timeout error
          publishTimeout: 30000, // 30 seconds
        });
        
        addLog('Audio track published successfully');
        return true;
      } catch (publishError: any) {
        // Check specifically for the engine not connected error
        if (publishError.message && publishError.message.includes('engine not connected within timeout')) {
          addLog('Engine timeout error detected, trying again with longer delay...');
          
          // Wait longer and try again
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          addLog('Retrying publish with fresh track...');
          const retryTrack = await createLocalAudioTrack();
          await room.localParticipant.publishTrack(retryTrack, {
            source: 'microphone',
            publishTimeout: 45000, // Even longer timeout for retry
          });
          
          addLog('Retry successful!');
          return true;
        }
        
        // If it's some other error, rethrow it
        throw publishError;
      }
    } catch (error: any) {
      addLog(`Error publishing audio: ${error.message}`);
      setErrorMessage(`Publishing error: ${error.message}`);
      return false;
    }
  };
  
  // Disconnect from LiveKit
  const disconnectFromLiveKit = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
      setLivekitStatus('Disconnected');
      addLog('Disconnected from LiveKit room');
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopListening();
      disconnectFromLiveKit();
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Simple Voice Test</h1>
      
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <div className="mb-6 text-center">
          <div className="text-lg mb-2">
            {isListening ? 'Listening to microphone...' : 'Microphone not active'}
          </div>
          
          {/* Audio level meter */}
          {isListening && (
            <div className="w-full h-8 bg-gray-700 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-100"
                style={{ width: `${Math.min(100, audioLevel * 2)}%` }}
              />
            </div>
          )}
          
          {errorMessage && (
            <div className="text-red-400 mb-4 p-3 bg-red-900/30 rounded">
              {errorMessage}
            </div>
          )}
          
          <div className="mt-2 text-sm text-gray-400">
            {hasPermission 
              ? 'Microphone permission: Granted' 
              : 'Microphone permission: Not granted'}
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          {!isListening ? (
            <button
              onClick={startListening}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-all"
            >
              Start Microphone
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:opacity-90 transition-all"
            >
              Stop Microphone
            </button>
          )}
        </div>
      </div>
      
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <div className="mb-4 text-center">
          <div className="text-lg mb-2">
            LiveKit Status: <span className={`font-bold ${livekitStatus === 'Connected' ? 'text-green-400' : livekitStatus === 'Error' ? 'text-red-400' : 'text-yellow-400'}`}>{livekitStatus}</span>
          </div>
          
          {livekitRoom && (
            <div className="text-sm text-gray-400 mb-2">
              Room: {livekitRoom}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          {livekitStatus !== 'Connected' ? (
            <button
              onClick={connectToLiveKit}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-md hover:opacity-90 transition-all"
            >
              Connect to LiveKit
            </button>
          ) : (
            <button
              onClick={disconnectFromLiveKit}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:opacity-90 transition-all"
            >
              Disconnect
            </button>
          )}
          
          <button
            onClick={checkLiveKitCredentials}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all"
          >
            Check Credentials
          </button>
          
          {livekitStatus === 'Connected' && hasPermission && (
            <button
              onClick={() => publishAudioTrack()}
              className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:opacity-90 transition-all"
            >
              Publish Microphone
            </button>
          )}
        </div>
      </div>
      
      <div className="max-w-md w-full bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Status Log</h2>
        <div className="bg-gray-900 p-3 rounded h-48 overflow-y-auto text-xs font-mono">
          {statusLogs.map((log, i) => (
            <div key={i} className="mb-1 text-green-400">{log}</div>
          ))}
          {statusLogs.length === 0 && (
            <div className="text-gray-500">No logs yet...</div>
          )}
        </div>
      </div>
      
      <a href="/voice-test" className="mt-6 text-blue-400 hover:underline">
        Back to Voice Test Page
      </a>
    </div>
  );
};

export default VoiceSimpleTestPage; 