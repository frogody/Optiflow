import WebSocket from 'ws';

import { Message } from '@/types/message';

type MessageHandler = (data: unknown) => void;

interface WebSocketConfig {
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

export class WebSocketHandler {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;

  constructor(
    private url: string,
    config: WebSocketConfig = {}
  ) {
    this.maxReconnectAttempts = config.maxReconnectAttempts ?? 5;
    this.reconnectDelay = config.reconnectDelay ?? 1000;
  }

  public async connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connection established');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event: WebSocket.MessageEvent) => {
          try {
            const data = event.data.toString();
            const message = JSON.parse(data) as Message;
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket connection closed');
          this.handleReconnect();
        };

        this.ws.onerror = (error: WebSocket.ErrorEvent) => {
          console.error('WebSocket error:', error);
          reject(new Error('WebSocket connection error'));
        };
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unknown connection error'));
      }
    });
  }

  public addMessageHandler(type: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.push(handler);
    }
  }

  public removeMessageHandler(type: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  public async send(data: unknown): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    return new Promise<void>((resolve, reject) => {
      try {
        this.ws?.send(JSON.stringify(data));
        resolve();
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to send message'));
      }
    });
  }

  public close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private handleMessage(message: Message): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message.data));
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      setTimeout(
        () => this.connect(),
        this.reconnectDelay * this.reconnectAttempts
      );
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
}
