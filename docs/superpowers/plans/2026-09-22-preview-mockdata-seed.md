# Preview Mockdata Seed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable manual one-time seeding of Supabase preview DB so Vercel preview shows the 10-beach demo content, without touching production.

**Architecture:** Reuse existing `prisma/seed.ts` unchanged logic; add testable env-guard + `db:seed:preview` script. Seeding runs locally outside Vercel; Vercel Preview only reads via `DATABASE_URL` preview env.

**Tech Stack:** Prisma 7 + `@prisma/adapter-pg` (`PrismaPg`), Supabase Postgres (direct `:5432` for migrate/seed, pooler `:6543` for runtime), Next.js 16 on Vercel, `tsx`, `vitest`.

## Global Constraints

* Never auto-run seed in `postinstall`, `build`, Vercel build/deploy, or app startup — `db:seed` stays manual-only (`AGENTS.md §2.2`).
* Seed stays idempotent via `upsert()` on `slug`/`name` — no `deleteMany()`, no `migrate reset` (`AGENTS.md §2.3-2.4`).
* Seed only touches seed-owned `Amenity, Beach, Accommodation, RoomType, BlogCategory, BlogPost` + joins/images — never `User, Review, Favorite*` (`AGENTS.md §2.5,2.7`).
* No secrets committed — preview URL lives in local `.env` as `PREVIEW_DATABASE_URL` + Vercel Dashboard preview env, never in chat/commit.
* Production stays empty — preview seed must abort if URL looks like prod unless `--allow-prod` passed.
* `.env.example` must contain only placeholders (`<ENCODED-PW>`, `<preview-ref>`), never a real password.

---

## File Structure

* Modify: `SAMAALON/prisma/seed.ts:1-8` — import guard, call `resolveSeedUrl()` before `main()`.
* Create: `SAMAALON/lib/seedEnv.ts` — pure `resolveSeedUrl()` + `assertSafeSeedEnv()` for testability.
* Create: `SAMAALON/lib/__tests__/seedEnv.test.ts` — vitest coverage for guard.
* Modify: `SAMAALON/package.json:19` — add `db:seed:preview`.
* Modify: `SAMAALON/.env.example:1-9` — document `PREVIEW_DATABASE_URL` with placeholders only; sanitize any real credential to placeholder before commit.

---

### Task 1: Seed env-guard (testable)

**Files:**
- Create: `SAMAALON/lib/seedEnv.ts`
- Test: `SAMAALON/lib/__tests__/seedEnv.test.ts`

**Interfaces:**
- Consumes: `process.env.DATABASE_URL`, `process.env.PREVIEW_DATABASE_URL`
- Produces: `resolveSeedUrl(argv: string[]): string`, `assertSafeSeedEnv(url: string, argv: string[]): void` — Task 2 imports both.

- [ ] **Step 1: Write the failing test**

```ts
// SAMAALON/lib/__tests__/seedEnv.test.ts
import { describe, it, expect } from "vitest"
import { assertSafeSeedEnv } from "../seedEnv"

describe("assertSafeSeedEnv", () => {
  it("aborts when URL contains prod marker without --allow-prod", () => {
    expect(() =>
      assertSafeSeedEnv("postgresql://postgres@db.nnczxxdmmzpqaptinxsw.supabase.co:5432/postgres", [])
    ).toThrow(/preview/i)
  })
  it("passes for preview URL", () => {
    expect(() =>
      assertSafeSeedEnv("postgresql://postgres@db.preview-xyz.supabase.co:5432/postgres", ["--preview"])
    ).not.toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/__tests__/seedEnv.test.ts`
Expected: FAIL with "Cannot find module '../seedEnv'"

- [ ] **Step 3: Write minimal implementation**

```ts
// SAMAALON/lib/seedEnv.ts
export function assertSafeSeedEnv(url: string, argv: string[]): void {
  if (!url) throw new Error("Missing DATABASE_URL / PREVIEW_DATABASE_URL for seed. Set PREVIEW_DATABASE_URL locally, never commit it.")
  const allowProd = argv.includes("--allow-prod")
  const looksProd = url.includes("nnczxxdmmzpqaptinxsw")
  if (looksProd && !allowProd) {
    throw new Error("Refusing to seed what looks like PROD. Use PREVIEW_DATABASE_URL or pass --allow-prod for deliberate prod baseline.")
  }
}
export function resolveSeedUrl(argv: string[]): string {
  const isPreview = argv.includes("--preview")
  const url = isPreview ? process.env.PREVIEW_DATABASE_URL : process.env.DATABASE_URL
  if (!url) throw new Error(isPreview ? "Missing PREVIEW_DATABASE_URL" : "Missing DATABASE_URL")
  assertSafeSeedEnv(url, argv)
  return url
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/__tests__/seedEnv.test.ts`
Expected: PASS 2 tests

- [ ] **Step 5: Commit**

```bash
git add SAMAALON/lib/seedEnv.ts SAMAALON/lib/__tests__/seedEnv.test.ts
git commit -m "feat: add preview seed env guard"
```

### Task 2: Wire guard + preview script

**Files:**
- Modify: `SAMAALON/prisma/seed.ts:1-8`
- Modify: `SAMAALON/package.json:19`
- Test: `SAMAALON/lib/__tests__/seedEnv.test.ts` (existing, must still pass)

**Interfaces:**
- Consumes: `resolveSeedUrl()` from Task 1
- Produces: `npm run db:seed:preview` usable by Task 3 runbook.

- [ ] **Step 1: Read current files first (do not overwrite blindly)**

Read `SAMAALON/prisma/seed.ts:1-10`, `SAMAALON/package.json:9-23`, `SAMAALON/.env.example:1-10` before editing. The working tree `.env.example` may contain a real credential — never commit it; sanitize to placeholders.

- [ ] **Step 2: Wire guard into seed (show diff)**

```ts
// SAMAALON/prisma/seed.ts:1-8 — replace
import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { resolveSeedUrl } from "../lib/seedEnv"

const seedUrl = resolveSeedUrl(process.argv)
const adapter = new PrismaPg({ connectionString: seedUrl })
const prisma = new PrismaClient({ adapter })
```

No other `seed.ts` logic changes — preserves idempotent upserts.

- [ ] **Step 3: Add preview script**

```json
// SAMAALON/package.json — add alongside db:seed, keep build as "prisma generate && next build" with no seed
"db:seed": "tsx prisma/seed.ts",
"db:seed:preview": "tsx prisma/seed.ts --preview",
```

Verify: `npm run | grep db:seed` shows both; `npm run build` still has no seed.

- [ ] **Step 4: Document preview env (placeholders only)**

```
// SAMAALON/.env.example — append, no real secret. If current file contains a real password, replace DATABASE_URL with placeholder first:
PREVIEW_DATABASE_URL="postgresql://postgres:<ENCODED-PW>@db.<preview-ref>.supabase.co:5432/postgres?schema=public"
```

- [ ] **Step 5: Validate**

Run: `npx tsc --noEmit` Expected: PASS
Run: `npx eslint lib/seedEnv.ts prisma/seed.ts` Expected: PASS
Run: `npx vitest run lib/__tests__/seedEnv.test.ts` Expected: PASS

- [ ] **Step 6: Commit (never commit real credentials)**

```bash
git diff -- .env.example
git add SAMAALON/prisma/seed.ts SAMAALON/package.json SAMAALON/.env.example SAMAALON/lib/__tests__/seedEnv.test.ts
git commit -m "feat: wire preview seed guard and script"
```

If `git diff` shows a real password, sanitize first and do not commit the secret.

### Task 3: Preview runbook + verify (manual, no code)

**Files:** none — user-side ops. Reference: `SAMAALON/verify-production-data.ts:6-30`, `docs/superpowers/plans/2026-09-10-supabase-database.md:80-92`.

- [ ] **Step 1: Create Supabase preview project** (dashboard) — record `preview-ref`, set Vercel Preview env `DATABASE_URL` to pooler URI.
- [ ] **Step 2: Migrate preview**

```bash
PREVIEW_DATABASE_URL="postgresql://postgres:<ENCODED-PW>@db.<preview-ref>.supabase.co:5432/postgres?schema=public" npx prisma migrate deploy
```

Expected: `All migrations have been successfully applied.`

- [ ] **Step 3: Seed preview (local)**

```bash
PREVIEW_DATABASE_URL="postgresql://postgres:<ENCODED-PW>@db.<preview-ref>.supabase.co:5432/postgres?schema=public" npm run db:seed:preview
```

Expected: `Seed completed: 10 Samal beaches...`

- [ ] **Step 4: Verify counts against preview**

```bash
PREVIEW_DATABASE_URL="..." npx tsx verify-production-data.ts
```

Expected: `beaches:10, amenities:12, blogPosts:5`, `users:0, reviews:0`.

- [ ] **Step 5: Smoke Vercel preview** — open preview URL `/`, `/beaches`, `/blog`; confirm 10 beaches render, no prod data touched.
