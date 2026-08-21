import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const userId = (session.user as unknown as { id: string }).id;
  const isOwner = review.userId === userId;
  const isAdmin = role === "ADMIN";
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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

  return NextResponse.json({ ok: true });
}
