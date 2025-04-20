#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to print status messages
print_status() {
    echo -e "${YELLOW}==> $1${NC}"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages and exit
print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
fi

# Check for required tools
print_status "Checking required tools..."
command -v node >/dev/null 2>&1 || print_error "Node.js is required but not installed"
command -v npm >/dev/null 2>&1 || print_error "npm is required but not installed"
command -v vercel >/dev/null 2>&1 || { print_status "Installing Vercel CLI..."; npm install -g vercel; }

# Install dependencies
print_status "Installing dependencies..."
npm install || print_error "Failed to install dependencies"

# Run type check and linting
print_status "Running type check and linting..."
npm run lint || print_error "Linting failed"

# Check for .env.production
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found"
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel deploy --prod || print_error "Deployment failed"

print_success "Deployment completed successfully!"
print_status "Next steps:"
echo "1. Verify your deployment at https://app.isyncso.com"
echo "2. Check Vercel dashboard for any build warnings"
echo "3. Run database migrations if needed: npx prisma migrate deploy" 