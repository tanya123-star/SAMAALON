import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createReviewSchema } from "@/lib/validations/review";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const beachId = searchParams.get("beachId");
  const accommodationId = searchParams.get("accommodationId");
  const where: Record<string, string> = { status: "APPROVED" };
  if (beachId) where.beachId = beachId;
  if (accommodationId) where.accommodationId = accommodationId;
  const reviews = await prisma.review.findMany({ where: where as never, include: { user: true }, orderBy: { createdAt: "desc" }, take: 20 });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as unknown as { id: string }).id;
  if (!rateLimit(`review:${userId}`, 5, 60_000)) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const body = await req.json();
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { rating, comment, beachId, accommodationId } = parsed.data;

  // enforce 1 review per target per user (Phase 5 exit)
  const existing = await prisma.review.findFirst({ where: { userId, beachId: beachId ?? null, accommodationId: accommodationId ?? null } as never });
  if (existing) return NextResponse.json({ error: "Already reviewed this target" }, { status: 409 });

  const review = await prisma.$transaction(async (tx) => {
    const r = await tx.review.create({ data: { rating, comment, userId, beachId, accommodationId, status: "PENDING" } as never });
    // only APPROVED reviews affect avgRating — new review is PENDING, so aggregates stay on APPROVED only
    if (beachId) {
      const agg = await tx.review.aggregate({ where: { beachId, status: "APPROVED" }, _avg: { rating: true }, _count: { rating: true } });
      await tx.beach.update({ where: { id: beachId }, data: { avgRating: agg._avg.rating ?? null as never, reviewCount: agg._count.rating } });
    }
    if (accommodationId) {
      const agg = await tx.review.aggregate({ where: { accommodationId, status: "APPROVED" }, _avg: { rating: true }, _count: { rating: true } });
      await tx.accommodation.update({ where: { id: accommodationId }, data: { avgRating: agg._avg.rating ?? null as never, reviewCount: agg._count.rating } });
    }
    return r;
  });

  return NextResponse.json(review, { status: 201 });
}
