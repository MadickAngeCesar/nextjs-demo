# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js app using the `/app` directory structure, bootstrapped with `create-next-app`.
- The project uses TypeScript, and leverages modern Next.js features (layouts, server components, route handlers).
- Data access is handled via Prisma (see `lib/generated/prisma/` and `prisma/schema.prisma`).
- Authentication flows are implemented under `app/(auth)/` and use custom logic in `lib/auth.ts` and `lib/supabase/`.
- Public, protected, and API routes are separated using folder conventions: `(auth)`, `(protected)`, `(public)`, and `api/`.

## Key Patterns & Conventions
- **UI Components**: Reside in `components/` and `components/ui/`. Use functional components and follow the existing file structure for new UI elements.
- **Hooks**: Custom React hooks are in `hooks/` (e.g., `useTheme.ts`).
- **Lib Utilities**: Shared logic and data access in `lib/`. Use `lib/db.ts` for database access, `lib/auth.ts` for authentication helpers.
- **Validation**: Form and data validation logic is in `lib/validations/`.
- **Prisma**: All Prisma types and generated clients are in `lib/generated/prisma/`. Update `prisma/schema.prisma` and run migrations for schema changes.
- **API Routes**: Use the `app/api/` directory for API endpoints. Route handlers are in `route.ts` files.
- **Docs & Specs**: Project documentation, requirements, and diagrams are in `docs/`.

 - **Documentation**: All generated code (types, interfaces, classes, functions, components, APIs) must be documented with JSDoc comments. For UI components, document props, defaults, and accessibility notes. For APIs, document request/response types and error handling.
 - **API Route Testing**: For every generated API route, create a corresponding Jest test file (e.g., `__tests__/api/[route].test.ts`). Tests must be runnable with `pnpm test` and cover main success/failure cases.

## Developer Workflows
- **Start Dev Server**: Use `pnpm dev` (preferred).
- **Prisma Migrations**: Edit `prisma/schema.prisma`, then run `pnpm prisma migrate dev`.
- **Seeding Data**: Use `prisma/seeds.ts` and `lib/placeholder-data.ts` for initial data population.
- **Deployment**: Deploy to Vercel for production (see README.md for details).
 - **Run Tests**: Always run `pnpm test` after generating or updating API routes. Ensure all new and existing tests pass before committing.

## Integration Points
- **Supabase**: Used for authentication and possibly data storage. See `lib/supabase/` for client/server logic.
- **Prisma**: Used for database ORM. All models/types are generated in `lib/generated/prisma/`.

## Examples
- To add a new protected page: place it under `app/(protected)/` and use authentication helpers from `lib/auth.ts`.
- To add a new API route: create a folder in `app/api/` and add a `route.ts` file.
- To add a new UI component: add it to `components/ui/` and document its props with JSDoc.

## References
- See `README.md` for getting started and deployment.
- See `docs/` for requirements, specs, and architecture diagrams.
- See `prisma/schema.prisma` for data models.

---

**Update this file if you introduce new conventions, workflows, or major dependencies.**
