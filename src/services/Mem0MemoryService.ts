import { MemoryClient } from '@mem0/vercel-ai-provider';

const MEM0_API_KEY = process.env.MEM0_API_KEY || 'm0-CWV6grdzUFxwCK2TpCrVEa2lSBiXiuhFKeZJxCsd';

export type MemoryScope = 'user' | 'team' | 'org';

export class Mem0MemoryService {
  private client: MemoryClient;

  constructor() {
    this.client = new MemoryClient({ api_key: MEM0_API_KEY });
  }

  private getScopedId(scope: MemoryScope, id: string) {
    if (scope === 'user') return id;
    if (scope === 'team') return `team-${id}`;
    if (scope === 'org') return `org-${id}`;
    return id;
  }

  async add(scope: MemoryScope, id: string, messages: any[], metadata?: any) {
    return this.client.add(messages, { user_id: this.getScopedId(scope, id), metadata });
  }

  async getAll(scope: MemoryScope, id: string) {
    return this.client.get_all({ user_id: this.getScopedId(scope, id) });
  }

  async search(scope: MemoryScope, id: string, query: string) {
    return this.client.search({ query, user_id: this.getScopedId(scope, id) });
  }

  async update(memory_id: string, data: any) {
    return this.client.update({ memory_id, data });
  }

  async delete(memory_id: string) {
    return this.client.delete({ memory_id });
  }

  async deleteAll(scope: MemoryScope, id: string) {
    return this.client.delete_all({ user_id: this.getScopedId(scope, id) });
  }
} 