// ES Module version to fix Pipedream environment variables
import 'dotenv/config';
import fs from 'fs';
import { createBackendClient } from '@pipedream/sdk/server';

// Fixed environment variables
const fixedEnv = {
  PIPEDREAM_CLIENT_ID: 'kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM',
  PIPEDREAM_CLIENT_SECRET: 'ayINomSnhCcHGR6Xf1_4PElM25mqsEFsrvTHKQ7ink0',
  PIPEDREAM_PROJECT_ID: 'proj_LosDxgO',
  PIPEDREAM_PROJECT_ENVIRONMENT: 'development'
};

// Apply fixed values to the current environment
Object.entries(fixedEnv).forEach(([key, value]) => {
  process.env[key] = value;
});

console.log('Running Pipedream environment variable fixer...');
console.log('✅ Pipedream environment variables patched');
console.log('Environment state:', {
  hasClientId: !!process.env.PIPEDREAM_CLIENT_ID,
  hasClientSecret: !!process.env.PIPEDREAM_CLIENT_SECRET,
  hasProjectId: !!process.env.PIPEDREAM_PROJECT_ID,
  projectEnvironment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.isyncso.com',
  redirectUri: (process.env.NEXT_PUBLIC_APP_URL || 'https://app.isyncso.com') + '/api/pipedream/callback'
});