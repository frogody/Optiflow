#!/bin/bash

# Set the DATABASE_URL for production
export DATABASE_URL="postgres://neondb_owner:npg_5sX2JprvCDRb@ep-noisy-cell-a2y3ohah-pooler.eu-central-1.aws.neon.tech/neondb"

# Remove existing migrations
rm -rf prisma/migrations

# Create and apply new migration
npx prisma migrate reset --force
npx prisma migrate dev --name init
npx prisma migrate deploy 