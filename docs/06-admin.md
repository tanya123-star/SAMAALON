# 06 — Admin Dashboard

**Status:** draft | **Last updated:** 2026-08-21 | **Source:** Spec §15, §4-5, §11, §8, §20

## 6.1 Scope

Separate from public site at `app/admin/*`. Single `ADMIN` user (server-verified per 05-auth.md). No owner/staff accounts in v1.

## 6.2 Navigation

```
ADMIN DASHBOARD
├── Dashboard (overview)
├── Beaches (view/add/edit/delete, photos, amenities)
├── Accommodations (view/add/edit/delete, photos, amenities, facebookUrl, check-in/out)
├── Room Types (per accommodation CRUD)
├── Blog Posts (CRUD + publish/unpublish + categories)
└── Reviews (list, filter by beach/accommodation, delete/moderate)
```

Later: Blog Categories, Users list (read-only), Favorites metrics.

## 6.3 Dashboard Overview

Metrics: total beaches, total accommodations, total users, total reviews, avg ratings, total blog posts, published vs draft, recent reviews. Cards + simple charts (shadcn/ui). Data via Prisma aggregates.

## 6.4 CRUD — Beaches

- List: table with name, location, fee, rating, accommodations count, actions.
- Add/Edit: Zod form — name, slug, location, description, entranceFee, openingHours, contactInfo, lat/lng + googleMapsUrl, amenities (multi-select), photos (Cloudinary upload).
- Delete: confirm + cascade check (block if accommodations exist or cascade with warning).

## 6.5 CRUD — Accommodations & Room Types

- Accommodations scoped to a Beach (select Beach). Fields: name, slug, description, priceRange, facebookUrl (URL validation), contact, amenities, checkIn/Out, maxGuests, photos.
- Room Types: nested under Accommodation — name, description, price, maxGuests, amenities, photos. Table per accommodation.

## 6.6 Blog Posts

- CRUD: title, slug, category, featuredImage, content (rich text/markdown), images, published boolean, publishedAt.
- Categories: separate CRUD; blog post selects one.
- Publish/unpublish toggle; draft not visible publicly.

## 6.7 Reviews Moderation

- List with filters: beach/accommodation, rating, date. Columns: user, target, rating, comment snippet, date.
- Actions: delete (with reason log), optional hide. Average ratings recalc after delete.
- No edit by admin (delete only).

## 6.8 Access Control

- All `app/admin/*` pages + `app/api/admin/*` check `role === 'ADMIN'` server-side; middleware redirects non-admin.
- Forms use Server Actions with Zod + Prisma; errors shown inline.

## 6.9 Phase 7 Exit Criteria

- Admin can full CRUD beaches/accommodations/roomTypes/blogs via UI.
- Non-admin gets 403 on admin routes (manual + automated test).
- Photos upload to Cloudinary and persist URLs.
```


## 6.10 Future (out of scope v1)

No staff roles, no analytics export, no bulk import — add only if needed post-launch.
