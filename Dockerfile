FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Add build arguments for Pipedream
ARG NEXT_PUBLIC_PIPEDREAM_CLIENT_ID
ARG NEXT_PUBLIC_PIPEDREAM_TOKEN
ENV NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=$NEXT_PUBLIC_PIPEDREAM_CLIENT_ID
ENV NEXT_PUBLIC_PIPEDREAM_TOKEN=$NEXT_PUBLIC_PIPEDREAM_TOKEN

# Build the app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/api/health || exit 1

# Run the app
CMD ["node", "server.js"] 