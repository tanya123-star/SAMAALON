import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");
  const userId = (session.user as unknown as { id: string }).id;

  const [beaches, accommodations] = await Promise.all([
    prisma.favoriteBeach.findMany({
      where: { userId },
      include: { beach: { include: { images: { take: 1 } } } },
    }),
    prisma.favoriteAccommodation.findMany({
      where: { userId },
      include: { accommodation: { include: { beach: true, images: { take: 1 } } } },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <section className="bg-white border-b border-[#1C2A28]/10 py-16 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F]">Saved Places</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C2A28] mt-2">My Favorite Destinations</h1>
          <p className="mt-2 text-xs sm:text-sm text-[#5A6B68]">Saved Samal beaches and accommodations for your upcoming island trip.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl w-full px-4 sm:px-8 py-12 space-y-12">
        {/* Favorited Beaches */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1C2A28] mb-6">Saved Beaches ({beaches.length})</h2>
          {beaches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#1C2A28]/20 bg-white p-8 text-center text-xs text-[#5A6B68]">
              No favorited beaches yet. Browse the <Link href="/beaches" className="text-[#2D6A4F] font-bold hover:underline">beaches directory</Link> to save your favorite coves.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beaches.map((f) => (
                <div key={f.beachId} className="group rounded-2xl border border-[#1C2A28]/10 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="h-44 overflow-hidden bg-slate-100 relative">
                    <img
                      src={f.beach.images[0]?.url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"}
                      alt={f.beach.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2D6A4F]">{f.beach.location}</span>
                      <h3 className="font-serif text-lg font-bold text-[#1C2A28] mt-1">
                        <Link href={`/beaches/${f.beach.slug}`} className="hover:text-[#2D6A4F]">
                          {f.beach.name}
                        </Link>
                      </h3>
                    </div>
                    <Link href={`/beaches/${f.beach.slug}`} className="mt-4 text-xs font-bold text-[#2D6A4F] hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorited Accommodations */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1C2A28] mb-6">Saved Accommodations ({accommodations.length})</h2>
          {accommodations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#1C2A28]/20 bg-white p-8 text-center text-xs text-[#5A6B68]">
              No favorited accommodations yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {accommodations.map((f) => (
                <div key={f.accommodationId} className="group rounded-2xl border border-[#1C2A28]/10 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="h-44 overflow-hidden bg-slate-100 relative">
                    <img
                      src={f.accommodation.images[0]?.url || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"}
                      alt={f.accommodation.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A6B68]">{f.accommodation.beach.name}</span>
                      <h3 className="font-serif text-lg font-bold text-[#1C2A28] mt-1">
                        <Link href={`/accommodations/${f.accommodation.slug}`} className="hover:text-[#2D6A4F]">
                          {f.accommodation.name}
                        </Link>
                      </h3>
                    </div>
                    <Link href={`/accommodations/${f.accommodation.slug}`} className="mt-4 text-xs font-bold text-[#2D6A4F] hover:underline">
                      View Rooms & Booking →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
