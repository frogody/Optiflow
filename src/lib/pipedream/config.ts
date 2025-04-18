import { PipedreamConfig } from './types';

export const getPipedreamConfig = (): PipedreamConfig => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.isyncso.com';
  
  return {
    clientId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || '',
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET || '',
    redirectUri: `${baseUrl}/api/pipedream/callback`,
    scopes: ['read_workflows', 'write_workflows'],
    environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT || 'production'
  };
}; 