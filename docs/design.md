# Design & UX Specification — Samaalon

**Status:** draft | **Last updated:** 2026-08-22 | **Target Aesthetic:** Minimalist Tropical Editorial | **Scope:** UI/UX, Scrolling Strategy, Samal Beach Research, Page Layouts & Component Design

---

## 1. Design Aesthetics & Visual Tokens

Samaalon is designed as a **premium minimalist tropical travel discovery platform** for Samal Island (Island Garden City of Samal, Davao del Norte, Philippines). It avoids cluttered booking widgets and excessive gradients, favoring an editorial magazine look with generous whitespace, high-contrast imagery, and subtle micro-animations.

### 1.1 Color Palette

```
[ Light Theme / Default ]
- Surface Background:     #FAF8F5 (Warm Sand Off-White)
- Card / Container:       #FFFFFF (Pure White)
- Primary Text:           #1C2A28 (Deep Slate Charcoal)
- Muted / Body Secondary: #5A6B68 (Palm Olive Grey)
- Primary Accent:         #2D6A4F (Tropical Seafoam Green)
- Secondary Accent:       #1D3557 (Deep Lagoon Blue)
- Highlight / Warm:       #E07A5F (Sunset Terracotta)
- Subdued Borders:        rgba(28, 42, 40, 0.08)

[ Dark Mode (Optional Toggle) ]
- Surface Background:     #0E1817 (Deep Marine Dark Slate)
- Card / Container:       #152321 (Dark Palm Emerald)
- Primary Text:           #F4F6F5 (Soft Warm Pearl)
- Accent:                 #52B788 (Emerald Leaf)
```

### 1.2 Typography Hierarchy

- **Display & Section Titles:** Serif — `Playfair Display` or `Cormorant Garamond` (Font weights: 500, 600, 700 italic/regular).
- **Interface & Body Text:** Sans-Serif — `Plus Jakarta Sans` or `Inter` (Font weights: 400, 500, 600).
- **Metrics & Captions:** Monospace / Tracking-wide Sans — `JetBrains Mono` or `Plus Jakarta Sans` with `uppercase tracking-widest`.

---

## 2. Interactive Scrolling Strategy ("Storytelling Scroll")

Samaalon incorporates a scroll-driven user journey that feels fluid and responsive without degrading performance:

```
+-----------------------------------------------------------------------+
| 1. Parallax Hero Storyteller                                          |
|    - Scroll scales hero imagery gently (1.0 -> 1.08)                  |
|    - Differential speed for text overlay (0.5x)                       |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| 2. Scroll-Docking Sticky Filter Bar                                   |
|    - Filters dock smoothly to header with frosted glass blur           |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| 3. Horizontal Snap Galleries                                          |
|    - Mouse drag / touch swipe horizontal scroll for room types & cards|
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| 4. Staggered Entrance Reveal                                          |
|    - Cards animate upwards into view on scroll (translateY 24px -> 0) |
+-----------------------------------------------------------------------+
```

### Motion Specs
- **Scroll Triggers:** `IntersectionObserver` / CSS `scroll-timeline` / Framer Motion.
- **Card Hover:** `transform: translateY(-4px)`, `box-shadow: 0 12px 32px -8px rgba(0,0,0,0.08)`, transition time `300ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Page Transitions:** Fade in/out with 200ms duration.

---

## 3. Researched Samal Island Content & Descriptions

Realistic sample data based on popular Samal Island destinations for seeding and realistic UI mockups:

### Top 10 Popular Beaches & Resorts

1. **Paradise Island Park & Beach Resort**
   - **District:** Babak District
   - **Entrance Fee:** ₱250 – ₱350
   - **Opening Hours:** 6:00 AM – 5:00 PM
   - **Contact:** +63 82 233 0251 | info@paradiseisland.ph
   - **Google Maps:** `https://maps.google.com/?q=Paradise+Island+Samal`
   - **Description:** Samal's premier accessible paradise, featuring manicured white sand shorelines, serene gardens, an aviary, and family-friendly dining. Just 10 minutes by boat from Davao Sasa Wharf.
   - **Amenities:** White Sand Shoreline, Restaurant, Aviary, Water Sports, Restrooms, Parking, Wi-Fi.

2. **Kaputian Beach Park**
   - **District:** Kaputian District
   - **Entrance Fee:** ₱15 – ₱50 (Public Municipal Park)
   - **Opening Hours:** 24 Hours
   - **Contact:** +63 917 000 1122
   - **Description:** A famous municipal public beach located at the southern tip of Samal Island. Known for crystal clear turquoise waters, coconut trees providing natural shade, and views of Talikud Island across the channel.
   - **Amenities:** Swimming Area, Public Cottages, Camping Area, Restrooms, Food Stalls.

3. **Canibad Cove & Beach Resort**
   - **District:** Aundanao, Babak District
   - **Entrance Fee:** ₱50 – ₱100
   - **Opening Hours:** 6:00 AM – 6:00 PM
   - **Contact:** +63 920 123 4567
   - **Description:** A hidden cove nestled beneath dramatic limestone cliffs on Samal's eastern coast. Features pebble-and-white-sand shores, deep turquoise waters ideal for cliff jumping, and a tranquil rustic vibe.
   - **Amenities:** Cliff Jumping Site, Pebble & Sand Beach, Open-Air Huts, Snorkeling, Grilling Area.

4. **Isla Reta Beach Resort**
   - **District:** Talikud Island, Kaputian
   - **Entrance Fee:** ₱100 (Day Tour) / ₱200 (Overnight)
   - **Opening Hours:** 24 Hours
   - **Contact:** +63 928 555 7890
   - **Description:** A famous back-to-basics island destination on Talikud Island. Iconic soft white sand shaded by sprawling green *Talisay* trees, featuring rich coral reefs for snorkeling right off the shore.
   - **Amenities:** Talisay Shade Canopy, Snorkeling Reefs, Camping Grounds, Wooden Cottages, Canteen.

5. **SECDEA Beach Resort**
   - **District:** San Jose, Kaputian
   - **Entrance Fee:** ₱650 – ₱1,000 (Day Tour Package)
   - **Opening Hours:** 7:00 AM – 5:00 PM
   - **Contact:** +63 82 295 2912
   - **Description:** An exclusive upscale resort offering modern amenities, an infinity pool overlooking the Davao Gulf, a long wooden boardwalk across mangrove waters, and water sports activities.
   - **Amenities:** Infinity Pool, Wooden Mangrove Boardwalk, Water Park, Buffet Restaurant, Tennis Court, Wi-Fi.

6. **Pearl Farm Beach Resort**
   - **District:** Adecor, Kaputian
   - **Entrance Fee:** Day Tour Packages / Overnight Booking Required
   - **Opening Hours:** 7:00 AM – 6:00 PM
   - **Contact:** +63 82 285 0601 | customercare@pearlfarmresort.com
   - **Description:** Samal's premier 5-star luxury eco-resort built on a former pearl farm. Features iconic stilt water cottages designed by Architect Francisco Mañosa, private white sand coves, and exclusive access to Malipano Island.
   - **Amenities:** Luxury Spa, Private Beaches, Overwater Stilts, Fine Dining, Infinity Pools, Scuba Diving Center.

7. **Cavanico iL Mare Resort**
   - **District:** Camudmud, Babak
   - **Entrance Fee:** ₱300 – ₱400
   - **Opening Hours:** 7:00 AM – 6:00 PM
   - **Contact:** +63 917 888 9900
   - **Description:** A vibrant mid-to-high range beach resort offering an expansive sandy beach, jet-ski rentals, beach volleyball, clean modern shower facilities, and night beach illumination.
   - **Amenities:** Jet Ski & Water Sports, Beach Volleyball Court, Swimming Pool, Modern Cabanas, Restaurant.

8. **Costa Marina Beach Resort**
   - **District:** Babak District
   - **Entrance Fee:** ₱200 – ₱300
   - **Opening Hours:** 6:00 AM – 5:00 PM
   - **Contact:** +63 82 233 1209
   - **Description:** Quiet, lush sanctuary adjacent to Paradise Island. Features peaceful coconut groves, clear calm waters, and secluded day-lounging spots away from large crowds.
   - **Amenities:** Shaded Gardens, Oceanfront Cabanas, Boardwalk, Restaurant, Restrooms.

9. **Vanishing Island & Coral Garden**
   - **District:** Tambo, Babak
   - **Entrance Fee:** ₱50 – ₱150 (Boat Transfer)
   - **Opening Hours:** 6:00 AM – 12:00 PM (Low Tide Only)
   - **Description:** A mangrove-dotted tidal sandbar off the coast of Samal that emerges during low tide. Offers shallow crystal-clear waters perfect for wading, photo sessions, and observing marine sea life.
   - **Amenities:** Tidal Sandbar, Mangrove Sanctuary, Floating Huts, Snorkeling Area.

10. **Maxima Aqua Fun**
    - **District:** Peñaplata District
    - **Entrance Fee:** ₱300 – ₱500
    - **Opening Hours:** 8:00 AM – 5:00 PM
    - **Contact:** +63 922 847 4700
    - **Description:** Thrill-seeker adventure resort featuring a famous 40-foot giant water slide dumping directly into the ocean, kayaking, canopy walking, and diving spots.
    - **Amenities:** Giant Ocean Water Slide, Kayak Rentals, Canopy Walk, Snorkeling, Diving Spot, Overnight Cabins.

---

## 4. Public Page Layout Specifications

### 4.1 Global Header & Navigation (`/`)
- **Left:** Brand wordmark `SAMAALON` in high-contrast serif typeface.
- **Center:** Navigation items (`Home`, `Beaches`, `Blog`, `About Samal`).
- **Right:** Unauthenticated → `[Sign in with Google]`. Authenticated → `[User Avatar Dropdown]` (My Profile, Favorites, My Reviews, Admin Panel if admin, Sign Out).
- **Sticky Blur:** Smooth transition to `backdrop-blur-md bg-white/80` on scroll.

### 4.2 Home Page (`/`)
1. **Parallax Hero Banner:** High-res image with subtitle *"Discover Samal Island's Unspoiled Beaches"*. Embedded quick search pill.
2. **Scroll Storyteller Banner:** Smooth statistics counters (*30+ Beaches, 50+ Accommodations, 100% Verified Reviews*).
3. **Featured Beaches Section:** Horizontal snap carousel featuring top rated coves with price badge, star rating, and quick heart favorite toggle.
4. **Resort & Accommodation Highlights:** Grid preview of top places to stay.
5. **Samal Travel Essentials:** Quick guide cards (Ferry, Environmental Fee, Weather).
6. **Latest Blog Stories:** 3-column article cards.

### 4.3 Beaches Listing (`/beaches`)
- **Filter Header Bar:**
  - Search Keyword input box (`q`).
  - District dropdown filter (*Babak, Peñaplata, Kaputian, Talikud*).
  - Entrance Fee range slider (₱0 - ₱1,000+).
  - Amenities checkboxes (Swimming, Cottages, Restrooms, Parking, Wi-Fi, Water Sports).
  - Minimum Rating toggle (3★+, 4★+).
- **Beach Cards Grid:** 3 columns on desktop, 2 on tablet, 1 on mobile. Card features photo carousel, entrance fee, rating badge, location, and quick favorite button.

### 4.4 Beach Details (`/beaches/[slug]`)
- **Mosaic Photo Gallery:** 5-photo grid layout with "View All Photos" lightbox modal.
- **Quick Info Bar:** Entrance Fee, Opening Hours, Location, Google Maps button (`googleMapsUrl`).
- **Description & Overview:** Editorial narrative.
- **Amenities Grid:** Clean icon badges.
- **Accommodations at this Beach:** Horizontal slider of resorts located on or near this beach.
- **Ratings & Reviews:**
  - Overall rating score (`4.8 / 5.0`) & 5-to-1 star distribution bars.
  - "Write a Review" button (opens modal for logged-in users; prompts login if guest).
  - Review cards with star rating, comment, date, user avatar, and moderation status indicator if user's own review.

### 4.5 Accommodation Details (`/accommodations/[slug]`)
- **Header & Photo Showcase:** Resort photos, associated beach link, price range badge (`₱₱ - ₱₱₱`).
- **Key Details Card:** Price range, guest capacity, check-in/out times, contact details.
- **Book Now CTA:**
  - Button: `[Book via Facebook Messenger ↗]`
  - Subtext: *"You will be redirected to the resort's official Facebook Page to complete your reservation."*
  - Action: Verifies auth (prompts login if guest) -> redirects to `accommodation.facebookUrl` in new tab.
- **Room Types Section:**
  - Card list displaying Room Name, Photos, Price per night, Guest Capacity, Amenities, Description.
- **Guest Reviews Section.**

### 4.6 Blog & Article Pages (`/blog` & `/blog/[slug]`)
- **Category Filter Tabs:** Travel Guides | Beaches | Accommodations | Things to Do | How to Get There | Travel Tips | Samal Island.
- **Article Reader:** Reading progress scroll bar, floating table of contents, high-quality images, clean typography.

### 4.7 About Samal (`/about`)
- **Geography & Culture:** Rich guide on Samal Island's history, marine protection, and indigenous heritage.
- **Ferry & Travel Guide:** Interactive step-by-step visual route:
  - Step 1: Davao Sasa Wharf → Babak Ferry (Passenger & Vehicle).
  - Step 2: Sta. Ana Wharf → Talikud Island Ferry.
  - Step 3: Island Habal-Habal & Tricycle fare breakdown.

### 4.8 User Profile & Favorites (`/profile`)
- **Profile Header:** Google avatar, name, email, role badge.
- **Tabs:**
  - **Saved Beaches:** Grid of favorited beaches with one-click remove.
  - **Saved Accommodations:** Grid of favorited accommodations.
  - **My Reviews:** List of submitted reviews with status badges (`PENDING` 🟡, `APPROVED` 🟢, `REJECTED` 🔴).

---

## 5. Admin Interface Specifications (`/admin/*`)

The Admin Panel uses a dark-sidebar dashboard layout dedicated to platform management:

```
+--------------------------------------------------------------------------+
|  SAMAALON ADMIN  |  [Dashboard] [Beaches] [Accommodations] [Reviews]     |
+------------------+-------------------------------------------------------+
|                  |  Review Moderation Queue                              |
|  - Dashboard     |  +--------------------------------------------------+ |
|  - Beaches       |  | User       | Target      | Rating | Action        | |
|  - Accommodations|  | Juan Dela  | Canibad Cove| 5 Stars| [Approve][Del]| |
|  - Room Types    |  | Maria Santos|SECDEA      | 4 Stars| [Approve][Del]| |
|  - Amenities     |  +--------------------------------------------------+ |
|  - Blog Posts    |                                                       |
|  - Categories    |                                                       |
|  - Reviews (3)   |                                                       |
|  - Users         |                                                       |
+------------------+-------------------------------------------------------+
```

### Admin Workflows
1. **Beach CRUD:** Manage names, slugs, photos, entrance fees, opening hours, contact details, lat/lng, and maps URLs.
2. **Accommodation & Room CRUD:** Manage resorts, link to parent beach, set `facebookUrl`, edit price ranges, add room types with capacity & prices.
3. **Review Moderation Queue:** Review pending submissions. Admin can set status to `APPROVED` or `REJECTED`, or delete inappropriate reviews.
4. **Blog Manager:** Rich text editor to publish travel guides and categorize posts.

---

## 6. UX States Matrix

| State | Visual Design & Behavior |
|-------|--------------------------|
| **Loading / Skeleton** | Shimmer animation placeholder blocks (`animate-pulse`) matching card and gallery dimensions. |
| **Empty Results** | Minimalist beach icon with text *"No beaches found matching your search filters"* + `[Clear Filters]` CTA button. |
| **Error State** | Minimalist alert banner with error message and a `[Try Again]` reload button. |
| **404 Not Found** | Editorial error screen: *"Looks like this cove hasn't been discovered yet"* + `[Return to Home]` button. |
| **Login Required** | Centered modal prompt: *"Please sign in with Google to save favorites, write reviews, or access booking links."* |
| **Booking Redirect** | Brief full-screen overlay: *"Redirecting to official Facebook Messenger page..."* before opening target link. |
| **Review Pending** | Banner toast: *"Your review has been submitted and is currently pending moderation."* |
| **Review Moderation** | Visual status pills (`PENDING` yellow, `APPROVED` green, `REJECTED` red) on profile and admin dashboard. |
