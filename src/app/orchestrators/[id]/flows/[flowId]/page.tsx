'use client';

import { useState } from 'react';

export default function FlowPage({ params }: { params: { id: string; flowId: string } }) {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with real user/team/org IDs from session/user store
  const userId = 'demo-user';
  const teamId = '';
  const orgId = '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/agent/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, teamId, orgId, message }),
      });
      const data = await res.json();
      setResponse(data.response || data.error || 'No response');
    } catch (err) {
      setResponse('Error contacting orchestrator API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Workflow Orchestrator</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 border rounded mb-2"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Describe your workflow or ask the agent..."
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Running...' : 'Run Workflow'}
        </button>
      </form>
      {response && (
        <div className="bg-gray-900 text-white p-4 rounded shadow">
          <strong>Agent Response:</strong>
          <div className="mt-2 whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </div>
  );
} 