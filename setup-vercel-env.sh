#!/bin/bash

# Function to update secret and environment variable
update_secret_and_env() {
    local name=$1
    local value=$2
    vercel secrets rm "$name" -y || true
    vercel secrets add "$name" "$value"
    vercel env rm "$name" production -y || true
    vercel env add "$name" "@$name" production
}

# Database URLs
update_secret_and_env "database_url" "postgres://neondb_owner:npg_5sX2JprvCDRb@ep-noisy-cell-a2y3ohah-pooler.eu-central-1.aws.neon.tech/neondb"
update_secret_and_env "postgres_url" "postgres://neondb_owner:npg_5sX2JprvCDRb@ep-noisy-cell-a2y3ohah-pooler.eu-central-1.aws.neon.tech/neondb"
update_secret_and_env "postgres_prisma_url" "postgres://neondb_owner:npg_5sX2JprvCDRb@ep-noisy-cell-a2y3ohah-pooler.eu-central-1.aws.neon.tech/neondb"
update_secret_and_env "postgres_url_non_pooling" "postgres://neondb_owner:npg_5sX2JprvCDRb@ep-noisy-cell-a2y3ohah.eu-central-1.aws.neon.tech/neondb"
update_secret_and_env "postgres_url_no_ssl" "postgres://neondb_owner:npg_5sX2JprvCDRb@ep-noisy-cell-a2y3ohah.eu-central-1.aws.neon.tech/neondb"
update_secret_and_env "database_url_unpooled" "postgres://neondb_owner:npg_5sX2JprvCDRb@ep-noisy-cell-a2y3ohah.eu-central-1.aws.neon.tech/neondb"

# Database host and user
update_secret_and_env "postgres_host" "ep-noisy-cell-a2y3ohah-pooler.eu-central-1.aws.neon.tech"
update_secret_and_env "postgres_user" "neondb_owner"
update_secret_and_env "pghost" "ep-noisy-cell-a2y3ohah-pooler.eu-central-1.aws.neon.tech"
update_secret_and_env "pguser" "neondb_owner"

# Auth URLs and secrets
update_secret_and_env "nextauth_url" "https://app.isyncso.com"

# Environment
vercel env rm "NODE_ENV" production -y || true
vercel env add "NODE_ENV" "production" production 