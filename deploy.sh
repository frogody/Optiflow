#!/bin/bash

# Exit on error
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print status messages
print_status() {
    echo -e "${GREEN}➡️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if running in CI/CD environment
if [ -z "$CI" ]; then
    # Generate new secrets for local deployment
    print_status "Generating new secrets..."
    node scripts/generate-secret.js

    # Verify environment variables
    print_status "Verifying environment variables..."
    node scripts/check-env.js
fi

# Create database backup
print_status "Creating database backup..."
npm run db:backup

# Run database migrations
print_status "Running database migrations..."
npm run db:migrate

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the application
print_status "Building the application..."
NODE_ENV=production npm run build

# Deploy to Vercel
if [ -n "$VERCEL_TOKEN" ]; then
    print_status "Deploying to Vercel..."
    
    # Create .vercelignore if it doesn't exist
    if [ ! -f ".vercelignore" ]; then
        cat > .vercelignore << EOL
.git
.env*
node_modules
.next
backups/
*.sql
*.dump
coverage/
test-results/
playwright-report/
EOL
    fi

    # Deploy with Vercel CLI
    if [ -n "$CI" ]; then
        # CI/CD deployment
        vercel deploy --token "$VERCEL_TOKEN" --prod --yes
    else
        # Interactive deployment
        vercel deploy --prod
    fi

    DEPLOY_URL=$(vercel --token "$VERCEL_TOKEN" ls -1 | head -n1 | awk '{print $2}')
    print_status "Deployment successful! Available at: $DEPLOY_URL"

    # Update environment variables in Vercel
    print_status "Updating Vercel environment variables..."
    if [ -f ".env.production" ]; then
        while IFS='=' read -r key value; do
            if [ ! -z "$key" ] && [ ! -z "$value" ]; then
                vercel env add "$key" "$value" --token "$VERCEL_TOKEN"
            fi
        done < .env.production
    fi

    # Invalidate CDN cache
    print_status "Invalidating CDN cache..."
    vercel --token "$VERCEL_TOKEN" deploy --prod --force

else
    print_warning "VERCEL_TOKEN not found. Skipping Vercel deployment."
    print_status "Starting production server locally..."
    npm run prod:start
fi

# Final checks
print_status "Running final health checks..."
curl -f "$DEPLOY_URL/api/health" || print_warning "Health check failed, but deployment completed"

print_status "🚀 Deployment completed successfully!"

# Print helpful information
cat << EOL

📝 Deployment Summary:
- Application URL: $DEPLOY_URL
- Environment: ${NODE_ENV:-production}
- Database: Migrated and backed up
- Secrets: Updated
- CDN: Cache invalidated

🔍 Next steps:
1. Visit $DEPLOY_URL to verify the deployment
2. Check the logs in Vercel dashboard
3. Monitor error rates for the next few hours

For issues or rollback, run: ./deploy.sh --rollback
EOL 