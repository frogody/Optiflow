#!/bin/bash

# Create icons directory if it doesn't exist
mkdir -p public/icons

# Download logos from official sources
curl -o public/icons/slack.svg https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_icon_2019.svg
curl -o public/icons/gmail.svg https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg
curl -o public/icons/hubspot.svg https://upload.wikimedia.org/wikipedia/commons/5/5a/HubSpot_Logo.svg
curl -o public/icons/sheets.svg https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Sheets_Logo_%282014-2020%29.svg
curl -o public/icons/zapier.svg https://upload.wikimedia.org/wikipedia/commons/5/5a/Zapier_logo.svg
curl -o public/icons/stripe.svg https://upload.wikimedia.org/wikipedia/commons/2/2a/Stripe_logo%2C_blurred.svg
curl -o public/icons/asana.svg https://upload.wikimedia.org/wikipedia/commons/8/8a/Asana_Logo.svg
curl -o public/icons/github.svg https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg
curl -o public/icons/quickbooks.svg https://upload.wikimedia.org/wikipedia/commons/9/9a/QuickBooks_logo.svg
curl -o public/icons/mailchimp.svg https://upload.wikimedia.org/wikipedia/commons/9/9b/Mailchimp_logo.svg
curl -o public/icons/salesforce.svg https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg
curl -o public/icons/analytics.svg https://upload.wikimedia.org/wikipedia/commons/5/5a/Google_Analytics_logo.svg
curl -o public/icons/twitter.svg https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg
curl -o public/icons/trello.svg https://upload.wikimedia.org/wikipedia/commons/7/7c/Trello-logo-blue.svg
curl -o public/icons/dropbox.svg https://upload.wikimedia.org/wikipedia/commons/7/7c/Dropbox_Icon.svg

# Make the script executable
chmod +x scripts/download-logos.sh 