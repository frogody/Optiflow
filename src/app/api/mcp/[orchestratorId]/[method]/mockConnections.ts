// In-memory storage for mock connections
const mockConnections: {
  [userId: string]: {
    [orchestratorId: string]: {
      tools: {
        [toolName: string]: { connected: boolean; config?: Record<string, unknown>; };
      };
    };
  };
} = {};

export function getMockConnections(userId: string, orchestratorId: string) {
  if (!mockConnections[userId]) {
    mockConnections[userId] = {};
  }
  if (!mockConnections[userId][orchestratorId]) {
    mockConnections[userId][orchestratorId] = {
      tools: {
        clay: { connected: false },
        lindyai: { connected: false },
        n8n: { connected: false }
      }
    };
  }
  return mockConnections[userId][orchestratorId];
}

export function updateMockConnection(userId: string, orchestratorId: string, toolName: string, connected: boolean, config?: Record<string, unknown>) {
  const userConnections = getMockConnections(userId, orchestratorId);
  userConnections.tools[toolName] = { connected, ...(config !== undefined && { config }) };
  return userConnections;
} 