import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export default async function BeachDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const beach = await prisma.beach.findUnique({
    where: { slug },
    include: {
      accommodations: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } },
      images: true,
      amenities: { include: { amenity: true } },
    },
  });
  if (!beach) notFound();

  // Show approved reviews publicly
  const reviews = await prisma.review.findMany({
    where: { beachId: beach.id, status: "APPROVED" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const primaryImage = beach.images[0]?.url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* 1. Hero Gallery Showcase */}
      <section className="relative w-full h-[60vh] min-h-[450px] bg-slate-900 overflow-hidden">
        <img
          src={primaryImage}
          alt={beach.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2A28] via-[#1C2A28]/40 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 mx-auto max-w-7xl px-4 sm:px-8 pb-10 text-white z-10">
          <Link href="/beaches" className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white mb-4">
            ← Back to Beaches & Coves
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F] block">{beach.location}</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-1 text-white">{beach.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            {beach.entranceFee ? (
              <span className="rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 font-semibold text-white border border-white/20">
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
                className="rounded-full bg-white/90 px-4 py-1.5 font-bold text-[#1C2A28] hover:bg-white transition-all shadow-sm"
              >
                📍 Open in Google Maps ↗
              </a>
            ) : null}
            <FavoriteButton beachId={beach.id} />
          </div>
        </div>
      </section>

      {/* 2. Overview & Quick Information */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Editorial Description */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C2A28]">About {beach.name}</h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#5A6B68]">{beach.description}</p>
            </div>

            {/* Amenities Grid */}
            {beach.amenities.length > 0 && (
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C2A28]">Beach Amenities</h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {beach.amenities.map((ba) => (
                    <span
                      key={ba.amenityId}
                      className="rounded-full bg-white border border-[#1C2A28]/10 px-4 py-2 text-xs font-semibold text-[#1C2A28] shadow-sm flex items-center gap-1.5"
                    >
                      🌿 {ba.amenity.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Info Box */}
          <div className="rounded-2xl border border-[#1C2A28]/10 bg-white p-6 shadow-sm h-fit space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#1C2A28]">Visitor Info</h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#5A6B68] uppercase tracking-wider font-semibold block text-[10px]">District & Location</span>
                <span className="font-bold text-[#1C2A28] mt-0.5 block">{beach.location}</span>
              </div>

              {beach.openingHours && (
                <div>
                  <span className="text-[#5A6B68] uppercase tracking-wider font-semibold block text-[10px]">Opening Hours</span>
                  <span className="font-bold text-[#1C2A28] mt-0.5 block">🕒 {beach.openingHours}</span>
                </div>
              )}

              {beach.contactInfo && (
                <div>
                  <span className="text-[#5A6B68] uppercase tracking-wider font-semibold block text-[10px]">Contact Details</span>
                  <span className="font-bold text-[#1C2A28] mt-0.5 block">📞 {beach.contactInfo}</span>
                </div>
              )}

              {beach.latitude && beach.longitude && (
                <div>
                  <span className="text-[#5A6B68] uppercase tracking-wider font-semibold block text-[10px]">GPS Coordinates</span>
                  <span className="font-bold text-[#1C2A28] mt-0.5 block">
                    {String(beach.latitude)}, {String(beach.longitude)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Accommodations at this Beach */}
      <section className="bg-white border-y border-[#1C2A28]/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2A28]">Where to Stay at {beach.name}</h2>
          <p className="mt-1 text-xs text-[#5A6B68]">Resorts and accommodations located directly on or adjacent to this beach.</p>

          {beach.accommodations.length === 0 ? (
            <p className="mt-6 text-xs text-[#5A6B68]">No accommodations listed specifically for this beach yet.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beach.accommodations.map((a) => (
                <div key={a.id} className="rounded-2xl border border-[#1C2A28]/10 bg-[#FAF8F5] p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C2A28]">
                      <Link href={`/accommodations/${a.slug}`} className="hover:text-[#2D6A4F]">
                        {a.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#5A6B68] mt-2 line-clamp-2">{a.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#1C2A28]/10 flex items-center justify-between text-xs font-bold">
                    <span className="text-[#2D6A4F]">{a.priceRange || "Contact resort"}</span>
                    <Link href={`/accommodations/${a.slug}`} className="text-[#1C2A28] hover:underline">
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
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2A28]">Visitor Reviews</h2>
            <p className="mt-1 text-xs text-[#5A6B68]">Authentic experiences from Google-authenticated travelers.</p>
          </div>
        </div>

        <div className="mb-10 rounded-2xl bg-white border border-[#1C2A28]/10 p-6">
          <ReviewForm beachId={beach.id} />
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-2xl bg-white border border-dashed border-[#1C2A28]/20 p-8 text-center text-xs text-[#5A6B68]">
            Be the first visitor to submit a review for {beach.name}!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white border border-[#1C2A28]/10 p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1C2A28]">{r.user.name || r.user.email}</span>
                  <span className="text-amber-500 font-bold">⭐ {r.rating} / 5</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#5A6B68]">{r.comment}</p>
                <span className="text-[10px] text-[#5A6B68]/60 mt-3 block">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
