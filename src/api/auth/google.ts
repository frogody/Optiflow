import { OAuth2Client } from 'google-auth-library';

// Create a new OAuth client using the credentials
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'https://optiflow-pink.vercel.app/api/auth/callback/google'
);

/**
 * Generate a URL for redirecting users to Google's OAuth consent screen
 */
export function getGoogleAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'https://optiflow-pink.vercel.app/api/auth/callback/google'
  });
}

/**
 * Exchange an authorization code for tokens
 */
export async function getGoogleTokens(code: string) {
  const { tokens } = await client.getToken(code);
  return tokens;
}

/**
 * Get Google user info from an access token
 */
export async function getGoogleUserInfo(accessToken: string) {
  client.setCredentials({ access_token: accessToken });
  const response = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`);
  }
  
  return await response.json();
} 