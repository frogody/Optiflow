import React, { useState, useEffect, useRef } from 'react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import { Room } from 'livekit-client';
import { CommandProcessor } from '@/services/commandProcessor';

interface VoiceCommandInputProps {
  room: Room;
  onResponse: (response: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export const VoiceCommandInput: React.FC<VoiceCommandInputProps> = ({
  room,
  onResponse,
  onError,
  disabled = false,
}) => {
  const {
    isListening,
    isProcessing,
    transcript,
    error,
    interimTranscript,
    startListening,
    stopListening,
    reset,
  } = useVoiceRecognition();

  const [showTranscript, setShowTranscript] = useState(false);
  const commandProcessorRef = useRef<CommandProcessor | null>(null);

  useEffect(() => {
    // Initialize command processor
    commandProcessorRef.current = new CommandProcessor({
      room,
      onResponse,
      onError,
    });

    // Set up data message listener
    const handleData = (data: Uint8Array) => {
      commandProcessorRef.current?.handleDataMessage(data);
    };

    room.on('dataReceived', handleData);

    return () => {
      room.off('dataReceived', handleData);
    };
  }, [room, onResponse, onError]);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (transcript && !isListening && commandProcessorRef.current) {
      commandProcessorRef.current.processCommand(transcript);
      reset();
    }
  }, [transcript, isListening, reset]);

  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
      setShowTranscript(false);
    } else {
      try {
        // Initialize AudioContext only when starting to listen
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        await audioContext.resume();

        // Start listening after AudioContext is initialized
        await startListening();
        setShowTranscript(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        onError(`Failed to initialize audio: ${errorMessage}`);
        setShowTranscript(false);
      }
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleToggleListening}
          disabled={disabled}
          className={`p-4 rounded-full transition-all duration-200 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <StopIcon className="w-6 h-6 text-white" />
          ) : (
            <MicrophoneIcon className="w-6 h-6 text-white" />
          )}
        </button>

        {isProcessing && (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
          </div>
        )}
      </div>

      {showTranscript && (transcript || interimTranscript) && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {transcript && <p className="mb-2">{transcript}</p>}
            {interimTranscript && (
              <p className="text-gray-400 italic">{interimTranscript}</p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}; 