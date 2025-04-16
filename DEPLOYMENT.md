# Deployment Guide

This guide provides instructions for deploying the Optiflow application to production environments.

## Prerequisites

- Node.js 18.x or higher
- Docker and Docker Compose (for containerized deployment)
- A production server (e.g., VPS, AWS EC2, etc.)
- Google OAuth credentials (follow the steps in GOOGLE_OAUTH_SETUP.md)
- Pipedream account and API credentials (for OAuth integrations)

## Option 1: Standard Deployment

### 1. Set up Environment Variables

Create a `.env.production` file with the following variables:

```
# Pipedream Configuration
NEXT_PUBLIC_PIPEDREAM_API_KEY=your_pipedream_api_key
NEXT_PUBLIC_PIPEDREAM_API_SECRET=your_pipedream_api_secret
NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=your_pipedream_client_id
NEXT_PUBLIC_PIPEDREAM_TOKEN=your_pipedream_token
DATABASE_URL=your_database_url
NODE_ENV=production

# NextAuth.js
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=a_very_strong_secret_key_at_least_32_chars_long

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Generate a secure secret for NextAuth:

```bash
npm run generate-secret
```

### 2. Check Environment Variables

Verify all required environment variables are set:

```bash
npm run check-env
```

### 3. Build and Start

```bash
# Install dependencies
npm ci

# Run the deployment script
npm run deploy
```

## Option 2: Docker Deployment

### 1. Set up Environment Variables

Same as above, create a `.env.production` file.

### 2. Build and Run with Docker

```bash
# Build the Docker image
npm run docker:build

# Start containers with Docker Compose
npm run docker:start
```

To stop the containers:

```bash
npm run docker:stop
```

## Google OAuth Configuration

For Google OAuth to work in production:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Add your production domain to the Authorized JavaScript origins
3. Add `https://your-production-domain.com/api/auth/callback/google` to the Authorized redirect URIs
4. Update the `NEXTAUTH_URL` in your `.env.production` file to match your production domain

## Pipedream SDK Configuration

For the Pipedream SDK to work in production:

1. Set up a [Pipedream account](https://pipedream.com)
2. Create an OAuth application in Pipedream
3. Get your API Key, Client ID, and Token
4. Add these to your `.env.production` file
5. For more details, see the [PIPEDREAM_SDK_GUIDE.md](./PIPEDREAM_SDK_GUIDE.md)

## Production Considerations

### Security

- Always use HTTPS in production
- Generate a strong NEXTAUTH_SECRET (at least 32 characters)
- Consider using environment-specific credentials for services

### Performance

- Enable caching where appropriate
- Consider using a CDN for static assets
- Monitor performance and optimize as needed

### Database

- Use a production-ready database setup
- Ensure regular backups are configured
- Set up database monitoring

### Monitoring and Logging

- Implement application monitoring
- Set up error tracking
- Configure proper logging

## Troubleshooting

- **OAuth callback issues**: Ensure redirect URIs are correctly configured
- **Database connection problems**: Check connection strings and ensure network access
- **Container won't start**: Check logs with `docker-compose logs`
- **Pipedream connection failures**: Verify your PIPEDREAM_TOKEN and CLIENT_ID are correct 