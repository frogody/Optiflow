import React, { useState, useEffect } from 'react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

interface VoiceCommandInputProps {
  onCommand: (command: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export const VoiceCommandInput: React.FC<VoiceCommandInputProps> = ({
  onCommand,
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

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (transcript && !isListening) {
      onCommand(transcript);
      reset();
    }
  }, [transcript, isListening, onCommand, reset]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      setShowTranscript(false);
    } else {
      startListening();
      setShowTranscript(true);
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