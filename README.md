# Booking FinCart System

A comprehensive booking system built with NestJS (API) and React (Web) in a Turborepo monorepo structure.

## Overview

This project is a service booking platform that allows users to book services from various providers. The system includes user management, provider profiles, service listings, time slot scheduling, and booking management.

## Tech Stack

- **Backend**: NestJS with TypeORM and PostgreSQL
- **Frontend**: React with Vite, TailwindCSS, and Tanstack libraries
- **Infrastructure**: Docker and Docker Compose
- **Package Management**: pnpm and Turborepo

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: a [NestJS](https://nestjs.com/) backend application
- `web`: a [React](https://react.dev/) frontend application with [Vite](https://vitejs.dev/)
- `packages`: shared libraries and configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Docker](https://www.docker.com/) for containerization
- [PostgreSQL](https://www.postgresql.org/) for database management

## Docker Setup

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker Compose

1. Clone the repository:

```bash
git clone <repository-url>
cd booking-fincart
```

2. Start the application stack:

```bash
docker-compose up -d
```

This will start the following services:
- PostgreSQL database (port 5432)
- API backend (port 3005)
- Web frontend (port 5173)

3. Access the applications:
   - Frontend: http://localhost:5173
   - API: http://localhost:3005

### Building Docker Images Manually

If you want to build the Docker images separately:

```bash
# Build API image
docker build -t booking-fincart-api -f ./apps/api/Dockerfile .

# Build Web image
docker build -t booking-fincart-web -f ./apps/web/Dockerfile .
```

## Database

The system uses PostgreSQL for data storage. For detailed information about the database schema and relationships, see [DATABASE.md](./DATABASE.md).

### Development Setup

To run the applications without Docker for development:

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

### Build Commands

To build all apps and packages:

```bash
# Using pnpm
pnpm build

# Using turbo directly
turbo build
```

To build a specific app:

```bash
# Build API only
pnpm build --filter=api

# Build Web only
pnpm build --filter=web
```

### Development Commands

To run all apps in development mode:

```bash
pnpm dev
```

To run a specific app in development mode:

```bash
# Run API only
pnpm dev --filter=api

# Run Web only
pnpm dev --filter=web
```

## Environment Configuration

### API Environment Variables

The API service requires the following environment variables:

```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=booking_fincart
JWT_SECRET=your_jwt_secret_here
PORT=3005
```

These are already configured in the docker-compose.yml file for Docker deployment.

### Web Environment Variables

The web application requires:

```
API_URL=http://api:3005
```

## Database Migrations

To run database migrations:

```bash
# In development
cd apps/api
pnpm migration:run

# In Docker
docker-compose exec api pnpm migration:run
```

## Features

- User authentication and authorization
- Role-based access control (user and provider roles)
- Service provider profiles and verification
- Service catalog with categories and pricing
- Time slot scheduling and availability management
- Booking system with status tracking
- Payment status monitoring

## Useful Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [TypeORM Documentation](https://typeorm.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
