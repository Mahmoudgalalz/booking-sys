FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

# Set working directory
WORKDIR /app

# Copy package files
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the app
FROM dependencies AS builder
COPY . .
RUN pnpm --filter api build

# Production image
FROM base AS runner
ENV NODE_ENV=production

# Copy built app
COPY --from=builder /app/apps/api/dist /app/dist
COPY --from=builder /app/apps/api/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

# Expose port
EXPOSE 3005

# Start the app
CMD ["node", "dist/main"]
