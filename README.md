# DaoTeam

DaoTeam is a modern team workspace application for organizing company conversations around workspaces, channels, members, threaded discussions, and AI-assisted writing. It combines a Slack-like messaging experience with organization billing, usage limits, member invitations, image uploads, live presence, and streamed AI responses.

The app is built with Next.js 16, React 19, Better Auth, tRPC, TanStack Query, Drizzle ORM, Neon Postgres, Stripe, Cloudinary, Mailjet, Cohere, and a small custom WebSocket layer.

## What It Does

DaoTeam gives teams a structured place to collaborate:

- Create and switch between multiple workspaces.
- Create channels inside each workspace.
- Send rich text messages with a TipTap-powered editor.
- Attach images to messages through Cloudinary.
- Reply in message threads without losing the main channel context.
- React to messages with emoji reactions.
- Invite members to an organization by email.
- See workspace-level member presence in real time.
- Receive realtime channel and thread updates over WebSockets.
- Use AI to compose better messages.
- Generate AI summaries of discussion threads.
- Track AI usage against workspace subscription limits.
- Manage free, pro, and enterprise subscription tiers through Stripe.

## Core Product Flows

### Authentication and Onboarding

Users can sign up with email and password or social login through Google and GitHub. Email verification is handled with Better Auth's OTP flow and Mailjet email delivery.

After sign-up, users move through onboarding:

1. Create an organization/workspace.
2. Select a plan.
3. Enter the main workspace experience.

The app stores each user's selected plan and onboarding phase so the UI can resume the correct state.

### Workspaces and Members

Workspaces are backed by Better Auth organizations and custom Drizzle schema fields for AI usage tracking. Members are scoped to organizations, and workspace access is checked before loading channels, messages, subscriptions, or realtime connections.

Organization owners and admins can create channels and manage billing-sensitive actions. Invitation acceptance broadcasts a workspace event so active clients can refresh member state.

### Channels and Messaging

Each workspace can contain multiple channels. Channels hold top-level messages, and each message can have a thread of replies.

Messages support:

- Rich text editing.
- Optional image attachments.
- Reactions.
- Editing by the original author.
- Thread replies.
- Realtime refresh when channel or thread activity changes.

The main channel view uses tRPC queries and mutations for data access, TanStack Query for caching, and WebSocket events for invalidation.

### AI Assistance

DaoTeam includes two AI features powered by Cohere through the Vercel AI SDK:

- AI compose: streams a rewritten or improved message draft from the latest user prompt.
- AI thread summaries: streams a structured summary of a selected message thread.

Both features are usage-gated by workspace subscription limits. Usage is tracked on the organization record and resets monthly.

### Billing

Billing is implemented with Better Auth's Stripe plugin using organization-based subscriptions.

Available plans:

- Free: 50 AI generated messages and 1 AI thread summary per month.
- Pro: 500 AI generated messages and 5 AI thread summaries per month.
- Enterprise: unlimited AI generated messages and AI thread summaries.

Stripe customer and subscription data is stored alongside the Better Auth organization and subscription records.

### Realtime Updates

The app exposes a WebSocket endpoint at `/api/ws`, initialized through the Pages Router API route at `src/pages/api/socket.ts`.

Realtime events include:

- Socket ready state.
- Channel message created or edited.
- Thread message created.
- Workspace member added.
- Workspace presence synchronization.

Connections are authenticated with Better Auth session cookies, checked against workspace membership, and restricted to configured origins through `WS_ALLOWED_ORIGINS`.

## Tech Stack

- Framework: Next.js 16 App Router with React 19.
- Language: TypeScript.
- Styling: Tailwind CSS 4 with local UI primitives.
- UI: Radix UI, Vaul, Sonner, Lucide icons, Motion.
- Auth: Better Auth with email/password, OTP verification, Google, GitHub, organizations, and Stripe subscriptions.
- API: tRPC 11 with TanStack Query.
- Database: Neon Postgres with Drizzle ORM and Drizzle Kit.
- Rich text: TipTap.
- AI: Vercel AI SDK with Cohere.
- Email: Mailjet.
- Images: Cloudinary.
- Realtime: `ws` WebSocket server mounted through Next.js.

## Project Structure

```text
src/app/                    Next.js routes, layouts, and API handlers
src/app/(auth)/             Sign in and sign up pages
src/app/(main)/workspace/   Authenticated workspace experience
src/app/api/ai/             AI compose and thread summary endpoints
src/app/api/auth/           Better Auth route handler
src/app/api/trpc/           tRPC route handler
src/pages/api/socket.ts     WebSocket bootstrap endpoint
src/components/             Feature and UI components
src/components/messages/    Message list, editor, reactions, and threads
src/components/settings/    Billing and usage settings
src/db/                     Drizzle database client and schema
src/hooks/                  Client hooks for dialogs, sockets, and UI state
src/lib/                    Auth, AI, email, billing, WebSocket, and utility code
src/trpc/                   Routers, procedures, client, and server helpers
src/data/env/               Runtime environment validation
public/                     Static product and brand assets
```

## Getting Started

### Prerequisites

- Node.js compatible with Next.js 16 and React 19.
- npm, because this repository includes `package-lock.json`.
- A Neon Postgres database.
- Credentials for Better Auth, Mailjet, Google OAuth, GitHub OAuth, Stripe, Cloudinary, and Cohere.

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Then fill in the required values:

```dotenv
# Neon
DATABASE_URL=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# App
NEXT_PUBLIC_APP_URL=

# Mailjet
MAILJET_API_KEY=
MAILJET_API_SECRET=
SENDER_EMAIL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_ENTERPRISE_PRICE_ID=

# WebSockets
WS_ALLOWED_ORIGINS=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Cohere
COHERE_API_KEY=
```

For local development, these URL-style values are usually:

```dotenv
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
WS_ALLOWED_ORIGINS=http://localhost:3000
```

`WS_ALLOWED_ORIGINS` accepts a comma-separated list when multiple origins need access.

### Set Up the Database

Push the current Drizzle schema to your configured Postgres database:

```bash
npm run db:push
```

You can also generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Open Drizzle Studio when you need to inspect local data:

```bash
npm run db:studio
```

### Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev          # Start the Next.js development server
npm run build        # Build the production application
npm run start        # Start the production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes directly to the database
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply Drizzle migrations
npm run db:studio    # Open Drizzle Studio
npm run db:auth      # Generate Better Auth schema output
```

## Data Model Overview

DaoTeam uses Drizzle tables for both Better Auth data and product data:

- `user`, `session`, `account`, and `verification` support Better Auth.
- `organization`, `member`, and `invitation` support workspaces and membership.
- `subscription` stores Stripe-backed subscription state.
- `channels` stores workspace channels.
- `messages` stores channel messages and threaded replies.
- `reactions` stores per-user emoji reactions on messages.

Messages belong to a channel and organization. Thread replies are messages whose `threadId` references a parent message.

## Environment Validation

Environment variables are validated with `@t3-oss/env-nextjs`:

- Server-only variables live in `src/data/env/server.ts`.
- Public client variables live in `src/data/env/client.ts`.

If a required variable is missing, the app will fail early instead of running with a partial configuration.

## Contributor Notes

This repository uses Next.js 16. Before changing framework-specific code, read the relevant guide in `node_modules/next/dist/docs/` because this version may differ from older Next.js APIs and conventions.

Keep feature work aligned with the existing architecture:

- Use tRPC procedures for authenticated product data operations.
- Keep workspace and channel authorization checks close to data access.
- Use TanStack Query invalidation for client refreshes after mutations.
- Broadcast WebSocket events when a mutation should update active clients.
- Validate server and client environment changes in `src/data/env`.
- Prefer existing UI primitives and component patterns before adding new abstractions.

## Deployment Notes

Before deploying, make sure the production environment includes:

- A production Postgres database and `DATABASE_URL`.
- Production Better Auth URL and secret.
- OAuth callback URLs for Google and GitHub.
- Stripe product price IDs and webhook secret.
- Mailjet sender configuration.
- Cloudinary credentials.
- Cohere API key.
- `WS_ALLOWED_ORIGINS` set to the production app origin.

The app can be built with:

```bash
npm run build
```

Then started with:

```bash
npm run start
```
