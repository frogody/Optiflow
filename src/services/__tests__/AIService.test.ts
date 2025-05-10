import { Anthropic } from '@anthropic-ai/sdk';
import { describe, expect, it, vi } from 'vitest';

import { AIError } from '../../errors/AIError';
import { AIService } from '../AIService';
import { MODEL_MAP } from '../ClaudeWrapper';

// Mock Anthropic client
vi.mock('@anthropic-ai/sdk', () => {
  return {
    Anthropic: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          id: 'test-id',
          model: MODEL_MAP.CLAUDE_3_7_SONNET,
          content: [
            {
              type: 'thinking',
              text: 'Analyzing workflow requirements...\nConsidering best practices...'
            },
            {
              type: 'text',
              text: JSON.stringify({
                name: 'Test Workflow',
                description: 'A test workflow',
                nodes: [
                  {
                    id: 'node1',
                    type: 'trigger',
                    position: { x: 100, y: 100 },
                    data: {
                      label: 'Start',
                      description: 'Workflow start',
                      config: {}
                    }
                  }
                ],
                edges: []
              })
            }
          ]
        })
      }
    }))
  };
});

describe('AIService', () => {
  let service: AIService;

  beforeEach(() => {
    // Reset environment variables
    process.env.ANTHROPIC_API_KEY = 'test-key';
    service = new AIService();
  });

  it('should generate workflow with thinking enabled', async () => {
    const description = 'Create a simple workflow';
    const thinking = { type: 'enabled' as const, budget_tokens: 4000 };
    
    const workflow = await service.generateWorkflowFromDescription(
      description,
      '',
      'CLAUDE_3_7_SONNET',
      thinking
    );
    
    expect(workflow).toEqual({
      name: 'Test Workflow',
      description: 'A test workflow',
      nodes: [
        {
          id: 'node1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: {
            label: 'Start',
            description: 'Workflow start',
            config: {}
          }
        }
      ],
      edges: []
    });
  });

  it('should handle invalid workflow JSON', async () => {
    vi.mocked(Anthropic).mockImplementationOnce(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [{ type: 'text', text: 'Invalid JSON' }]
        })
      }
    }));

    await expect(
      service.generateWorkflowFromDescription('test')
    ).rejects.toThrow(AIError);
  });

  it('should handle missing workflow properties', async () => {
    vi.mocked(Anthropic).mockImplementationOnce(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [{ type: 'text', text: '{"name": "Test"}' }]
        })
      }
    }));

    await expect(
      service.generateWorkflowFromDescription('test')
    ).rejects.toThrow('Invalid workflow structure generated');
  });

  it('should include context in prompt', async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            name: 'Test Workflow',
            description: 'A test workflow',
            nodes: [],
            edges: []
          })
        }
      ]
    });

    vi.mocked(Anthropic).mockImplementationOnce(() => ({
      messages: { create: mockCreate }
    }));

    const context = 'Additional context';
    await service.generateWorkflowFromDescription('test', context);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining(context)
          })
        ])
      })
    );
  });
}); 