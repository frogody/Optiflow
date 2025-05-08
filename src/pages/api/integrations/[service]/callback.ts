import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Assume user is authenticated and req.user.id is available
  // (In production, use your auth middleware/session)
  const userId = (req as any).user?.id || req.query.user_id;
  const { service } = req.query;
  // Pipedream will send code, state, etc. in the query
  const { code, state } = req.query;
  if (!userId || !service || !code) {
    return res.status(400).json({ error: 'Missing user, service, or code' });
  }
  // TODO: Store the integration status for the user in your database
  // Example: await db.saveIntegration(userId, service, { code, state, ...req.query });
  // For now, just log it
  console.log(`User ${userId} connected ${service} with code: ${code}`);
  // Redirect to integrations dashboard or success page
  res.redirect('/integrations/success');
} 