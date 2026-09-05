import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=%2Fprofile")

  const user = session.user as unknown as {
    name?: string
    email?: string
    image?: string
    role?: string
    id?: string
  }

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
          include: {
            accommodation: { include: { beach: true, images: { take: 1 } } },
          },
        })
      : [],
    user.id
      ? prisma.review.findMany({
          where: { userId: user.id },
          include: { beach: true, accommodation: true },
          orderBy: { createdAt: "desc" },
        })
      : [],
  ])

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <section className="border-b border-[#1C2A28]/10 bg-white px-4 py-12 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "Avatar"}
              className="h-20 w-20 rounded-full border-2 border-[#2D6A4F] object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2D6A4F] font-serif text-3xl font-bold text-white">
              {user.name?.[0] || "U"}
            </div>
          )}
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-serif text-2xl font-bold text-[#1C2A28] sm:text-3xl">
                {user.name || "User Profile"}
              </h1>
              {user.role === "ADMIN" && (
                <span className="rounded-full bg-[#1C2A28] px-3 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#5A6B68]">{user.email}</p>
            <p className="text-[11px] text-[#5A6B68]/70">
              Authenticated via Google OAuth
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl space-y-12 px-4 py-12 sm:px-8">
        {/* Saved Beaches */}
        <div>
          <h2 className="mb-4 font-serif text-xl font-bold text-[#1C2A28]">
            Saved Beaches ({favBeaches.length})
          </h2>
          {favBeaches.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#1C2A28]/20 bg-white p-6 text-center text-xs text-[#5A6B68]">
              No favorited beaches yet. Explore{" "}
              <Link
                href="/beaches"
                className="font-bold text-[#2D6A4F] hover:underline"
              >
                beaches directory
              </Link>{" "}
              to save your favorites!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {favBeaches.map((fb) => (
                <div
                  key={fb.beachId}
                  className="flex items-center justify-between rounded-xl border border-[#1C2A28]/10 bg-white p-4 shadow-sm"
                >
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1C2A28]">
                      <Link
                        href={`/beaches/${fb.beach.slug}`}
                        className="hover:text-[#2D6A4F]"
                      >
                        {fb.beach.name}
                      </Link>
                    </h3>
                    <span className="block text-[11px] text-[#5A6B68]">
                      {fb.beach.location}
                    </span>
                  </div>
                  <Link
                    href={`/beaches/${fb.beach.slug}`}
                    className="text-xs font-bold text-[#2D6A4F] hover:underline"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Accommodations */}
        <div>
          <h2 className="mb-4 font-serif text-xl font-bold text-[#1C2A28]">
            Saved Accommodations ({favAccs.length})
          </h2>
          {favAccs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#1C2A28]/20 bg-white p-6 text-center text-xs text-[#5A6B68]">
              No saved resort accommodations yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {favAccs.map((fa) => (
                <div
                  key={fa.accommodationId}
                  className="flex items-center justify-between rounded-xl border border-[#1C2A28]/10 bg-white p-4 shadow-sm"
                >
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1C2A28]">
                      <Link
                        href={`/accommodations/${fa.accommodation.slug}`}
                        className="hover:text-[#2D6A4F]"
                      >
                        {fa.accommodation.name}
                      </Link>
                    </h3>
                    <span className="block text-[11px] text-[#5A6B68]">
                      {fa.accommodation.beach.name}
                    </span>
                  </div>
                  <Link
                    href={`/accommodations/${fa.accommodation.slug}`}
                    className="text-xs font-bold text-[#2D6A4F] hover:underline"
                  >
                    View Rooms →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Reviews with Moderation Status */}
        <div>
          <h2 className="mb-4 font-serif text-xl font-bold text-[#1C2A28]">
            My Submitted Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#1C2A28]/20 bg-white p-6 text-center text-xs text-[#5A6B68]">
              You haven&apos;t written any reviews yet. Visit any beach or
              resort page to write a review!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => {
                const targetName =
                  r.beach?.name || r.accommodation?.name || "Target"
                return (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-[#1C2A28]/10 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1C2A28]">
                        Review for {targetName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-500">
                          ⭐ {r.rating} / 5
                        </span>
                        {r.status === "PENDING" && (
                          <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800">
                            🟡 Pending Moderation
                          </span>
                        )}
                        {r.status === "APPROVED" && (
                          <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800">
                            🟢 Approved & Live
                          </span>
                        )}
                        {r.status === "REJECTED" && (
                          <span className="rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-[10px] font-bold text-rose-800">
                            🔴 Rejected
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[#5A6B68]">
                      {r.comment}
                    </p>
                    <span className="mt-3 block text-[10px] text-[#5A6B68]/60">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
