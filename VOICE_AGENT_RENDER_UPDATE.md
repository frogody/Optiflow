# Updating Your Voice Agent on Render

Since your Render voice agent service already exists, here are two ways to update it with the new code:

## Method 1: Using Git (Recommended)

1. Clone your voice agent repository (replace with your actual repository URL):
   ```bash
   git clone https://github.com/your-username/voice-agent-repo.git
   cd voice-agent-repo
   ```

2. Copy the new files to the repository:
   ```bash
   cp /path/to/Optiflow/voice-agent-service/main.py .
   cp /path/to/Optiflow/voice-agent-service/requirements.txt .
   ```

3. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Update voice agent with CORS support and proper endpoints"
   git push
   ```

4. Render will automatically deploy your changes when they're pushed to the main branch.

## Method 2: Manual Update via Render Dashboard

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Select your existing voice agent service
3. Go to the "Settings" tab
4. Scroll down to "Build & Deploy" section
5. If you're using a different repository, update the Repository URL
6. Update the Build Command if needed (should be `pip install -r requirements.txt`)
7. Update the Start Command if needed (should be `uvicorn main:app --host 0.0.0.0 --port $PORT`)
8. Click "Save Changes"
9. Click "Manual Deploy" > "Deploy latest commit"

## Method 3: Using the Render API

If you have an API key, you can also update your service using the Render API:

1. Get your service ID from the URL in your Render dashboard
2. Create a curl request to update the service:
   ```bash
   curl --request PATCH \
     --url "https://api.render.com/v1/services/YOUR_SERVICE_ID" \
     --header "Authorization: Bearer YOUR_API_KEY" \
     --header "Content-Type: application/json" \
     --data '{
       "envVars": [
         {"key": "CORS_ALLOW_ORIGIN", "value": "https://app.isyncso.com"},
         {"key": "CORS_ALLOW_CREDENTIALS", "value": "true"},
         {"key": "CORS_ALLOW_METHODS", "value": "GET,POST,PUT,DELETE,OPTIONS"},
         {"key": "CORS_ALLOW_HEADERS", "value": "X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version"}
       ]
     }'
   ```

## Testing Your Updated Service

After deploying, check the following:

1. Health endpoint: `https://your-service-url.onrender.com/health`
2. Try a CORS preflight request to ensure headers are correct:
   ```bash
   curl -X OPTIONS -H "Origin: https://app.isyncso.com" \
     -H "Access-Control-Request-Method: POST" \
     https://your-service-url.onrender.com/agent/dispatch -v
   ```

Your updated voice agent should now properly handle CORS requests from your frontend application. 