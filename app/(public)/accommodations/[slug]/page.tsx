import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FavoriteButton } from "@/components/favorites/FavoriteButton"
import { ReviewForm } from "@/components/reviews/ReviewForm"
import { BookNowButton } from "@/components/booking/BookNowButton"
import { SafeImage } from "@/components/ui/SafeImage"

export default async function AccommodationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const acc = await prisma.accommodation.findUnique({
    where: { slug },
    include: {
      beach: true,
      roomTypes: true,
      images: true,
      amenities: { include: { amenity: true } },
    },
  })
  if (!acc) notFound()

  // Show approved reviews publicly
  const reviews = await prisma.review.findMany({
    where: { accommodationId: acc.id, status: "APPROVED" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  const primaryImage =
    acc.images[0]?.url ||
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* Hero Cover */}
      <section className="relative h-[55vh] min-h-[400px] w-full overflow-hidden bg-slate-900">
        <SafeImage
          src={primaryImage}
          alt={acc.name}
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2A28] via-[#1C2A28]/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-4 pb-10 text-white sm:px-8">
          <Link
            href={`/beaches/${acc.beach.slug}`}
            className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white"
          >
            ← Located at {acc.beach.name}
          </Link>
          <span className="block text-xs font-bold tracking-widest text-[#E07A5F] uppercase">
            {acc.beach.location}
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white sm:text-5xl">
            {acc.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            {acc.priceRange && (
              <span className="rounded-full bg-[#2D6A4F] px-4 py-1.5 font-bold text-white shadow-sm">
                {acc.priceRange}
              </span>
            )}
            {acc.maxGuests && (
              <span className="rounded-full border border-white/20 bg-white/20 px-3.5 py-1.5 font-semibold text-white backdrop-blur-md">
                Up to {acc.maxGuests} Guests
              </span>
            )}
            {acc.avgRating && (
              <span className="rounded-full bg-[#E07A5F] px-3.5 py-1.5 font-bold text-white shadow-sm">
                ⭐ {String(acc.avgRating)} / 5.0 ({acc.reviewCount} reviews)
              </span>
            )}
            <FavoriteButton accommodationId={acc.id} />
          </div>
        </div>
      </section>

      {/* Main Details & Booking Bar */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C2A28]">
                About {acc.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#5A6B68] sm:text-base">
                {acc.description}
              </p>
            </div>

            {/* Room Types */}
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1C2A28]">
                Available Room Types
              </h3>
              {acc.roomTypes.length === 0 ? (
                <p className="mt-2 text-xs text-[#5A6B68]">
                  Contact resort via Facebook for current room rates.
                </p>
              ) : (
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  {acc.roomTypes.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-[#1C2A28]/10 bg-white p-6 shadow-sm"
                    >
                      <h4 className="font-serif text-lg font-bold text-[#1C2A28]">
                        {r.name}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-[#5A6B68]">
                        {r.description ||
                          "Air-conditioned guest room with resort access."}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-[#1C2A28]/10 pt-3 text-xs">
                        <span className="font-bold text-[#2D6A4F]">
                          ₱{String(r.price)} / night
                        </span>
                        {r.maxGuests && (
                          <span className="text-[#5A6B68]">
                            {r.maxGuests} Guests
                          </span>
                        )}
                      </div>
                      {r.amenities && (
                        <p className="mt-3 rounded-lg bg-[#FAF8F5] p-2 text-[11px] text-[#5A6B68]/80">
                          ✨ {r.amenities}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resort Amenities */}
            {acc.amenities.length > 0 && (
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C2A28]">
                  Resort Amenities
                </h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {acc.amenities.map((a) => (
                    <span
                      key={a.amenityId}
                      className="rounded-full border border-[#1C2A28]/10 bg-white px-4 py-2 text-xs font-semibold text-[#1C2A28] shadow-sm"
                    >
                      🌿 {a.amenity.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Book Now Floating Card */}
          <div className="h-fit space-y-6 rounded-2xl border border-[#1C2A28]/10 bg-white p-6 shadow-md">
            <h3 className="font-serif text-lg font-bold text-[#1C2A28]">
              Reserve Your Stay
            </h3>
            <p className="text-xs leading-relaxed text-[#5A6B68]">
              Clicking <strong className="text-[#1C2A28]">Book Now</strong> will
              verify your Google login and redirect you directly to {acc.name}
              &apos;s official Facebook Messenger page to complete your booking.
            </p>

            <div className="space-y-3">
              <BookNowButton
                facebookUrl={acc.facebookUrl}
                accommodationName={acc.name}
                slug={acc.slug}
              />
            </div>

            <div className="space-y-3 border-t border-[#1C2A28]/10 pt-4 text-xs text-[#5A6B68]">
              {acc.checkInTime && (
                <div className="flex justify-between">
                  <span>Check-in Time:</span>
                  <span className="font-bold text-[#1C2A28]">
                    {acc.checkInTime}
                  </span>
                </div>
              )}
              {acc.checkOutTime && (
                <div className="flex justify-between">
                  <span>Check-out Time:</span>
                  <span className="font-bold text-[#1C2A28]">
                    {acc.checkOutTime}
                  </span>
                </div>
              )}
              {acc.contactInfo && (
                <div className="flex justify-between">
                  <span>Direct Contact:</span>
                  <span className="font-bold text-[#1C2A28]">
                    {acc.contactInfo}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews */}
      <section className="border-t border-[#1C2A28]/10 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <h2 className="font-serif text-2xl font-bold text-[#1C2A28]">
            Guest Reviews
          </h2>
          <div className="my-8 rounded-2xl border border-[#1C2A28]/10 bg-[#FAF8F5] p-6">
            <ReviewForm accommodationId={acc.id} />
          </div>

          {reviews.length === 0 ? (
            <p className="text-xs text-[#5A6B68]">
              No reviews written yet for {acc.name}.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-[#1C2A28]/10 bg-[#FAF8F5] p-6"
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
