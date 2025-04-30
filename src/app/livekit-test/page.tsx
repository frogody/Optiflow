'use client';

import { useEffect, useState } from 'react';
import { Room, RoomEvent, RemoteParticipant, LocalParticipant, RoomOptions, ConnectionState } from 'livekit-client';

export default function LiveKitTest() {
  const [room, setRoom] = useState<Room | null>(null);
  const [status, setStatus] = useState<string>('disconnected');
  const [participants, setParticipants] = useState<(RemoteParticipant | LocalParticipant)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<{
    roomName?: string;
    participantName?: string;
    url?: string;
  }>({});

  useEffect(() => {
    // Log LiveKit URL on component mount
    console.log('LiveKit URL:', process.env.NEXT_PUBLIC_LIVEKIT_URL);
    
    return () => {
      if (room) {
        console.log('Cleaning up room connection');
        room.disconnect();
      }
    };
  }, [room]);

  const connectToRoom = async () => {
    try {
      setError(null);
      setStatus('connecting...');
      
      console.log('Starting room connection process...');
      
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        reconnect: true,
      } as RoomOptions);

      // Set up event listeners
      newRoom
        .on(RoomEvent.ParticipantConnected, () => {
          console.log('Participant connected');
          setParticipants(Array.from(newRoom.participants.values()));
        })
        .on(RoomEvent.ParticipantDisconnected, () => {
          console.log('Participant disconnected');
          setParticipants(Array.from(newRoom.participants.values()));
        })
        .on(RoomEvent.Disconnected, () => {
          console.log('Room disconnected');
          setStatus('disconnected');
          setParticipants([]);
        })
        .on(RoomEvent.Connected, () => {
          console.log('Room connected');
          setStatus('connected');
          setParticipants(Array.from(newRoom.participants.values()));
        })
        .on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
          console.log('Connection state changed:', state);
          setStatus(state);
        })
        .on(RoomEvent.Reconnecting, () => {
          console.log('Reconnecting to room...');
          setStatus('reconnecting');
        })
        .on(RoomEvent.Reconnected, () => {
          console.log('Reconnected to room');
          setStatus('connected');
        })
        .on(RoomEvent.SignalConnected, () => {
          console.log('Signal connected');
        })
        .on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
          console.log('Connection quality changed:', quality, 'for', participant.identity);
        });

      console.log('Fetching token...');
      const response = await fetch('/api/livekit/token');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get token');
      }
      
      const data = await response.json();
      console.log('Token received:', { room: data.room, participant: data.participant, url: data.url });
      
      setConnectionDetails({
        roomName: data.room,
        participantName: data.participant,
        url: data.url,
      });

      if (!data.url) {
        throw new Error('LiveKit URL not configured');
      }

      console.log('Connecting to room...');
      await newRoom.connect(data.url, data.token, {
        autoSubscribe: true,
      });

      console.log('Room connection successful');
      setRoom(newRoom);
    } catch (err) {
      console.error('Error connecting to room:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to room');
      setStatus('error');
    }
  };

  const disconnectFromRoom = () => {
    if (room) {
      console.log('Disconnecting from room...');
      room.disconnect();
      setRoom(null);
    }
  };

  const toggleAudio = async () => {
    if (room?.localParticipant) {
      const newState = !room.localParticipant.isMicrophoneEnabled;
      console.log('Toggling audio:', newState);
      await room.localParticipant.setMicrophoneEnabled(newState);
    }
  };

  const toggleVideo = async () => {
    if (room?.localParticipant) {
      const newState = !room.localParticipant.isCameraEnabled;
      console.log('Toggling video:', newState);
      await room.localParticipant.setCameraEnabled(newState);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">LiveKit Test Page</h1>
      
      <div className="mb-4">
        <p className="mb-2">Status: {status}</p>
        {error && <p className="text-red-500 mb-2">Error: {error}</p>}
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Connection Details:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(connectionDetails, null, 2)}
          </pre>
        </div>
        
        <div className="space-x-2">
          <button
            onClick={connectToRoom}
            disabled={status === 'connecting' || status === 'connected'}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Connect
          </button>
          
          <button
            onClick={disconnectFromRoom}
            disabled={status !== 'connected'}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Disconnect
          </button>
          
          <button
            onClick={toggleAudio}
            disabled={status !== 'connected'}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Toggle Audio
          </button>
          
          <button
            onClick={toggleVideo}
            disabled={status !== 'connected'}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Toggle Video
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Participants ({participants.length})</h2>
        <ul className="space-y-2">
          {participants.map((participant) => (
            <li key={participant.identity} className="border p-2 rounded">
              <p>Identity: {participant.identity}</p>
              <p>Audio: {participant.isMicrophoneEnabled ? 'Enabled' : 'Disabled'}</p>
              <p>Video: {participant.isCameraEnabled ? 'Enabled' : 'Disabled'}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 