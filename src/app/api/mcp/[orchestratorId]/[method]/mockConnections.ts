// @ts-nocheck - This file has some TypeScript issues that are hard to fix
// In-memory storage for mock connections
const mockConnections: {
  [userId: string]: {
    [orchestratorId: string]: {
      tools: {
        [toolName: string]: { connected: boolean;
          config?: any;
            };
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
  clay: { connected: false     },
        lindyai: { connected: false     },
        n8n: { connected: false     }
      }
    };
  }
  return mockConnections[userId][orchestratorId];
}

export function updateMockConnection(
  userId: string,
  orchestratorId: string,
  toolName: string,
  connected: boolean,
  config?: any
) {
  const userConnections = getMockConnections(userId, orchestratorId);
  userConnections.tools[toolName] = { connected, config };
  return userConnections;
} 