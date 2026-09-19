<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Seed Data and Mock Data Rules

> Core project rule: "Seed data creates the application's baseline development content. It must not simulate, overwrite, or control real user-generated data."
>
> Seed-owned content and user-owned content are separate data ownership categories. A seed operation must never assume that all records in a table are safe to modify. Preserve this separation unless the user explicitly requests a different behavior.

### 1. Data ownership categories

| Category                 | What it is                                                           | SAMAALON examples                                                                               | Where it lives                                       |
| ------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Prisma seed data         | Development/demo baseline content created by `prisma/seed.ts`        | `Amenity`, `Beach`, `Accommodation`, `RoomType`, `BlogCategory`, `BlogPost`, join/image records | `prisma/seed.ts` (manual `db:seed`)                  |
| Development/mock/fixture | Temporary UI/test data that is never written by the seed script      | `mockBeaches`, `mockAccommodations`, `testReviews`, `fixtureUsers`                              | `src/fixtures/`, `src/mocks/`, `__tests__/fixtures/` |
| Real user-generated data | Records created by users, Google auth, or admins through the app     | `User`, `Review`, `FavoriteBeach`, `FavoriteAccommodation`, admin-authored content              | Production/development database                      |
| Production data          | Live database contents; must remain valid even if the seed never ran | All live rows in every model                                                                    | Hosted PostgreSQL                                    |     |

### 2. Seed Data Rules

1. **Seed data is development/demo baseline only.** It exists for local development, testing, demonstrations, and initial development environments. It must NOT be required for the application to build or deploy.
2. **Never auto-run the seed script.** Do not wire `tsx prisma/seed.ts` (or `prisma db seed`) into `npm install` (`postinstall`), `npm run build`, Vercel build/deploy, or production startup. In this repo `db:seed` in `package.json` is manual-only — keep it that way. The `seed` key in `prisma.config.ts` under `migrations` is a standard Prisma hook, not an auto-deploy step.
3. **Never reset the database as part of normal seeding.** Do not introduce or use `prisma migrate reset`, database reset commands, dropping tables/databases, or `deleteMany()` as a general seed strategy, unless explicitly requested and approved for a controlled development/test operation.
4. **Seed scripts must be idempotent.** Running the seed multiple times must not create duplicates. Prefer `upsert()` with stable unique identifiers (`slug`, `name`, compound keys such as `beachId_amenityId`). Expected behavior: first run creates baseline records; second run keeps/updates the same records; repeated runs create no duplicates.
5. **Never overwrite real user-generated data.** Seed scripts must NOT modify or delete user accounts, Google-authenticated users, reviews, ratings, favorites, bookings/reservations, user-created content, or admin-created content, unless the specific record is explicitly identified as a seed-owned record.
6. **Seed-owned records must be identifiable.** Where practical, use stable IDs, stable slugs, or unique keys (e.g. beach/accommodation/blog `slug`, amenity `name`) so agents can distinguish seed-owned baseline records from user-created records.
7. **Do not create fake user activity in the normal seed.** Do not seed fake Google users, reviews, ratings, favorites, bookings, or reservations in `prisma/seed.ts`. If automated tests need such data, use dedicated fixtures/mock data instead.
8. **Never include secrets in seed data.** No API keys, OAuth client secrets, `AUTH_SECRET`, database passwords, private tokens, real user passwords, credentials, or private personal information. Use environment variables for configuration and secrets.
9. **Avoid fabricated sensitive or real-world personal information.** Do not invent realistic personal identities, phone numbers, addresses, payment information, passwords, or private contact information for fake users.
10. **Seed baseline content only when appropriate.** Acceptable SAMAALON baseline seed content: beaches, accommodations, room types, blog posts, blog categories, amenities, and other static/content records explicitly designated as development baseline data. User-generated records stay outside the normal seed.

### 3. Mock / Fixture Data Rules

1. **Separate mock/fixture data from Prisma seed data.** If a component, test, or development feature needs temporary mock data, put it in dedicated files such as `src/fixtures/`, `src/mocks/`, or `__tests__/fixtures/`. Do not modify `prisma/seed.ts` just because a UI component needs test data.
2. **Mock data must never be mistaken for production data.** Use clear names such as `mockBeaches`, `mockAccommodations`, `testReviews`, `fixtureUsers`. Avoid ambiguous names such as `realData`, `productionData`, or bare `users`.
3. **No hidden production fallback to mock data.** Do not silently fall back from a failed database/API request to fake data in production UI. A missing database record must not be disguised as real content using mock data.
4. **Tests may use mock data.** Automated tests may create controlled fake records when required. Keep test data isolated from normal seed data and production data.

### 4. Production Data Rules

1. **Production data must never depend on the seed script.** The application must remain valid if the seed script has never been executed.
2. **Never run destructive seed operations against production.** Do not introduce commands that automatically reset production databases, delete production records, replace production records with demo records, or recreate demo users.
3. **Production deployments must not automatically seed demo data.** Vercel builds/deployments must not automatically populate the database with development/demo content.
4. **Explicit production baseline initialization is allowed only as a deliberate operation.**
   If the project needs baseline SAMAALON content in the production database, it may be inserted through an explicitly approved production seed operation. This operation must be manual, idempotent, non-destructive, and limited to seed-owned baseline records. It must never run automatically as part of a Vercel build or deployment.
5. **Production baseline content must be seed-owned.**
   Before running a production seed, confirm which records are owned by the seed. The operation must not modify or delete existing user-generated, admin-created, or authentication-related records.

### 5. Admin Data Rules

- **Do not automatically overwrite the admin account.** Admin provisioning in this repo is handled at sign-in via `ADMIN_EMAIL` in `lib/auth.ts`, separate from content seeding. The seed must not blindly recreate or overwrite that account. Keep authentication/admin provisioning separate from ordinary content seeding unless explicitly designed otherwise.

### 6. Change Safety

1. **Inspect existing seed behavior before modifying it.** Before changing `prisma/seed.ts`, determine: what records it currently creates; whether it uses `deleteMany()`; whether it uses `upsert()`; whether records have stable identifiers; whether user-generated records could be affected; whether the seed runs automatically anywhere (`package.json` scripts, `prisma.config.ts`, Vercel config, startup code).
2. **Make the smallest change required.** Do not rewrite the entire seed file unnecessarily. Preserve existing valid seed data unless the requested task explicitly requires changing it.
3. **Do not modify database migrations to solve a seed-data problem unless necessary.** Seed-data changes and schema/migration changes are separate concerns.

### 7. Required Agent Workflow for seed/mock changes

- **Step 1 — Inspect.** Read `AGENTS.md`, `prisma/seed.ts`, `package.json`, the relevant Prisma schema/models, and relevant mock/fixture files.
- **Step 2 — Plan.** Explain what seed/mock data currently exists, what is unsafe or inconsistent, what files need to change, what will NOT be changed, and how existing data will be protected.
- **Step 3 — STOP.** Wait for user approval before editing.
- **Step 4 — Implement.** Make only the approved changes.
- **Step 5 — Validate.** Run appropriate checks such as TypeScript validation, lint, seed validation in a safe development database, and tests where applicable. Never run destructive database commands without explicit approval.
- **Step 6 — Report.** Clearly report files changed, seed records affected, whether existing user-generated data is protected, validation performed, and any remaining warnings or risks.
