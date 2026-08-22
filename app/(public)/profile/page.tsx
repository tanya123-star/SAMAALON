import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const user = session.user as unknown as { name?: string; email?: string; image?: string; role?: string; id?: string };

  const [favBeaches, favAccs, reviews] = await Promise.all([
    user.id
      ? prisma.favoriteBeach.findMany({
          where: { userId: user.id },
          include: { beach: { include: { images: { take: 1 } } } },
        })
      : [],
    user.id
      ? prisma.favoriteAccommodation.findMany({
          where: { userId: user.id },
          include: { accommodation: { include: { beach: true, images: { take: 1 } } } },
        })
      : [],
    user.id
      ? prisma.review.findMany({
          where: { userId: user.id },
          include: { beach: true, accommodation: true },
          orderBy: { createdAt: "desc" },
        })
      : [],
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <section className="bg-white border-b border-[#1C2A28]/10 py-12 px-4 sm:px-8">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center gap-6">
          {user.image ? (
            <img src={user.image} alt={user.name || "Avatar"} className="w-20 h-20 rounded-full border-2 border-[#2D6A4F] object-cover shadow-sm" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center font-serif text-3xl font-bold">
              {user.name?.[0] || "U"}
            </div>
          )}
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2A28]">{user.name || "User Profile"}</h1>
              {user.role === "ADMIN" && (
                <span className="rounded-full bg-[#1C2A28] px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#5A6B68]">{user.email}</p>
            <p className="text-[11px] text-[#5A6B68]/70">Authenticated via Google OAuth</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl w-full px-4 sm:px-8 py-12 space-y-12">
        {/* Saved Beaches */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1C2A28] mb-4">Saved Beaches ({favBeaches.length})</h2>
          {favBeaches.length === 0 ? (
            <p className="text-xs text-[#5A6B68] rounded-xl bg-white border border-dashed border-[#1C2A28]/20 p-6 text-center">
              No favorited beaches yet. Explore <Link href="/beaches" className="text-[#2D6A4F] font-bold hover:underline">beaches directory</Link> to save your favorites!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {favBeaches.map((fb) => (
                <div key={fb.beachId} className="rounded-xl bg-white border border-[#1C2A28]/10 p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1C2A28]">
                      <Link href={`/beaches/${fb.beach.slug}`} className="hover:text-[#2D6A4F]">
                        {fb.beach.name}
                      </Link>
                    </h3>
                    <span className="text-[11px] text-[#5A6B68] block">{fb.beach.location}</span>
                  </div>
                  <Link href={`/beaches/${fb.beach.slug}`} className="text-xs font-bold text-[#2D6A4F] hover:underline">
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Accommodations */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1C2A28] mb-4">Saved Accommodations ({favAccs.length})</h2>
          {favAccs.length === 0 ? (
            <p className="text-xs text-[#5A6B68] rounded-xl bg-white border border-dashed border-[#1C2A28]/20 p-6 text-center">
              No saved resort accommodations yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {favAccs.map((fa) => (
                <div key={fa.accommodationId} className="rounded-xl bg-white border border-[#1C2A28]/10 p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1C2A28]">
                      <Link href={`/accommodations/${fa.accommodation.slug}`} className="hover:text-[#2D6A4F]">
                        {fa.accommodation.name}
                      </Link>
                    </h3>
                    <span className="text-[11px] text-[#5A6B68] block">{fa.accommodation.beach.name}</span>
                  </div>
                  <Link href={`/accommodations/${fa.accommodation.slug}`} className="text-xs font-bold text-[#2D6A4F] hover:underline">
                    View Rooms →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Reviews with Moderation Status */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1C2A28] mb-4">My Submitted Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="text-xs text-[#5A6B68] rounded-xl bg-white border border-dashed border-[#1C2A28]/20 p-6 text-center">
              You haven&apos;t written any reviews yet. Visit any beach or resort page to write a review!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => {
                const targetName = r.beach?.name || r.accommodation?.name || "Target";
                return (
                  <div key={r.id} className="rounded-2xl bg-white border border-[#1C2A28]/10 p-6 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1C2A28]">Review for {targetName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold">⭐ {r.rating} / 5</span>
                        {r.status === "PENDING" && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800 border border-amber-300">
                            🟡 Pending Moderation
                          </span>
                        )}
                        {r.status === "APPROVED" && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                            🟢 Approved & Live
                          </span>
                        )}
                        {r.status === "REJECTED" && (
                          <span className="rounded-full bg-rose-100 px-3 py-1 text-[10px] font-bold text-rose-800 border border-rose-300">
                            🔴 Rejected
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[#5A6B68]">{r.comment}</p>
                    <span className="text-[10px] text-[#5A6B68]/60 mt-3 block">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
