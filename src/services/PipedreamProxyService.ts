import { createBackendClient } from '@pipedream/sdk/server';

const pd = createBackendClient({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  projectId: process.env.PIPEDREAM_PROJECT_ID!,
  credentials: {
    clientId: process.env.PIPEDREAM_CLIENT_ID!,
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET!,
  },
});

export async function callPipedreamProxy({
  accountId,
  externalUserId,
  url,
  method = 'POST',
  body,
  headers = {},
}: {
  accountId: string,
  externalUserId: string,
  url: string,
  method?: string,
  body?: any,
  headers?: Record<string, string>,
}) {
  return await pd.makeProxyRequest(
    {
      searchParams: {
        account_id: accountId,
        external_user_id: externalUserId,
      }
    },
    {
      url,
      options: {
        method,
        headers,
        body,
      },
    }
  );
} 