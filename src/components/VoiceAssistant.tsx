import React, { useState } from 'react';
import { Room } from 'livekit-client';
import { VoiceCommandInput } from './VoiceCommandInput';
import { AssistantResponse } from './AssistantResponse';

interface VoiceAssistantProps {
  room: Room;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ room }) => {
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResponse = (text: string) => {
    setResponse(text);
    if (text === 'Processing your request...') {
      setIsProcessing(true);
    } else {
      setIsProcessing(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {error && (
        <div className="w-full max-w-2xl p-4 bg-red-100 dark:bg-red-900 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}
      
      <VoiceCommandInput
        room={room}
        onResponse={handleResponse}
        onError={handleError}
        disabled={!room.connected}
      />
      
      <AssistantResponse
        response={response}
        isProcessing={isProcessing}
      />
    </div>
  );
}; 