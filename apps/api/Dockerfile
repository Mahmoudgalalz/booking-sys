FROM node:22-slim AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

# If you have shared packages, copy them too
COPY packages/ ./packages/

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Build the app
FROM dependencies AS builder
COPY . .
RUN pnpm --filter api build

# Production image
FROM node:22-slim AS runner

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app
ENV NODE_ENV=production

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy API package.json
COPY apps/api/package.json ./apps/api/

# Copy shared packages package.json files if they exist
COPY packages/ ./packages/

# Copy built app
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Install production dependencies with node-linker=hoisted
RUN pnpm config set node-linker hoisted && \
    pnpm install --prod --frozen-lockfile

# Expose port
EXPOSE 3005

# Start the app
CMD ["node", "apps/api/dist/main.js"]
