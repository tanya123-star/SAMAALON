# 03 — Database Design

**Status:** draft | **Last updated:** 2026-08-21 | **Source:** Spec §16, §13, §6, §8, §11 | **Constraint:** ERD + tables only, no full `schema.prisma` (per approved plan)

## 3.1 ERD (Mermaid)

```mermaid
erDiagram
    User ||--o{ Review : writes
    User ||--o{ FavoriteBeach : saves
    User ||--o{ FavoriteAccommodation : saves
    Beach ||--o{ BeachImage : has
    Beach ||--o{ BeachAmenity : has
    Beach ||--o{ Accommodation : contains
    Beach ||--o{ Review : receives
    Accommodation ||--o{ AccommodationImage : has
    Accommodation ||--o{ AccommodationAmenity : has
    Accommodation ||--o{ RoomType : has
    Accommodation ||--o{ Review : receives
    Accommodation ||--o{ FavoriteAccommodation : savedBy
    Beach ||--o{ FavoriteBeach : savedBy
    BlogPost ||--o{ BlogImage : has
    BlogCategory ||--o{ BlogPost : categorizes
    User {
        string id PK
        string email UK
        string name
        string image
        enum role USER_ADMIN
        datetime createdAt
    }
    Beach {
        string id PK
        string name UK
        string slug UK
        string location
        text description
        decimal entranceFee
        string openingHours
        string contactInfo
        decimal latitude
        decimal longitude
        string googleMapsUrl
    }
    Accommodation {
        string id PK
        string beachId FK
        string name
        string slug UK
        text description
        string priceRange
        string facebookUrl
        string contactInfo
        string checkInTime
        string checkOutTime
        int maxGuests
    }
    RoomType {
        string id PK
        string accommodationId FK
        string name
        text description
        decimal price
        int maxGuests
        string amenities
    }
    Review {
        string id PK
        string userId FK
        string beachId FK nullable
        string accommodationId FK nullable
        int rating 1_5
        text comment
        datetime createdAt
        datetime updatedAt
        string moderatedBy nullable
    }
    BlogPost {
        string id PK
        string categoryId FK nullable
        string title
        string slug UK
        text content
        string featuredImage
        string authorId FK
        datetime publishedAt nullable
        boolean published
    }
```

Rules: `Review` targets **Beach XOR Accommodation** (check constraint, enforced in Zod + DB). Single `ADMIN` role; favorites are join tables with composite PK `(userId, beachId)` / `(userId, accommodationId)`.

## 3.2 Tables

### User

| Column    | Type               | Constraints  | Notes         |
| --------- | ------------------ | ------------ | ------------- |
| id        | uuid/text          | PK, cuid     | Auth.js       |
| email     | varchar            | UK, not null | Google        |
| name      | varchar            |              |               |
| image     | varchar            |              | Google avatar |
| role      | enum `USER, ADMIN` | default USER | One admin     |
| createdAt | timestamp          |              |               |

### Beach

| Column        | Type          | Constraints            | Notes        |
| ------------- | ------------- | ---------------------- | ------------ |
| id            | uuid          | PK                     |              |
| name          | varchar       | UK                     | §4           |
| slug          | varchar       | UK, indexed            |              |
| location      | varchar       | indexed                | Filter §12   |
| description   | text          |                        |              |
| entranceFee   | decimal       |                        | Filter §12   |
| openingHours  | varchar       |                        |              |
| contactInfo   | varchar       |                        |              |
| latitude      | decimal(10,7) |                        | §13          |
| longitude     | decimal(10,7) |                        | §13          |
| googleMapsUrl | varchar       |                        | §13          |
| avgRating     | decimal(2,1)  | generated/materialized | From Reviews |
| reviewCount   | int           |                        |              |

### BeachImage

| Column    | Type                 | Notes |
| --------- | -------------------- | ----- |
| id        | PK                   |       |
| beachId   | FK → Beach, cascade  |       |
| url       | varchar (Cloudinary) |       |
| alt       | varchar              |       |
| sortOrder | int                  |       |

### BeachAmenity (or M2M `Amenity` table)

Option A (simple): `Beach.amenities` as string array / JSON. Option B (normalized): `Amenity` + `BeachAmenity` join. Recommend **B** for filtering (§12).

| Column | Type                         |
| ------ | ---------------------------- |
| id     | PK                           |
| name   | UK (Swimming, Cottages, ...) |
| icon   | varchar                      |

### Accommodation

| Column       | Type    | Constraints | Notes      |
| ------------ | ------- | ----------- | ---------- |
| id           | uuid    | PK          | §5         |
| beachId      | uuid    | FK → Beach  |            |
| name         | varchar |             |            |
| slug         | varchar | UK          |            |
| description  | text    |             |            |
| priceRange   | varchar |             | Filter §12 |
| facebookUrl  | varchar | not null    | §6 booking |
| contactInfo  | varchar |             |            |
| checkInTime  | varchar |             |            |
| checkOutTime | varchar |             |            |
| maxGuests    | int     |             | Filter     |
| avgRating    | decimal |             |            |
| reviewCount  | int     |             |            |

### AccommodationImage / AccommodationAmenity — same pattern as Beach.

### RoomType

| Column          | Type                                     | Notes |
| --------------- | ---------------------------------------- | ----- |
| id              | PK                                       | §5    |
| accommodationId | FK → Accommodation                       |       |
| name            | varchar (Standard/Family/Deluxe/Cottage) |       |
| description     | text                                     |       |
| price           | decimal                                  |       |
| maxGuests       | int                                      |       |
| amenities       | text/JSON                                |       |
| photos          | via RoomTypeImage                        |       |

### Review

| Column          | Type          | Constraints        | Notes                    |
| --------------- | ------------- | ------------------ | ------------------------ |
| id              | uuid          | PK                 | §8                       |
| userId          | uuid          | FK → User          |                          |
| beachId         | uuid nullable | FK → Beach         | XOR with accommodationId |
| accommodationId | uuid nullable | FK → Accommodation |                          |
| rating          | int 1-5       | check              |                          |
| comment         | text          |                    |                          |
| createdAt       | timestamp     |                    |                          |
| updatedAt       | timestamp     |                    |                          |

Indexes: `(beachId, createdAt)`, `(accommodationId, createdAt)`, `(userId)`.

### FavoriteBeach / FavoriteAccommodation

| Column                    | Type      | Notes   |
| ------------------------- | --------- | ------- |
| userId                    | FK → User | PK part |
| beachId / accommodationId | FK        | PK part |
| createdAt                 | timestamp |         |

### BlogCategory / BlogPost / BlogImage

| Column                                                                              | Type    | Notes    |
| ----------------------------------------------------------------------------------- | ------- | -------- |
| BlogCategory.id/name/slug                                                           |         | §11      |
| BlogPost.title/slug/content/featuredImage/categoryId/authorId/published/publishedAt | slug UK | CRUD §11 |
| BlogImage.blogPostId/url                                                            | FK      |          |

## 3.3 Relationships Summary (§16)

```
User ──< Review
User ──< FavoriteBeach >── Beach
User ──< FavoriteAccommodation >── Accommodation
Beach ──< Accommodation ──< RoomType
Beach ──< Review ; Accommodation ──< Review
Beach ──< BeachImage ; Accommodation ──< AccommodationImage
BlogPost ──< BlogImage ; BlogCategory ──< BlogPost
```

## 3.4 Indexes & Filters (§12)

- `Beach(location, entranceFee, avgRating)`, `GIN` on amenities if array.
- `Accommodation(priceRange, maxGuests, beachId, avgRating)`.
- Full-text search on `Beach.name, Accommodation.name, BlogPost.title/content` (Postgres `tsvector` later).

## 3.5 Notes for Phase 2

- Implement `schema.prisma` from these tables; run `prisma migrate`.
- Enforce Review XOR in Zod + DB check: `(beachId IS NOT NULL) != (accommodationId IS NOT NULL)`.
- Seed: initial blogs (§11) + sample beaches/accommodations.
