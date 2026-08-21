import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function deleteReview(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return;
  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id } });
    if (review.beachId) {
      const agg = await tx.review.aggregate({ where: { beachId: review.beachId }, _avg: { rating: true }, _count: { rating: true } });
      await tx.beach.update({ where: { id: review.beachId }, data: { avgRating: agg._avg.rating ?? null as never, reviewCount: agg._count.rating } });
    }
    if (review.accommodationId) {
      const agg = await tx.review.aggregate({ where: { accommodationId: review.accommodationId }, _avg: { rating: true }, _count: { rating: true } });
      await tx.accommodation.update({ where: { id: review.accommodationId }, data: { avgRating: agg._avg.rating ?? null as never, reviewCount: agg._count.rating } });
    }
  });
  revalidatePath("/admin/reviews");
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ include: { user: true, beach: true, accommodation: true }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div>
      <h1 className="text-xl font-bold">Moderate Reviews</h1>
      <p className="text-sm text-muted-foreground">Admin can delete any review. Avg ratings auto-recalc.</p>
      <div className="mt-6 space-y-3">
        {reviews.length === 0 ? <p className="text-sm text-muted-foreground">No reviews.</p> : null}
        {reviews.map((r) => (
          <div key={r.id} className="rounded border p-3 text-sm">
            <p className="font-medium">★ {r.rating} · {r.user.name ?? r.user.email} · {r.beach?.name ?? r.accommodation?.name ?? "—"}</p>
            <p className="mt-1 text-muted-foreground">{r.comment}</p>
            <form action={deleteReview} className="mt-2">
              <input type="hidden" name="id" value={r.id} />
              <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
