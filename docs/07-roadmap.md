# 07 — Roadmap (Development Phases)

**Status:** draft | **Last updated:** 2026-08-21 | **Source:** Spec §22, §19-21

Phases are ordered; each lists exit criteria. No code today — this is the execution order when build resumes.

## Phase 1 — Foundation

Stack: Next.js + TS, Tailwind + shadcn/ui, Prisma + PostgreSQL + Docker, env config. Tooling: ESLint, Prettier, `docker-compose.yml`, `.env.example`.

*Exit:* `npm run dev` + `docker compose up` works; DB connects; shadcn renders.

## Phase 2 — Database (§16)

Build ERD from `03-database.md` into `prisma/schema.prisma` (Beach, Accommodation, RoomType, Review, Favorite*, BlogPost/Category, images/amenities). Migrate + seed (initial 5 blogs §11, sample beaches).

*Exit:* `prisma migrate dev` + seed succeeds; `prisma studio` shows relations.

## Phase 3 — Public Website (§14, §4-5, §11-13)

Home, Beaches list/details, Accommodation details, Blog list/article, About Samal, Search/Filters, Maps link. Server Components + loading/empty/error states.

*Exit:* Unauthenticated browse/search/filter works; maps links correct.

## Phase 4 — Authentication (§7, 05-auth.md)

Auth.js + Google OAuth, sessions, profile, protected favorites/Book Now/reviews, ADMIN guard (server-side, §20).

*Exit:* Google login on Vercel; non-admin 403 on admin routes; profile shows Google data.

## Phase 5 — Reviews & Favorites (§8, §9)

Beach + Accommodation ratings/reviews (Option C), favorites (both types), moderation. Rate limiting + Zod.

*Exit:* Auth user can create 1 review/target + toggle favorites; admin can delete reviews; avg ratings update.

## Phase 6 — Booking Redirect (§6)

`Book Now → auth check → Google if needed → facebookUrl (external)`. Store `facebookUrl` per accommodation.

*Exit:* Book Now after auth opens correct Facebook URL in new tab; unauthenticated shows login CTA; no reservation state stored.

## Phase 7 — Admin Dashboard (§15, 06-admin.md)

CRUD for beaches, accommodations, room types, blog posts, reviews. Photos via placeholder, then Cloudinary.

*Exit:* Admin full CRUD via UI; non-admin blocked server-side.

## Phase 8 — Images & Maps

Cloudinary uploads (beach/accommodation/room/blog), Google Maps link/embed with lat/lng + `googleMapsUrl`.

*Exit:* Uploads persist; maps links valid; images optimized.

## Phase 9 — UI/UX Polish (§22)

Minimalist responsive design, accessibility, skeletons, empty/error states, search UX, nav polish.

*Exit:* Mobile responsive; a11y pass; no layout shifts.

## Phase 10 — Testing & Deployment

Test: auth, RBAC, CRUD, reviews, favorites, search, filters, Facebook redirects, security (§20), mobile. Deploy: GitHub → Vercel + Neon + Cloudinary.

*Exit:* Prod deploy green; smoke tests pass; HTTPS; env secrets secure.

## Dependencies

`P1 → P2 → P3 → P4 → P5/P6 (parallel) → P7 → P8 → P9 → P10`. P3 needs P2; P5/P6 need P4; P8 needs P7.

## Non-Goals Guard (§19)

If asked to add payments, in-site reservations, availability calendars, owner dashboards mid-build, defer to post-v1 — keep scope to Final Scope.

## Today (docs-only) Done

- `docs/` 7 files written; `README.md` replaced per plan. Next step: review docs, then start Phase 1.
