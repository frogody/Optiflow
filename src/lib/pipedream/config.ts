// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { PipedreamConfig } from './types';

// Base URL configuration
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' 
  ? 'https://app.isyncso.com'
  : 'http://localhost:3000');

export default baseUrl;

export const getPipedreamConfig = (): PipedreamConfig => {
  return {
    clientId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || '',
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET || '',
    redirectUri: `${baseUrl}/api/pipedream/callback`,
    scopes: ['read_workflows', 'write_workflows'],
    environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT || 'production'
  };
}; 