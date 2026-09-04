import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ParallaxHero } from "@/components/scrolling/ParallaxHero"
import { SafeImage } from "@/components/ui/SafeImage"

export default async function HomePage() {
  const [featuredBeaches, popularAccommodations, latestPosts] =
    await Promise.all([
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
    ])

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* 1. Parallax Interactive Hero */}
      <ParallaxHero />

      {/* 3. Featured Beaches Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-8">
        <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#2D6A4F] uppercase">
              Curated Destinations
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#1C2A28] sm:text-4xl">
              Featured Samal Beaches
            </h2>
          </div>
          <Link
            href="/beaches"
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#2D6A4F] uppercase transition-colors hover:text-[#1C2A28] md:mt-0"
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
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1C2A28]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* Image Showcase */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  <SafeImage
                    src={
                      b.images[0]?.url ||
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={b.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#1C2A28] shadow-sm backdrop-blur-md">
                    {b.entranceFee
                      ? `₱${b.entranceFee.toString()} Entry`
                      : "Public"}
                  </div>
                  {b.avgRating && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-[#1C2A28]/80 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
                      ⭐ {b.avgRating.toString()}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[11px] font-semibold tracking-wider text-[#2D6A4F] uppercase">
                    {b.location}
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-bold text-[#1C2A28] transition-colors group-hover:text-[#2D6A4F]">
                    <Link href={`/beaches/${b.slug}`}>
                      <span className="absolute inset-0" />
                      {b.name}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#5A6B68]">
                    {b.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-[#1C2A28]/10 pt-4 text-xs font-semibold text-[#1C2A28]">
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
      <section className="border-y border-[#1C2A28]/10 bg-white py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#2D6A4F] uppercase">
                Where to Stay
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[#1C2A28] sm:text-4xl">
                Popular Accommodations
              </h2>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {popularAccommodations.map((a) => (
              <div
                key={a.id}
                className="group flex flex-col rounded-2xl border border-[#1C2A28]/10 bg-[#FAF8F5] p-6 transition-all hover:bg-white hover:shadow-lg"
              >
                <div className="mb-4 h-48 overflow-hidden rounded-xl bg-slate-200">
                  <SafeImage
                    src={
                      a.images[0]?.url ||
                      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={a.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-[11px] font-semibold tracking-wider text-[#5A6B68] uppercase">
                  {a.beach.name}
                </span>
                <h3 className="mt-1 font-serif text-lg font-bold text-[#1C2A28]">
                  <Link
                    href={`/accommodations/${a.slug}`}
                    className="hover:text-[#2D6A4F]"
                  >
                    {a.name}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-xs text-[#5A6B68]">
                  {a.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[#1C2A28]/10 pt-4 text-xs font-bold">
                  <span className="text-[#2D6A4F]">
                    {a.priceRange || "Contact resort"}
                  </span>
                  <Link
                    href={`/accommodations/${a.slug}`}
                    className="text-[#1C2A28] hover:underline"
                  >
                    View Rooms →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Travel Guides */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-8">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#2D6A4F] uppercase">
              Travel Journal
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#1C2A28] sm:text-4xl">
              Essential Samal Guides
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold tracking-widest text-[#2D6A4F] uppercase hover:text-[#1C2A28]"
          >
            View All Stories →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {latestPosts.map((p) => (
            <article
              key={p.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#1C2A28]/10 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src={
                    p.featuredImage ||
                    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="line-clamp-2 font-serif text-lg font-bold text-[#1C2A28]">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="hover:text-[#2D6A4F]"
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#5A6B68]">
                    {p.content}
                  </p>
                </div>
                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-6 text-xs font-bold text-[#2D6A4F] hover:underline"
                >
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. About Samal Editorial Callout */}
      <section className="relative overflow-hidden bg-[#1C2A28] py-20 text-white">
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-8">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#E07A5F] uppercase">
            The Samal Island Experience
          </span>
          <h2 className="mt-4 font-serif text-3xl leading-tight font-bold sm:text-5xl">
            Pristine Coves, Rich Culture, & Warm Island Hospitality
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed font-light text-white/80 sm:text-base">
            Just minutes across the Davao Gulf, Samal offers white sand beaches,
            marine sanctuaries, cliff diving, and lush coconut palm groves.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block rounded-full bg-[#E07A5F] px-8 py-3.5 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-[#1C2A28]"
          >
            Explore Ferry Routes & Island Info
          </Link>
        </div>
      </section>
    </div>
  )
}
