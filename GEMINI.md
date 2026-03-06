# Project: AlterSchool Events Platform

This document provides a comprehensive overview of the AlterSchool Events Platform codebase, intended as a guide for AI-assisted development.

## 1. Project Overview

This is a full-stack monorepo application built with TypeScript. The project is managed using `pnpm` workspaces, separating the frontend client and backend server into distinct packages.

### Core Technologies

- **Monorepo:** `pnpm` workspaces
- **Frontend (`packages/client`):**
  - Framework: Vue.js 3
  - Build Tool: Vite
  - Routing: `vue-router`
  - GraphQL Client: Apollo Client (`@vue/apollo-composable`)
  - Styling: Base CSS
- **Backend (`packages/server`):**
  - Framework: `graphql-yoga` (for serving the GraphQL API)
  - Database ORM: Prisma
  - Database: PostgreSQL
  - API: GraphQL
- **Development Tools:**
  - Linting: ESLint
  - Formatting: Prettier
  - Type-checking: TypeScript
  - GraphQL Code Generation: `graphql-codegen`

### Architecture

The project is structured as a monorepo containing two main packages:

- `packages/client`: A single-page application (SPA) built with Vue.js that consumes the GraphQL API.
- `packages/server`: A Node.js application that exposes a GraphQL API for interacting with the PostgreSQL database via Prisma.

The database schema is defined in `packages/server/prisma/schema.prisma` and includes models for `User`, `Profile`, `Student`, `Teacher`, and `AvailabilitySlot`, suggesting an educational or tutoring-based platform.

## 2. Building and Running the Project

The following commands are essential for setting up and running the application. They should be executed from the project's root directory.

### Initial Setup

1.  **Start the Database:** The project uses Docker to run a PostgreSQL database for development.

    ```bash
    docker compose -f docker-compose.dev.yaml up -d
    ```

2.  **Install Dependencies:** Install dependencies for all workspaces using `pnpm`.
    ```bash
    pnpm install
    ```

### Development

- **Run all development servers:** This is the primary command for development. It starts the frontend, backend, and GraphQL code generator in watch mode.

  ```bash
  pnpm dev
  ```

- **Run individual services:**

  ```bash
  # Start the backend server only
  pnpm dev:server

  # Start the frontend client only
  pnpm dev:client

  # Watch for GraphQL schema changes and regenerate types
  pnpm dev:codegen
  ```

### Production

- **Build all packages:**

  ```bash
  pnpm build:client
  pnpm build:server
  ```

- **Start the production server:** This command first ensures database migrations are applied and then starts the built server.
  ```bash
  pnpm start:server
  ```

## 3. Development Conventions

- **Package Management:** The project uses `pnpm` for managing dependencies and workspaces. Always use `pnpm` instead of `npm` or `yarn`.
- **Code Style:** The project is configured with Prettier for consistent code formatting and ESLint for linting. Use the `pnpm format` command to format code.
- **GraphQL:** The API is built using a schema-first approach.
  - Schema files are located in `packages/server/src/schema/`.
  - The `apollo.config.js` file points to the local schema for client-side development.
  - After modifying `.graphql` files, run `pnpm codegen` (or have `pnpm dev` running) to update the generated types for both client and server.
- **Database:**
  - The database schema is managed by Prisma. To make changes, edit `packages/server/prisma/schema.prisma`.
  - To create a new migration after schema changes, use a command like `pnpm --filter server prisma migrate dev --name <migration_name>`.
  - The `postinstall` script in the server package automatically runs `prisma generate` to create the Prisma Client.

---

### Development Plan

For a detailed breakdown of the current development goals and their status, please refer to the [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) file.
