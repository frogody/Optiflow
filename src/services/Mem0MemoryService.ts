import { addMemories, getMemories, retrieveMemories } from '@mem0/vercel-ai-provider';

const MEM0_API_KEY = process.env.MEM0_API_KEY || 'm0-CWV6grdzUFxwCK2TpCrVEa2lSBiXiuhFKeZJxCsd';

export type MemoryScope = 'user' | 'team' | 'org';

export class Mem0MemoryService {
  private getScopedId(scope: MemoryScope, id: string) {
    if (scope === 'user') return id;
    if (scope === 'team') return `team-${id}`;
    if (scope === 'org') return `org-${id}`;
    return id;
  }

  async add(scope: MemoryScope, id: string, messages: any[], metadata?: any) {
    return addMemories(messages, {
      user_id: this.getScopedId(scope, id),
      mem0ApiKey: MEM0_API_KEY,
      ...metadata,
    });
  }

  async getAll(scope: MemoryScope, id: string) {
    return getMemories('', {
      user_id: this.getScopedId(scope, id),
      mem0ApiKey: MEM0_API_KEY,
    });
  }

  async search(scope: MemoryScope, id: string, query: string) {
    return retrieveMemories(query, {
      user_id: this.getScopedId(scope, id),
      mem0ApiKey: MEM0_API_KEY,
    });
  }

  // update, delete, deleteAll would need to be implemented if supported by the SDK
} 