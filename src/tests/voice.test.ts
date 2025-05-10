import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { prisma } from '@/lib/prisma';
import { ConversationService } from '@/services/ConversationService';
import { PipedreamService } from '@/services/PipedreamService';

// Mock the WebSocket and AudioContext
vi.mock('@/lib/prisma', () => ({
  prisma: {
    workflow: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    workflowNode: {
      create: vi.fn(),
    },
    workflowEdge: {
      create: vi.fn(),
    },
    voiceInteraction: {
      create: vi.fn(),
      update: vi.fn(),
    },
    conversationMessage: {
      createMany: vi.fn(),
    },
  },
}));

describe('Voice Recognition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize voice recognition with default config', () => {
    const { result } = renderHook(() => useVoiceRecognition());
    const { isListening, isProcessing, transcript, error } = result.current;
    expect(isListening).toBe(false);
    expect(isProcessing).toBe(false);
    expect(transcript).toBe('');
    expect(error).toBeNull();
  });

  it('should handle microphone permission errors', async () => {
    const mockError = new Error('Microphone permission denied');
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockRejectedValue(
      mockError
    );

    const { result } = renderHook(() => useVoiceRecognition());
    await act(async () => {
      await result.current.startListening();
    });

    expect(result.current.error).toBe('Microphone permission denied');
  });
});

describe('Conversation Service', () => {
  let conversationService: ConversationService;

  beforeEach(() => {
    conversationService = new ConversationService();
  });

  it('should process create workflow command', async () => {
    const command = 'Create a workflow named "Test Workflow"';
    const response = await conversationService.processCommand(command);

    expect(response.success).toBe(true);
    expect(response.message).toContain('Test Workflow');
  });

  it('should process add node command', async () => {
    // First create a workflow
    const workflowCommand = 'Create a workflow named "Test Workflow"';
    await conversationService.processCommand(workflowCommand);

    // Then add a node
    const nodeCommand = 'Add a HubSpot node';
    const response = await conversationService.processCommand(nodeCommand);

    expect(response.success).toBe(true);
    expect(response.message).toContain('HubSpot');
  });

  it('should handle unknown commands', async () => {
    const command = 'Do something random';
    const response = await conversationService.processCommand(command);

    expect(response.success).toBe(false);
    expect(response.message).toContain('rephrase');
  });
});

describe('Pipedream Service', () => {
  let pipedreamService: PipedreamService;

  beforeEach(() => {
    pipedreamService = new PipedreamService('test-api-key');
    process.env.NODE_ENV = 'development';
  });

  it('should create a mock workflow', async () => {
    const workflow = {
      name: 'Test Workflow',
      description: 'A test workflow',
      organizationId: 'test-org',
      createdById: 'test-user',
    };

    const workflowId = await pipedreamService.createWorkflow(workflow as any);
    expect(workflowId).toMatch(/^mock-workflow-\d+$/);
  });

  it('should add a mock node to workflow', async () => {
    const workflowId = 'mock-workflow-123';
    const node = {
      type: 'HubSpot',
      config: { apiKey: 'test-key' },
    };

    const nodeId = await pipedreamService.addNode(workflowId, node as any);
    expect(nodeId).toMatch(/^mock-node-\d+$/);
  });

  it('should connect mock nodes', async () => {
    const workflowId = 'mock-workflow-123';
    const edge = {
      sourceNodeId: 'mock-node-1',
      targetNodeId: 'mock-node-2',
    };

    await expect(
      pipedreamService.connectNodes(workflowId, edge as any)
    ).resolves.not.toThrow();
  });

  it('should get available integrations', async () => {
    const integrations = await pipedreamService.getAvailableIntegrations();
    expect(integrations).toEqual([
      { id: 'hubspot', name: 'HubSpot' },
      { id: 'gmail', name: 'Gmail' },
      { id: 'slack', name: 'Slack' },
      { id: 'github', name: 'GitHub' },
      { id: 'n8n', name: 'n8n' },
    ]);
  });
});
