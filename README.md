# SAMAALON

> **Minimalist Samal Island travel and accommodation discovery platform** — discover beaches, accommodations, rooms, amenities, maps, blogs, ratings, and reviews. Browse without an account; Google login unlocks favorites, reviews, profile, and booking via Facebook. No in-site reservations.

**Docs (English only):** start at [`docs/README.md`](./docs/README.md)

| Doc | Purpose |
|-----|---------|
| [01-prd.md](./docs/01-prd.md) | Goals, roles, flows, non-goals |
| [02-architecture.md](./docs/02-architecture.md) | Stack, architecture, structure |
| [03-database.md](./docs/03-database.md) | ERD + tables (no full schema yet) |
| [04-features.md](./docs/04-features.md) | Features & UX (text-only nav) |
| [05-auth.md](./docs/05-auth.md) | Auth & security |
| [06-admin.md](./docs/06-admin.md) | Admin dashboard |
| [07-roadmap.md](./docs/07-roadmap.md) | Phases 1-10 |

**Today:** docs-only planning. No code yet — see [docs/07-roadmap.md](./docs/07-roadmap.md) for build order.

## Development

```bash
npm install        # install deps and update package-lock.json
npm run db:generate
npm run dev
```

> **Lockfile rule:** Do not delete `package-lock.json`. After any `package.json` change, run `npm install` locally and commit the updated `package-lock.json`. CI uses `npm ci` (`ci.yml:27`) which requires the lockfile to be in sync — if it is missing or stale, CI fails with `Missing: @emnapi/* from lock file`.

**License:** MIT — see [LICENSE](./LICENSE)
