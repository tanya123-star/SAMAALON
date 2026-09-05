import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FavoriteButton } from "@/components/favorites/FavoriteButton"
import { ReviewForm } from "@/components/reviews/ReviewForm"
import { SafeImage } from "@/components/ui/SafeImage"

export default async function BeachDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const beach = await prisma.beach.findUnique({
    where: { slug },
    include: {
      accommodations: {
        include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      },
      images: true,
      amenities: { include: { amenity: true } },
    },
  })
  if (!beach) notFound()

  // Show approved reviews publicly
  const reviews = await prisma.review.findMany({
    where: { beachId: beach.id, status: "APPROVED" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  const primaryImage =
    beach.images[0]?.url ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* 1. Hero Gallery Showcase */}
      <section className="relative h-[60vh] min-h-[450px] w-full overflow-hidden bg-slate-900">
        <SafeImage
          src={primaryImage}
          alt={beach.name}
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2A28] via-[#1C2A28]/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-4 pb-10 text-white sm:px-8">
          <Link
            href="/beaches"
            className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white"
          >
            ← Back to Beaches & Coves
          </Link>
          <span className="block text-xs font-bold tracking-widest text-[#E07A5F] uppercase">
            {beach.location}
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white sm:text-5xl">
            {beach.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            {beach.entranceFee ? (
              <span className="rounded-full border border-white/20 bg-white/20 px-3.5 py-1.5 font-semibold text-white backdrop-blur-md">
                ₱{String(beach.entranceFee)} Entrance Fee
              </span>
            ) : null}
            {beach.avgRating ? (
              <span className="rounded-full bg-[#E07A5F] px-3.5 py-1.5 font-bold text-white shadow-sm">
                ⭐ {String(beach.avgRating)} / 5.0 ({beach.reviewCount} reviews)
              </span>
            ) : null}
            {beach.googleMapsUrl ? (
              <a
                href={beach.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/90 px-4 py-1.5 font-bold text-[#1C2A28] shadow-sm transition-all hover:bg-white"
              >
                📍 Open in Google Maps ↗
              </a>
            ) : null}
            <FavoriteButton beachId={beach.id} />
          </div>
        </div>
      </section>

      {/* 2. Overview & Quick Information */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Editorial Description */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C2A28]">
                About {beach.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#5A6B68] sm:text-base">
                {beach.description}
              </p>
            </div>

            {/* Amenities Grid */}
            {beach.amenities.length > 0 && (
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C2A28]">
                  Beach Amenities
                </h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {beach.amenities.map((ba) => (
                    <span
                      key={ba.amenityId}
                      className="flex items-center gap-1.5 rounded-full border border-[#1C2A28]/10 bg-white px-4 py-2 text-xs font-semibold text-[#1C2A28] shadow-sm"
                    >
                      🌿 {ba.amenity.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Info Box */}
          <div className="h-fit space-y-6 rounded-2xl border border-[#1C2A28]/10 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#1C2A28]">
              Visitor Info
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="block text-[10px] font-semibold tracking-wider text-[#5A6B68] uppercase">
                  District & Location
                </span>
                <span className="mt-0.5 block font-bold text-[#1C2A28]">
                  {beach.location}
                </span>
              </div>

              {beach.openingHours && (
                <div>
                  <span className="block text-[10px] font-semibold tracking-wider text-[#5A6B68] uppercase">
                    Opening Hours
                  </span>
                  <span className="mt-0.5 block font-bold text-[#1C2A28]">
                    🕒 {beach.openingHours}
                  </span>
                </div>
              )}

              {beach.contactInfo && (
                <div>
                  <span className="block text-[10px] font-semibold tracking-wider text-[#5A6B68] uppercase">
                    Contact Details
                  </span>
                  <span className="mt-0.5 block font-bold text-[#1C2A28]">
                    📞 {beach.contactInfo}
                  </span>
                </div>
              )}

              {beach.latitude && beach.longitude && (
                <div>
                  <span className="block text-[10px] font-semibold tracking-wider text-[#5A6B68] uppercase">
                    GPS Coordinates
                  </span>
                  <span className="mt-0.5 block font-bold text-[#1C2A28]">
                    {String(beach.latitude)}, {String(beach.longitude)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Accommodations at this Beach */}
      <section className="border-y border-[#1C2A28]/10 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <h2 className="font-serif text-2xl font-bold text-[#1C2A28] sm:text-3xl">
            Where to Stay at {beach.name}
          </h2>
          <p className="mt-1 text-xs text-[#5A6B68]">
            Resorts and accommodations located directly on or adjacent to this
            beach.
          </p>

          {beach.accommodations.length === 0 ? (
            <p className="mt-6 text-xs text-[#5A6B68]">
              No accommodations listed specifically for this beach yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beach.accommodations.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#1C2A28]/10 bg-[#FAF8F5] p-6"
                >
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C2A28]">
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
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[#1C2A28]/10 pt-4 text-xs font-bold">
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
          )}
        </div>
      </section>

      {/* 4. Guest Reviews Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8">
        <div className="mb-8 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C2A28] sm:text-3xl">
              Visitor Reviews
            </h2>
            <p className="mt-1 text-xs text-[#5A6B68]">
              Authentic experiences from Google-authenticated travelers.
            </p>
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-[#1C2A28]/10 bg-white p-6">
          <ReviewForm beachId={beach.id} />
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1C2A28]/20 bg-white p-8 text-center text-xs text-[#5A6B68]">
            Be the first visitor to submit a review for {beach.name}!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-[#1C2A28]/10 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1C2A28]">
                    {r.user.name || r.user.email}
                  </span>
                  <span className="font-bold text-amber-500">
                    ⭐ {r.rating} / 5
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#5A6B68]">
                  {r.comment}
                </p>
                <span className="mt-3 block text-[10px] text-[#5A6B68]/60">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
