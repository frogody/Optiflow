# Configuring CORS for Render Voice Agent

## Problem
CORS (Cross-Origin Resource Sharing) is blocking requests from the Vercel frontend (`https://app.isyncso.com`) to the Render backend (`https://optiflow-voice-agent.onrender.com`).

## Solution
You need to configure CORS properly on your Render server. There are two ways to do this:

### Option 1: Configure Render Environment Variables
1. Log in to your Render dashboard
2. Select your voice agent service
3. Go to the "Environment" tab
4. Add the following environment variables:

```
CORS_ALLOW_ORIGIN=https://app.isyncso.com
CORS_ALLOW_CREDENTIALS=true
CORS_ALLOW_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOW_HEADERS=X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version
```

### Option 2: Modify Server Code (If you have access)
If your voice agent is using Express, modify the server code to include the CORS middleware:

```javascript
const cors = require('cors');

// Configure CORS
const corsOptions = {
  origin: 'https://app.isyncso.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version']
};

app.use(cors(corsOptions));
```

### Option 3: Add Custom Headers in Render Dashboard (For Web Services)
1. Log in to your Render dashboard
2. Select your voice agent service
3. Go to the "Settings" tab
4. Under "Headers", add the following:

```
Access-Control-Allow-Origin: https://app.isyncso.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version
```

## Verification
After making these changes, you'll need to redeploy your Render service for the changes to take effect.

## Testing
Once deployed, you can verify CORS is working by:
1. Opening your application at `https://app.isyncso.com`
2. Opening the browser developer console
3. Checking if the voice agent API requests succeed without CORS errors 