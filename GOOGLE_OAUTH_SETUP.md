# Google OAuth Setup Instructions

This document provides step-by-step instructions for setting up Google OAuth for your application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make note of your Project ID

## Step 2: Enable the Google OAuth API

1. In your Google Cloud project, go to the "APIs & Services > Library" section
2. Search for "Google OAuth2 API" and enable it
3. Also enable the "Google+ API" if you need access to user profile information

## Step 3: Configure the OAuth Consent Screen

1. Go to "APIs & Services > OAuth consent screen"
2. Select the appropriate user type (External or Internal)
3. Fill in the required app information:
   - App name
   - User support email
   - Developer contact information
4. Add the necessary scopes (at minimum, include `.../auth/userinfo.email` and `.../auth/userinfo.profile`)
5. Add your domain to the authorized domains list
6. Save and continue

## Step 4: Create OAuth Client ID Credentials

1. Go to "APIs & Services > Credentials"
2. Click "Create Credentials" and select "OAuth client ID"
3. Select "Web application" as the application type
4. Add a name for your OAuth client
5. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: Your production domain
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
7. Click "Create"

## Step 5: Save Your Client ID and Secret

After creating the client ID, you'll receive your client ID and client secret. Add these to your `.env.local` file:

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_SECRET=a-random-secret-for-nextauth
NEXTAUTH_URL=http://localhost:3000
```

For production, make sure to update the NEXTAUTH_URL to your production URL.

## Step 6: Restart Your Application

Restart your development server to load the new environment variables:

```
npm run dev
```

## Testing

You should now be able to sign in with Google. Click the "Sign in with Google" button on your login page to test.

## Troubleshooting

- If you get a redirect URI mismatch error, double-check that the URI in your Google Cloud Console exactly matches the callback URL in your application.
- Make sure your OAuth consent screen is properly configured with the necessary scopes.
- Check that your environment variables are correctly set up and loaded.
- For local development, ensure you're using http://localhost:3000 rather than 127.0.0.1. 