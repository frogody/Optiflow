#!/bin/bash

# Replace these variables with your actual values
PROJECT_ID="your-project-id"
ACCESS_TOKEN="your-access-token"
EXTERNAL_USER_ID="your-external-user-id"

# Make the API request
curl -X POST "https://api.pipedream.com/v1/connect/${PROJECT_ID}/tokens" \
  -H "Content-Type: application/json" \
  -H "X-PD-Environment: development" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"external_user_id\": \"${EXTERNAL_USER_ID}\"
  }" 