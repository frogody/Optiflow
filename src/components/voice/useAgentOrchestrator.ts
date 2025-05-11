import { useState, useCallback } from 'react';

interface OrchestratorOptions {
  userId: string;
  teamId?: string;
  orgId?: string;
}

export function useAgentOrchestrator({ userId, teamId, orgId }: OrchestratorOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const send = useCallback(async (message: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch('/api/agent/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, teamId, orgId, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setResponse(data.response);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId, teamId, orgId]);

  return { send, loading, error, response };
} 