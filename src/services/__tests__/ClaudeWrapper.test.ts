import { Anthropic } from '@anthropic-ai/sdk';
import { describe, expect, it, vi } from 'vitest';

import { ClaudeWrapper, MODEL_MAP } from '../ClaudeWrapper';

// Mock Anthropic client
vi.mock('@anthropic-ai/sdk', () => {
  return {
    Anthropic: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          id: 'test-id',
          model: MODEL_MAP.CLAUDE_3_7_SONNET,
          content: [
            { type: 'text', text: 'Test response' },
            { type: 'thinking', text: 'Reasoning about the response' }
          ]
        })
      }
    }))
  };
});

describe('ClaudeWrapper', () => {
  const testApiKey = 'sk-ant-test123';
  let wrapper: ClaudeWrapper;

  beforeEach(() => {
    wrapper = new ClaudeWrapper(testApiKey);
  });

  it('should initialize with API key', () => {
    expect(Anthropic).toHaveBeenCalledWith({
      apiKey: testApiKey,
      defaultHeaders: {
        'anthropic-version': '2024-02-19',
        'Content-Type': 'application/json'
      }
    });
  });

  it('should generate text with thinking enabled', async () => {
    const prompt = 'Test prompt';
    const thinking = { type: 'enabled' as const, budget_tokens: 1000 };
    
    const response = await wrapper.generateText(prompt, MODEL_MAP.CLAUDE_3_7_SONNET, 4096, 0.7, thinking);
    
    expect(response).toContain('Test response');
    expect(response).toContain('Thinking: Reasoning about the response');
  });

  it('should validate model names', () => {
    const invalidModel = 'invalid-model';
    const consoleWarnSpy = vi.spyOn(console, 'warn');
    
    wrapper.generateText('test', invalidModel as any);
    
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Warning: Using unrecognized model "${invalidModel}"`)
    );
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('API Error');
    vi.mocked(Anthropic).mockImplementationOnce(() => ({
      messages: {
        create: vi.fn().mockRejectedValue(error)
      }
    }));

    await expect(wrapper.generateText('test')).rejects.toThrow('API Error');
  });
}); 