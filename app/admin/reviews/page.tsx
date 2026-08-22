import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function updateReviewStatus(formData: FormData) {
  "use server";
  const session = await auth();
  const moderatedBy = (session?.user as unknown as { id?: string })?.id;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return;

  await prisma.$transaction(async (tx) => {
    await tx.review.update({ where: { id }, data: { status: status as "PENDING" | "APPROVED" | "REJECTED", moderatedBy: moderatedBy ?? null as never } });

    // Recalculate average ratings for approved reviews only
    if (review.beachId) {
      const agg = await tx.review.aggregate({
        where: { beachId: review.beachId, status: "APPROVED" },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await tx.beach.update({
        where: { id: review.beachId },
        data: { avgRating: agg._avg.rating ?? (null as never), reviewCount: agg._count.rating },
      });
    }
    if (review.accommodationId) {
      const agg = await tx.review.aggregate({
        where: { accommodationId: review.accommodationId, status: "APPROVED" },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await tx.accommodation.update({
        where: { id: review.accommodationId },
        data: { avgRating: agg._avg.rating ?? (null as never), reviewCount: agg._count.rating },
      });
    }
  });

  revalidatePath("/admin/reviews");
  if (review.beachId) revalidatePath(`/beaches/${review.beachId}`);
  if (review.accommodationId) revalidatePath(`/accommodations/${review.accommodationId}`);
  revalidatePath("/beaches");
  revalidatePath("/");
}

async function deleteReview(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return;
  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id } });
    if (review.beachId) {
      const agg = await tx.review.aggregate({
        where: { beachId: review.beachId, status: "APPROVED" },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await tx.beach.update({
        where: { id: review.beachId },
        data: { avgRating: agg._avg.rating ?? (null as never), reviewCount: agg._count.rating },
      });
    }
    if (review.accommodationId) {
      const agg = await tx.review.aggregate({
        where: { accommodationId: review.accommodationId, status: "APPROVED" },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await tx.accommodation.update({
        where: { id: review.accommodationId },
        data: { avgRating: agg._avg.rating ?? (null as never), reviewCount: agg._count.rating },
      });
    }
  });
  revalidatePath("/admin/reviews");
  if (review.beachId) revalidatePath(`/beaches/${review.beachId}`);
  if (review.accommodationId) revalidatePath(`/accommodations/${review.accommodationId}`);
  revalidatePath("/beaches");
  revalidatePath("/");
}

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const where = status && ["PENDING", "APPROVED", "REJECTED"].includes(status) ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : {};
  const reviews = await prisma.review.findMany({
    where,
    include: { user: true, beach: true, accommodation: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#1C2A28]">Review Moderation Queue</h1>
        <p className="text-xs text-[#5A6B68]">Approve pending reviews to publish them on the public site or reject/delete spam.</p>
        <div className="mt-3 flex gap-2 text-xs">
          <a href="/admin/reviews" className={`rounded-full border px-3 py-1 ${!status ? "bg-[#1C2A28] text-white" : "hover:bg-muted"}`}>
            All
          </a>
          <a href="/admin/reviews?status=PENDING" className={`rounded-full border px-3 py-1 ${status === "PENDING" ? "bg-amber-500 text-white" : "hover:bg-muted"}`}>
            Pending
          </a>
          <a href="/admin/reviews?status=APPROVED" className={`rounded-full border px-3 py-1 ${status === "APPROVED" ? "bg-emerald-600 text-white" : "hover:bg-muted"}`}>
            Approved
          </a>
          <a href="/admin/reviews?status=REJECTED" className={`rounded-full border px-3 py-1 ${status === "REJECTED" ? "bg-rose-600 text-white" : "hover:bg-muted"}`}>
            Rejected
          </a>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-[#5A6B68] rounded-xl border border-dashed p-8 text-center bg-white">No reviews in queue.</p>
        ) : null}

        {reviews.map((r) => {
          const targetName = r.beach?.name || r.accommodation?.name || "Unspecified";
          return (
            <div key={r.id} className="rounded-2xl border border-[#1C2A28]/10 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-sm">⭐ {r.rating} / 5</span>
                  <span className="text-xs font-bold text-[#1C2A28]">{r.user.name || r.user.email}</span>
                  <span className="text-xs text-[#5A6B68]">for <strong className="text-[#2D6A4F]">{targetName}</strong></span>
                </div>
                <p className="text-xs text-[#5A6B68] leading-relaxed">{r.comment}</p>
                <div className="pt-1 flex items-center gap-2">
                  {r.status === "PENDING" && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                      🟡 Pending Moderation
                    </span>
                  )}
                  {r.status === "APPROVED" && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                      🟢 Approved & Live
                    </span>
                  )}
                  {r.status === "REJECTED" && (
                    <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-300">
                      🔴 Rejected
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {r.status !== "APPROVED" && (
                  <form action={updateReviewStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="APPROVED" />
                    <button type="submit" className="rounded-full bg-[#2D6A4F] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1C2A28] transition-all">
                      Approve
                    </button>
                  </form>
                )}

                {r.status !== "REJECTED" && (
                  <form action={updateReviewStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="REJECTED" />
                    <button type="submit" className="rounded-full bg-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition-all">
                      Reject
                    </button>
                  </form>
                )}

                <form action={deleteReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-all">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
