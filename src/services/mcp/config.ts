import { useUserStore } from '@/lib/userStore';

interface MCPServerConfig {
  url: string;
}

interface MCPServers {
  [key: string]: MCPServerConfig;
}

// Default MCP server configurations
const defaultMcpServers: MCPServers = {
  aora: {
    url: 'http://localhost:3001', // Using local development URL for now
  },
};

export function getMcpServers(userId: string): MCPServers {
  // For development, we'll use the default configuration
  // In production, this would fetch from a database or API
  return defaultMcpServers;
}

export function updateMcpServers(userId: string, servers: MCPServers): void {
  // For development, we'll just log the update
  // In production, this would update a database or API
  console.log('Updating MCP servers for user:', userId, servers);
}

// Helper function to validate MCP server configuration
export function validateMcpConfig(config: MCPServers): boolean {
  // Basic validation - ensure each server has a URL
  return Object.values(config).every(
    (server) =>
      typeof server === 'object' &&
      server !== null &&
      typeof server.url === 'string' &&
      (server.url.startsWith('https://') || server.url.startsWith('http://')) // Allow http for local development
  );
}

const getMCPBaseUrl = () => {
  return process.env.NODE_ENV === 'production'
    ? process.env.MCP_SERVICE_URL || 'https://mcp.isyncso.com'
    : process.env.MCP_SERVICE_URL || 'http://localhost:3001';
};

export const mcpConfig = { url: getMCPBaseUrl() };
