# Client Dockerfile - Next.js Application
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Create public directory if it doesn't exist (Next.js may need it)
RUN mkdir -p public

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files and install production dependencies
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=base --chown=nextjs:nodejs /app/package.json ./

# Create public directory (Next.js works fine without it, but it's good to have)
RUN mkdir -p public && chown nextjs:nodejs public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "start"]
