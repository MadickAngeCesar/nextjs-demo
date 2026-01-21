
<!--
	Detailed README generated from project structure.
	Edit to add project-specific notes and credentials; do NOT commit secrets.
-->

# Next.js Demo — Detailed Developer README

Short summary
 - Next.js app using the `/app` router (Next 13+ patterns)
 - TypeScript-first project with Prisma ORM and Supabase integration
 - Server and client code live in `app/`, `lib/`, and `components/`

Table of contents
 - Project architecture
 - Quickstart
 - Important directories & patterns
 - Developer workflows & scripts
 - Testing strategy (Jest) and API test requirements
 - Database: Prisma, migrations, seeds
 - CI/CD, linting, and typechecking
 - Contributing / AI agent guidance
 - Troubleshooting

## Project architecture (big picture)

 - Frontend: Next.js `app/` routes and layouts. Pages are composed from server and client components where appropriate.
 - UI: `components/` and `components/ui/` contain presentational and shared UI primitives. Follow existing file patterns when adding components.
 - Data layer: `lib/` contains shared utilities, authentication helpers (`lib/auth.ts`), Supabase wrappers (`lib/supabase/`), DB access (`lib/db.ts`), and validations (`lib/validations/`).
 - ORM: Prisma client code is generated under `lib/generated/prisma/` from `prisma/schema.prisma`.
 - API surface: Route handlers live under `app/api/*/route.ts`. These are Next.js route handlers (server code).
 - Authentication: Routes and flows are organized under `app/(auth)/` and protected pages under `app/(protected)/` using helpers in `lib/auth.ts` and `lib/supabase/`.

Why this structure
 - The `app/` router enables colocated layouts and server-first rendering for data fetching.
 - Splitting `(auth)`, `(protected)`, and `(public)` clarifies access boundaries and makes middleware simpler to reason about.

## Quickstart (local)

1. Install dependencies (pnpm is preferred):

```bash
pnpm install
```

2. Add environment variables (do NOT commit): create a `.env` with your DB and Supabase keys. Example keys the app expects (search `lib/supabase` and `prisma` to confirm exact names):

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db?schema=public
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. Run database migrations and seed (development):

```bash
pnpm prisma migrate dev
pnpm prisma db seed --preview-feature || node prisma/seeds.ts
```

4. Start dev server:

```bash
pnpm dev
# open http://localhost:3000
```

## Important directories & patterns (map to code)

 - `app/` — Next.js App Router pages, nested layouts, server/client components.
	 - `app/(auth)/` — authentication pages (signin, signup)
	 - `app/(protected)/` — authenticated pages (dashboard, protected routes)
	 - `app/(public)/` — public-facing pages
	 - `app/api/` — route handlers. Add route handlers as `app/api/<name>/route.ts`.
 - `components/` — UI components and design primitives. Add new components under `components/ui/`.
 - `lib/` — utilities (auth.ts, db.ts, api-response.ts, validations, rate-limit, etc.). Use these helpers rather than introducing global singletons.
 - `lib/generated/prisma/` — auto-generated Prisma client and types. Do not edit directly.
 - `prisma/` — Prisma schema and seed scripts.
 - `docs/` — higher-level requirements, diagrams, and design docs.

## Developer workflows & npm scripts

Common commands (pnpm preferred):

```bash
pnpm dev         # start Next dev server
pnpm build       # production build
pnpm start       # start built app
pnpm prisma      # run Prisma CLI
pnpm test        # run Jest tests
pnpm run lint    # lint codebase
pnpm run typecheck # run TypeScript checks
```

If `pnpm` is not available you may use `npm`/`yarn`, but CI and contributor scripts assume `pnpm`.

### Adding API routes

1. Create `app/api/<route>/route.ts` and export handlers for supported methods.
2. Use utilities in `lib/` for consistent responses and validations (e.g., `api-response.ts`, `lib/validations/`).
3. Add a Jest test under `__tests__/api/<route>.test.ts` (see Testing Strategy).

## Testing strategy (Jest) and API route requirements

 - All generated API routes must include a corresponding Jest test in `__tests__/api/` that covers main success and failure cases.
 - Tests should be runnable with `pnpm test`. When adding tests:
	 - Mock external services (Supabase, DB) where possible.
	 - Use the Prisma testing pattern appropriate for the project (in-memory DB or test database). Check `prisma/seeds.ts` and `lib/db.ts` for patterns used.
 - Example test path: `__tests__/api/arcjet.route.test.ts` for `app/api/arcjet/route.ts`.

If you need a test scaffold, request it and the project will add a minimal Jest config and example tests.

## Database: Prisma, migrations, seeds

 - Update `prisma/schema.prisma` for schema changes and run `pnpm prisma migrate dev`.
 - Generated client lands in `lib/generated/prisma/`; run `pnpm prisma generate` when schema changes.
 - Seeds are in `prisma/seeds.ts`. Use `pnpm prisma db seed` or run the seed file directly for local development.

## CI/CD, linting, and typechecking

 - CI is defined in `.github/workflows/ci.yml` and runs on PRs and pushes to `main`.
 - The CI job installs dependencies, runs lint, typecheck, tests, build, and records `pnpm audit` results.
 - Before opening a PR run locally:

```bash
pnpm ci
pnpm run lint
pnpm run typecheck
pnpm test --if-present
pnpm run build --if-present
```

## Contributing & code generation rules

 - Document all new exported types, interfaces, functions, classes, and components with JSDoc comments.
 - For UI components include props documentation, defaults, and accessibility notes.
 - For every new or changed API route, add a Jest test in `__tests__/api/` and ensure it passes before merging.
 - Use conventional commits to keep changelogs clean.

### AI agent guidance

 - See `.github/copilot-instructions.md` for agent-specific conventions. Highlights:
	 - Prefer `pnpm` scripts and the project helper functions in `lib/`.
	 - When generating code, include JSDoc and create tests for API routes.
	 - Avoid committing secrets; use `.env` and GitHub secrets for CI.

## GitHub issue templates

 - Bug report: `.github/ISSUE_TEMPLATE/bug_report.md`
 - Feature request: `.github/ISSUE_TEMPLATE/feature_request.md`

## Troubleshooting

 - If CI fails after a workflow change, revert and run steps locally matching the CI commands.
 - If tests fail due to DB state, regenerate migrations and reseed the test DB.

## Deployment

 - Deploy to Vercel (recommended) or your preferred host. Ensure environment variables in production match those used locally (`DATABASE_URL`, Supabase keys).

---

If you'd like, I can also:
 - add a Jest scaffold and one example API test,
 - add a CONTRIBUTING.md that enforces these checks locally, or
 - run the local `pnpm ci` and report failures.

Please tell me which follow-up you'd like next.
