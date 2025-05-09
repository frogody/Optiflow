import { NextApiRequest, NextApiResponse } from 'next';

// Mock integration status per user (replace with DB lookup in production)
const mockUserIntegrations: Record<string, string[]> = {
  'user-123': ['slack'], // user-123 has Slack connected
  // Add more users and integrations as needed
};

// Generic proxy to Pipedream Connect
async function proxyToPipedream({ userId, integration, action, params }: any) {
  // Map integration/action to Pipedream API endpoint
  // Example: /v1/users/{external_user_id}/slack/sendMessage
  const endpoint = `https://api.pipedream.com/v1/users/${userId}/${integration}/${action}`;
  // Use your Pipedream API key
  const apiKey = process.env.PIPEDREAM_API_KEY;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Pipedream error: ${error}`);
  }
  return await res.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userId, integration, action, params, transcript } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  // Helper: check if user has connected the integration
  const hasIntegration = (userId: string, integration: string) => {
    return mockUserIntegrations[userId]?.includes(integration);
  };

  // If transcript is provided, do basic intent parsing (for demo)
  if (transcript) {
    if (transcript.toLowerCase().includes('slack')) {
      if (!hasIntegration(userId, 'slack')) {
        return res
          .status(403)
          .json({
            error:
              'You have not connected Slack. Please connect it in your integrations dashboard.',
          });
      }
      // Extract channel and message (very basic mock)
      const channelMatch = transcript.match(/#(\w+)/);
      const channel = channelMatch ? `#${channelMatch[1]}` : '#general';
      const message =
        transcript.replace(/.*slack.*?(#\w+)?/i, '').trim() || transcript;
      // Proxy to Slack sendMessage
      try {
        const result = await proxyToPipedream({
          userId,
          integration: 'slack',
          action: 'sendMessage',
          params: { channel, text: message },
        });
        return res.json({
          confirmation: `Sent Slack message to ${channel}: "${message}"`,
          result,
        });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    // Add more intent parsing for other integrations here
    return res.json({
      confirmation: "Sorry, I didn't understand that command yet.",
    });
  }

  // If explicit integration/action/params are provided
  if (integration && action && params) {
    if (!hasIntegration(userId, integration)) {
      return res
        .status(403)
        .json({
          error: `You have not connected ${integration}. Please connect it in your integrations dashboard.`,
        });
    }
    try {
      const result = await proxyToPipedream({
        userId,
        integration,
        action,
        params,
      });
      return res.json({
        confirmation: `Action ${action} on ${integration} complete.`,
        result,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res
    .status(400)
    .json({ error: 'Missing transcript or integration/action/params' });
}
