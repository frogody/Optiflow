#!/bin/bash

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOL
# LiveKit Configuration
LIVEKIT_API_KEY="API2tbQVjSwUAZB"
LIVEKIT_API_SECRET="PwNX4F1FwxFVxd7f25RMv3Fw4SLRGwFUvtzeh4LhUOc"
NEXT_PUBLIC_LIVEKIT_URL="wss://isyncso-sync-p1sl1ryj.livekit.cloud"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Database URL (if using Prisma)
DATABASE_URL="file:./dev.db"
EOL
    echo ".env.local created successfully!"
else
    echo ".env.local already exists"
fi

# Make the script executable
chmod +x scripts/setup-env.sh 