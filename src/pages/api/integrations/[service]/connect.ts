import { NextApiRequest, NextApiResponse } from 'next';

// Helper to get the Pipedream Connect OAuth URL for a service
function getPipedreamOAuthUrl(userId: string, service: string) {
  // Example for Slack, add more services as needed
  if (service === 'slack') {
    // Replace with your actual Pipedream Connect client ID and redirect URI
    const clientId = process.env.PIPEDREAM_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/integrations/${service}/callback`
    );
    return `https://connect.pipedream.com/oauth/${clientId}/${service}?external_user_id=${userId}&redirect_uri=${redirectUri}`;
  }
  // Add more services here
  throw new Error('Unsupported service');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Assume user is authenticated and req.user.id is available
  // (In production, use your auth middleware/session)
  const userId = (req as any).user?.id || req.query.user_id;
  const { service } = req.query;
  if (!userId || !service) {
    return res.status(400).json({ error: 'Missing user or service' });
  }
  try {
    const url = getPipedreamOAuthUrl(userId, service as string);
    res.redirect(url);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
