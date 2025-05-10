import express from 'express';

import { MCPApplication, MCPRequest, MCPResponse } from '../types';

export abstract class MCPServer {
  protected app: express.Application;
  protected port: number;
  protected application: MCPApplication;

  constructor(application: MCPApplication, port: number) {
    this.app = express();
    this.port = port;
    this.application = application;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(express.json());
  }

  private setupRoutes() {
    this.app.post('/', async (req, res) => {
      try {
        const request = req.body as MCPRequest;
        const response = await this.handleRequest(request);
        res.json(response);
      } catch (error) {
        const errorResponse: MCPResponse = {
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: error instanceof Error ? error.message : 'Internal server error',
          },
          id: req.body?.id || null,
        };
        res.status(500).json(errorResponse);
      }
    });
  }

  protected abstract handleRequest(request: MCPRequest): Promise<MCPResponse>;

  public start() {
    this.app.listen(this.port, () => {
      console.log(`${this.application.name} MCP server running on port ${this.port}`);
    });
  }
} 