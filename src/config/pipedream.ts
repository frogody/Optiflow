export const pipedreamConfig = {
  clientId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || '',
  clientSecret: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_SECRET || '',
  projectId: process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ID || '',
  environment: 'development' // or 'production' based on your needs
}; 