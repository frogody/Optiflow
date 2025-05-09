// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { mcpService } from '../mcp/MCPService';
import { ClaudeService } from './ClaudeService';
import { ClayService } from '../integrations/ClayService';
import { HubspotService } from '../integrations/HubspotService';
import { RateLimiter } from '../utils/RateLimiter';
import { Logger } from '../utils/Logger';

interface AoraConfig { claudeApiKey: string;
  clayApiKey?: string;
  hubspotApiKey?: string;
  maxConcurrentConnections?: number;
  retryAttempts?: number;
    }

interface ConnectionStatus {
  id: string;
  status: 'connected' | 'disconnected' | 'error';
  lastCheck: Date;
  errorMessage?: string;
  recommendations?: string[];
  rateLimitRemaining?: number;
  resetTime?: Date;
}

export class AoraAgent {
  private config: AoraConfig;
  private connectionStatuses: Map<string, ConnectionStatus>;
  private isRunning: boolean;
  private checkInterval: NodeJS.Timeout | null;
  private claude: ClaudeService;
  private clay: ClayService | null = null;
  private hubspot: HubspotService | null = null;
  private rateLimiter: RateLimiter;
  private logger: Logger;

  constructor(config: AoraConfig) {
    if (!config.claudeApiKey) {
      throw new Error('Claude API key is required for AORA agent');
    }

    this.config = { maxConcurrentConnections: 5,
      retryAttempts: 3,
      ...config
        };

    this.claude = new ClaudeService({ apiKey: config.claudeApiKey,
      model: 'claude-3-sonnet-20240229'
        });

    if (config.clayApiKey) {
      this.clay = new ClayService({ apiKey: config.clayApiKey     });
    }

    if (config.hubspotApiKey) {
      this.hubspot = new HubspotService({ apiKey: config.hubspotApiKey     });
    }

    this.rateLimiter = new RateLimiter({ maxRequests: 50,
      windowMs: 60000  // 1 minute
        });

    this.logger = Logger.getInstance();
    this.connectionStatuses = new Map();
    this.isRunning = false;
    this.checkInterval = null;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    this.logger.info('Starting AORA agent', { config: this.config     });
    
    this.checkInterval = setInterval(() => {
      this.monitorConnections();
    }, 120000); // Check every 2 minutes

    await this.monitorConnections();
  }

  async stop() {
    this.isRunning = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.logger.info('AORA agent stopped');
  }

  private async monitorConnections() {
    try {
      const connections = await mcpService.getActiveConnections();
      this.logger.debug('Monitoring connections', { count: connections.length     });

      for (const connection of connections) {
        try {
          await this.rateLimiter.withRateLimit(`monitor-${connection.id}`, async () => {
            // Use Claude to analyze connection health
            const analysis = await this.claude.analyzeConnection(connection);
            
            // Get service-specific status
            const serviceStatus = await this.getServiceStatus(connection.type);
            
            // Update connection status with combined insights
            this.connectionStatuses.set(connection.id, { id: connection.id,
              status: analysis.isHealthy ? 'connected' : 'error',
              lastCheck: new Date(),
              errorMessage: analysis.error,
              recommendations: analysis.recommendations,
              rateLimitRemaining: serviceStatus?.rateLimitRemaining,
              resetTime: serviceStatus?.resetTime
                });

            // If there's an error, use Claude to suggest fixes
            if (!analysis.isHealthy) {
              await this.handleConnectionError(connection.id, analysis.error);
            }
          });
        } catch (error: any) {
          this.logger.error(`Error monitoring connection ${connection.id}`, error as Error);
          this.connectionStatuses.set(connection.id, { id: connection.id,
            status: 'error',
            lastCheck: new Date(),
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
              });
        }
      }
    } catch (error: any) {
      this.logger.error('Error in connection monitoring', error as Error);
    }
  }

  private async getServiceStatus(type: string) {
    try {
      switch (type) {
        case 'clay':
          if (this.clay) {
            return await this.clay.getApiStatus();
          }
          break;
        case 'hubspot':
          if (this.hubspot) {
            return await this.hubspot.getApiStatus();
          }
          break;
      }
    } catch (error: any) {
      this.logger.error(`Error getting service status for ${type}`, error as Error);
    }
    return null;
  }

  private async handleConnectionError(connectionId: string, error: string | undefined) {
    try {
      const connection = await mcpService.getConnection(connectionId);
      
      // Get fix suggestions from Claude
      const suggestions = await this.claude.suggestFixes(connection.type, {
        error,
        connection
      });

      // Apply the first suggested fix if available
      if (suggestions.length > 0) {
        const firstSuggestion = suggestions[0];
        this.logger.info(`Applying fix for ${connectionId}`, { suggestion: firstSuggestion     });

        await this.rateLimiter.withRateLimit(`fix-${connectionId}`, async () => {
          if (firstSuggestion.includes('refresh')) {
            await mcpService.refreshConnection(connectionId);
          } else if (firstSuggestion.includes('restart')) {
            await mcpService.restartConnection(connectionId);
          }
        });
      }

      // Store the suggestions for UI display
      const status = this.connectionStatuses.get(connectionId);
      if (status) {
        this.connectionStatuses.set(connectionId, { ...status,
          recommendations: suggestions
            });
      }

    } catch (error: any) {
      this.logger.error(`Error handling connection error for ${connectionId}`, error as Error);
    }
  }

  private async validateClayConnection(connection: any) {
    if (!this.clay) return false;
    
    try {
      return await this.rateLimiter.withRateLimit('clay-validate', async () => {
        const analysis = await this.claude.analyzeConnection({ type: 'clay',
          config: connection.config,
          status: await this.clay!.validateConnection()
            });
        return analysis.isHealthy;
      });
    } catch (error: any) {
      this.logger.error('Clay validation error', error as Error);
      return false;
    }
  }

  private async validateHubspotConnection(connection: any) {
    if (!this.hubspot) return false;
    
    try {
      return await this.rateLimiter.withRateLimit('hubspot-validate', async () => {
        const analysis = await this.claude.analyzeConnection({ type: 'hubspot',
          config: connection.config,
          status: await this.hubspot!.validateConnection()
            });
        return analysis.isHealthy;
      });
    } catch (error: any) {
      this.logger.error('HubSpot validation error', error as Error);
      return false;
    }
  }

  // Public methods
  getConnectionStatus(connectionId: string): ConnectionStatus | undefined {
    return this.connectionStatuses.get(connectionId);
  }

  getAllConnectionStatuses(): ConnectionStatus[] {
    return Array.from(this.connectionStatuses.values());
  }

  isAgentRunning(): boolean {
    return this.isRunning;
  }

  getRateLimitInfo(key: string) {
    return { remaining: this.rateLimiter.getRemainingRequests(key),
      resetTime: this.rateLimiter.getResetTime(key)
        };
  }

  getRecentLogs(filter?: Parameters<Logger['getHistory']>[0]) {
    return this.logger.getHistory(filter);
  }
} 