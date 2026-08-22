import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [featuredBeaches, popularAccommodations, latestPosts] = await Promise.all([
    prisma.beach.findMany({
      take: 6,
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.accommodation.findMany({
      take: 6,
      include: {
        beach: true,
        images: { take: 1, orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* 1. Parallax Storytelling Hero */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Scale Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            alt="Samal Island Coastline"
            className="w-full h-full object-cover scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C2A28]/60 via-[#1C2A28]/30 to-[#FAF8F5]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E07A5F] bg-[#1C2A28]/40 backdrop-blur-md px-4 py-1.5 rounded-full inline-block mb-6 border border-white/10">
            Island Garden City of Samal
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.15]">
            Discover the Unspoiled Havens of Samal
          </h1>
          <p className="mt-6 text-sm sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
            Explore white sand coves, hidden cliffside beaches, and authentic resorts across Davao's premier tropical island sanctuary.
          </p>

          {/* Minimalist Search & CTA Bar */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link
              href="/beaches"
              className="w-full sm:w-auto rounded-full bg-[#2D6A4F] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[#1C2A28] hover:shadow-xl shadow-lg"
            >
              Explore Beaches & Coves
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-[#1C2A28]"
            >
              Ferry & Travel Info
            </Link>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
          <div className="w-4 h-7 rounded-full border border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/80 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. Interactive Scroll Counter Stats */}
      <section className="border-y border-[#1C2A28]/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2A28]">30+</div>
            <div className="text-xs uppercase tracking-widest text-[#5A6B68] mt-1">Pristine Coves & Beaches</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2A28]">50+</div>
            <div className="text-xs uppercase tracking-widest text-[#5A6B68] mt-1">Authentic Accommodations</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2A28]">100%</div>
            <div className="text-xs uppercase tracking-widest text-[#5A6B68] mt-1">Verified Facebook Redirects</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2A28]">4.8 ★</div>
            <div className="text-xs uppercase tracking-widest text-[#5A6B68] mt-1">Average Visitor Rating</div>
          </div>
        </div>
      </section>

      {/* 3. Featured Beaches Section */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F]">Curated Destinations</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2A28] mt-2">Featured Samal Beaches</h2>
          </div>
          <Link
            href="/beaches"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2D6A4F] hover:text-[#1C2A28] transition-colors"
          >
            View All 10 Beaches →
          </Link>
        </div>

        {featuredBeaches.length === 0 ? (
          <p className="text-sm text-[#5A6B68]">No beaches loaded yet.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBeaches.map((b) => (
              <div
                key={b.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[#1C2A28]/10 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* Image Showcase */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  <img
                    src={b.images[0]?.url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"}
                    alt={b.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#1C2A28] shadow-sm">
                    {b.entranceFee ? `₱${b.entranceFee.toString()} Entry` : "Public"}
                  </div>
                  {b.avgRating && (
                    <div className="absolute top-4 left-4 rounded-full bg-[#1C2A28]/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
                      ⭐ {b.avgRating.toString()}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2D6A4F]">{b.location}</span>
                  <h3 className="font-serif text-xl font-bold text-[#1C2A28] mt-1 group-hover:text-[#2D6A4F] transition-colors">
                    <Link href={`/beaches/${b.slug}`}>
                      <span className="absolute inset-0" />
                      {b.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#5A6B68] line-clamp-2">{b.description}</p>

                  <div className="mt-6 pt-4 border-t border-[#1C2A28]/10 flex items-center justify-between text-xs font-semibold text-[#1C2A28]">
                    <span>View Details</span>
                    <span className="text-[#2D6A4F]">Explore →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Popular Accommodations Section */}
      <section className="bg-white border-y border-[#1C2A28]/10 py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F]">Where to Stay</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2A28] mt-2">Popular Accommodations</h2>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {popularAccommodations.map((a) => (
              <div key={a.id} className="group flex flex-col rounded-2xl border border-[#1C2A28]/10 bg-[#FAF8F5] p-6 transition-all hover:bg-white hover:shadow-lg">
                <div className="h-48 rounded-xl overflow-hidden mb-4 bg-slate-200">
                  <img
                    src={a.images[0]?.url || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"}
                    alt={a.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A6B68]">{a.beach.name}</span>
                <h3 className="font-serif text-lg font-bold text-[#1C2A28] mt-1">
                  <Link href={`/accommodations/${a.slug}`} className="hover:text-[#2D6A4F]">
                    {a.name}
                  </Link>
                </h3>
                <p className="text-xs text-[#5A6B68] mt-2 line-clamp-2">{a.description}</p>
                <div className="mt-4 pt-4 border-t border-[#1C2A28]/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#2D6A4F]">{a.priceRange || "Contact resort"}</span>
                  <Link href={`/accommodations/${a.slug}`} className="text-[#1C2A28] hover:underline">
                    View Rooms →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Travel Guides */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F]">Travel Journal</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2A28] mt-2">Essential Samal Guides</h2>
          </div>
          <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] hover:text-[#1C2A28]">
            View All Stories →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {latestPosts.map((p) => (
            <article key={p.id} className="flex flex-col bg-white rounded-2xl border border-[#1C2A28]/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src={p.featuredImage || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1C2A28] line-clamp-2">
                    <Link href={`/blog/${p.slug}`} className="hover:text-[#2D6A4F]">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#5A6B68] line-clamp-3">{p.content}</p>
                </div>
                <Link href={`/blog/${p.slug}`} className="mt-6 text-xs font-bold text-[#2D6A4F] hover:underline">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. About Samal Editorial Callout */}
      <section className="bg-[#1C2A28] text-white py-20 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 text-center relative z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E07A5F]">The Samal Island Experience</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold mt-4 leading-tight">
            Pristine Coves, Rich Culture, & Warm Island Hospitality
          </h2>
          <p className="mt-6 text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
            Just minutes across the Davao Gulf, Samal offers white sand beaches, marine sanctuaries, cliff diving, and lush coconut palm groves.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block rounded-full bg-[#E07A5F] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-[#1C2A28]"
          >
            Explore Ferry Routes & Island Info
          </Link>
        </div>
      </section>
    </div>
  );
}
