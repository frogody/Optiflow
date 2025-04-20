import { http, HttpResponse } from 'msw';

// Sample Anthropic API response
const mockAnthropicResponse = {
  id: 'msg_0123456789abcdef',
  type: 'message',
  role: 'assistant',
  content: [
    {
      type: 'text',
      text: 'Mocked AI response from Anthropic Claude.'
    }
  ],
  model: 'claude-3-opus-20240229',
  stop_reason: 'end_turn',
  usage: {
    input_tokens: 100,
    output_tokens: 20
  }
};

export const handlers = [
  http.post('https://api.anthropic.com/v1/messages', () => {
    return HttpResponse.json(mockAnthropicResponse);
  }),
]; 