FROM node:22-slim AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile

FROM dependencies AS builder
COPY . .
RUN pnpm --filter api build

# Production image
FROM node:22-slim AS runner

RUN npm install -g pnpm@9.0.0

WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/api/package.json ./apps/api/

COPY packages/ ./packages/

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/start.sh ./start.sh
RUN chmod +x ./start.sh

RUN pnpm config set node-linker hoisted && \
    pnpm install --prod --frozen-lockfile
# Expose port
EXPOSE 3005

# Start the app
ENTRYPOINT [ "./start.sh" ]
