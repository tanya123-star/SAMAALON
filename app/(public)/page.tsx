import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ParallaxHero } from "@/components/scrolling/ParallaxHero";

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
      {/* 1. Parallax Interactive Hero */}
      <ParallaxHero />



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
            View All →
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
