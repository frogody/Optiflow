import { Room } from 'livekit-client';

export interface CommandProcessorConfig {
  room: Room;
  onResponse: (response: string) => void;
  onError: (error: string) => void;
}

export class CommandProcessor {
  private room: Room;
  private onResponse: (response: string) => void;
  private onError: (error: string) => void;

  constructor(config: CommandProcessorConfig) {
    this.room = config.room;
    this.onResponse = config.onResponse;
    this.onError = config.onError;
  }

  async processCommand(command: string) {
    try {
      // Normalize the command
      const normalizedCommand = command.toLowerCase().trim();

      // Publish the command as a data message
      await this.room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify({
          type: 'command',
          content: normalizedCommand,
          timestamp: Date.now(),
        })),
        'reliable'
      );

      // Basic command processing
      if (normalizedCommand.includes('hello') || normalizedCommand.includes('hi')) {
        this.onResponse('Hello! How can I help you today?');
      } else if (normalizedCommand.includes('help')) {
        this.onResponse('I can help you with various tasks. Try asking me something!');
      } else if (normalizedCommand.includes('bye') || normalizedCommand.includes('goodbye')) {
        this.onResponse('Goodbye! Have a great day!');
      } else {
        // For other commands, we'll wait for the server response
        this.onResponse('Processing your request...');
      }
    } catch (error) {
      this.onError(error instanceof Error ? error.message : 'Failed to process command');
    }
  }

  // Handle incoming data messages from the server
  handleDataMessage(data: Uint8Array) {
    try {
      const message = JSON.parse(new TextDecoder().decode(data));
      if (message.type === 'response') {
        this.onResponse(message.content);
      } else if (message.type === 'assistant_response') {
        this.onResponse(message.text);
      }
    } catch (error) {
      this.onError('Failed to parse server response');
    }
  }
}