import { NextRequest, NextResponse } from 'next/server';

import { Mem0MemoryService } from '@/services/Mem0MemoryService';
import { getPipedreamAccountId } from '@/services/PipedreamAccountService';
import { callPipedreamProxy } from '@/services/PipedreamProxyService';
// import { callClaude } from '@/services/ClaudeWrapper'; // Uncomment and implement

const mem0 = new Mem0MemoryService();

export async function POST(req: NextRequest) {
  const { userId, teamId, orgId, message } = await req.json();
  if (!userId || !message) {
    return NextResponse.json({ error: 'Missing userId or message' }, { status: 400 });
  }

  // 1. Store user message in Mem0
  await mem0.add('user', userId, [{ role: 'user', content: message }]);

  // 2. Retrieve context
  const userMem = await mem0.getAll('user', userId);
  const teamMem = teamId ? await mem0.getAll('team', teamId) : [];
  const orgMem = orgId ? await mem0.getAll('org', orgId) : [];

  // 3. Intent detection (Claude or LLM)
  // Placeholder: Replace with real Claude call
  // const { intent, entities, service } = await callClaude(message, userMem, teamMem, orgMem);
  const intent = 'send_email'; // Example intent
  const service = 'gmail'; // Example service
  const entities = { to: 'bart@example.com', subject: 'Proposal', body: 'Here is the proposal...' };

  // 4. Routing
  let result = '';
  if (intent === 'send_email') {
    // Look up user's Pipedream account_id for the service
    const accountId = await getPipedreamAccountId(userId, service);
    if (!accountId) {
      result = `No ${service} connection found for user.`;
    } else {
      // Real Pipedream proxy call
      try {
        const pdResult = await callPipedreamProxy({
          accountId,
          externalUserId: userId,
          url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send', // Example Gmail API endpoint
          method: 'POST',
          body: entities,
        });
        result = pdResult;
      } catch (e: any) {
        result = `Pipedream proxy error: ${e.message}`;
      }
    }
  } else if (intent === 'summarize') {
    // Placeholder: Replace with real Claude call
    // result = await callClaude('summarize', message, userMem);
    result = 'Summary: ...';
  } else {
    // Fallback to Claude
    // result = await callClaude('general', message, userMem);
    result = 'General response from agent.';
  }

  // 5. Store agent response in Mem0
  await mem0.add('user', userId, [{ role: 'assistant', content: typeof result === 'string' ? result : JSON.stringify(result) }]);

  // 6. Return result
  return NextResponse.json({ response: result });
} 