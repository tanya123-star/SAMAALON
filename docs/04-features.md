# 04 — Features & UX Structure

**Status:** draft | **Last updated:** 2026-08-21 | **Source:** Spec §4-6, §8-14 | **Nav:** text-only (per approved plan)

## 4.1 Site Navigation (§14)

Public: `SAMAALON | Home | Beaches | Blog | About Samal | Login`. Minimalist. Protected links (Favorites/Profile/Book Now) show login CTA when unauthenticated.

```
Home: Hero → Featured Beaches → Popular Accommodations → Things To Do → Latest Blog Posts → About Samal
Beaches: Search + Filters → Beach Cards → Beach Details
Blog: Categories → Blog Cards → Article
About Samal: geography/culture/attractions/how to get there
```

All pages need loading/empty/error states (§22 P9), responsive, accessible.

## 4.2 Beach Module (§4)

**Fields:** name, location, description, entrance fee, opening hours, contact, lat/lng + googleMapsUrl, photos, amenities (Swimming, Cottages, Restrooms, Parking, Food, Wi-Fi, Water activities), accommodations (1:N), reviews (avg + count).

**Pages:** `app/(public)/beaches/page.tsx` (search + filters → cards) → `app/(public)/beaches/[slug]/page.tsx` (photos, info, amenities, map link, accommodations list, reviews). Card shows name, location, fee, rating, cover photo.

**Filters (§12):** location, entrance fee (range), amenities (multi-select), rating (≥).

## 4.3 Accommodation Module (§5)

Belongs to one Beach.

```
Beach (e.g., Paradise Beach)
├── Accommodation (Paradise Resort) ── RoomTypes (Standard/Family/Deluxe)
└── Accommodation (Ocean View Resort) ── RoomTypes (Cottage/Family)
```

**Fields:** name, description, priceRange, facebookUrl (required, §6), contact, photos, amenities, checkIn/Out, maxGuests, roomTypes, reviews/avgRating.

**Pages:** `app/(public)/accommodations/[slug]/page.tsx` — photos, rooms, prices, amenities, check-in/out, reviews, **Book Now** button.

### Room Types (§5)

Fields: name, description, price, maxGuests, amenities, photos. Listed within accommodation details; each accommodation can have many.

## 4.4 Booking Redirect (§6)

No reservation system. Flow: `Book Now → auth check → Google OAuth if needed → redirect to Accommodation.facebookUrl → external Messenger reservation`.

- `facebookUrl` managed by admin, validated as URL (Zod).
- Button disabled with “Login to book” CTA when unauthenticated; after login, `target="_blank" rel="noopener"`.
- No booking state stored; no calendar/payment.

## 4.5 Reviews & Ratings (§8, Option C)

Both Beach and Accommodation have: avg rating (1-5), count, star breakdown, comment list. Review fields: userId, rating 1-5, comment, target Beach XOR Accommodation, createdAt/updatedAt. Auth required; one review per user per target (upsert). Admin can delete/moderate. Endpoint: `app/api/reviews/*`.

Display: `⭐⭐⭐⭐⭐ 4.7 (125 Reviews)` pattern.

## 4.6 Favorites (§9)

Auth only. Two sets: FavoriteBeach, FavoriteAccommodation. UI: heart toggle on cards/details + Profile lists. Endpoints: `app/api/favorites/*`. No favorites for unauthenticated (prompt login).

## 4.7 User Profile (§10)

Shows Google image/name/email, favorite beaches/accommodations, reviews written. Source is Auth.js session + DB. No password management.

## 4.8 Blog System (§11)

Initial posts: 10 Best Beaches, Things To Do, How to Get There, Best Accommodations, Travel Guide. Fields: title, slug, featuredImage, content, category, author/admin, publishedAt, published boolean, images. Admin CRUD: create/read/update/delete/publish/unpublish. Public: `app/(public)/blog/page.tsx` (categories → cards) → `app/(public)/blog/[slug]/page.tsx`.

## 4.9 Search & Filtering (§12)

Global search across: beach names, accommodation names, locations, blog posts. Filters:

- Beach: location, entrance fee, amenities, rating.
- Accommodation: price range, guests, amenities, rating, beach.
  Implement via query params (`?q=&location=&amenities=&rating=`) + Prisma `where`; later Postgres full-text.

## 4.10 Maps (§13)

Per Beach: `latitude`, `longitude`, `googleMapsUrl`. Detail page shows “📍 Location” + “[View on Google Maps]” link. Optional future: embedded Google Maps with `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

## 4.11 UX States (Phase 9)

Each list/detail needs: loading skeleton, empty (“No beaches match filters”), error (“Failed to load, retry”), and auth CTA (“Login to favorite/review/book”).

## 4.12 Routes Summary (planned)

```
(public)  /, /beaches, /beaches/[slug], /accommodations/[slug], /blog, /blog/[slug], /about
(auth)    /profile, /favorites
(admin)   /admin/* (see 06-admin.md)
(api)     /api/reviews, /api/favorites, /api/search
```
