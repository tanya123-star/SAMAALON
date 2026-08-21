# Samaalon Docs Index

> **Samaalon is a minimalist Samal Island travel and accommodation discovery platform** that lets visitors explore beaches, accommodations, room types, amenities, travel guides, maps, ratings, and reviews. Browsing is open; Google-authenticated users can save favorites, submit ratings/reviews, manage profiles, and access accommodation booking links via Facebook. No in-site reservations or payments. — Final Scope baseline.

All docs are English only, markdown in `docs/` (per approved plan). Text-only navigation, ERD/tables only (no full `schema.prisma` yet).

## Reading Order

| # | File | Purpose | Spec § |
|---|------|---------|--------|
| 1 | [01-prd.md](./01-prd.md) | Product requirements, roles, flows, non-goals | §1-3, §19-20 |
| 2 | [07-roadmap.md](./07-roadmap.md) | Phases 1-10 with exit criteria | §22 |
| 3 | [03-database.md](./03-database.md) | Entities, ERD (mermaid), tables | §16, §13, §6 |
| 4 | [02-architecture.md](./02-architecture.md) | Stack, high-level architecture, project structure | §17, §18, §21 |
| 5 | [05-auth.md](./05-auth.md) | Google OAuth, sessions, RBAC | §7, §20 |
| 6 | [06-admin.md](./06-admin.md) | Admin dashboard CRUD/moderation | §15 |
| 7 | [04-features.md](./04-features.md) | Beach/accommodation/booking/reviews/blog/search/maps UX | §4-6, §8-14 |

Start with `01-prd.md` and `07-roadmap.md`; `03-database.md` blocks most feature work.

## Conventions

- **Frontmatter:** each doc has `title`/`status`/`last-updated` in the header.
- **Diagrams:** Mermaid for flows/ERD (rendered on GitHub).
- **Paths:** absolute from repo root, e.g., `app/(public)/beaches/page.tsx`.
- **Status:** `draft` until Phase 1 kickoff; update per phase.

## Glossary

| Term | Meaning |
|------|---------|
| Beach | Geographic destination with entrance fee, amenities, photos, reviews |
| Accommodation | Lodging belonging to one Beach (e.g., Paradise Resort → Paradise Beach) |
| Room Type | Variant within an Accommodation (Standard/Family/Deluxe, Cottage) |
| Book Now | Auth-gated external redirect to `Accommodation.facebookUrl` |
| Favorite | User-saved Beach or Accommodation (auth required) |
| Review | 1-5 star + comment targeting Beach OR Accommodation (auth required) |
| Admin | Single `ADMIN` role; server-verified, not UI-only |
| Blog | Travel guide post with category, publish state |

## Quick Links

- Root [README.md](../README.md) — project entry + docs table
- [LICENSE](../LICENSE) — MIT
