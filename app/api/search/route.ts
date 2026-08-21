import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchParamsSchema } from "@/lib/validations/search";

export async function GET(req: NextRequest) {
  const raw = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = searchParamsSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { q } = parsed.data;
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
          { location: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [beaches, accommodations, posts] = await Promise.all([
    prisma.beach.findMany({ where: where as never, take: 5 }),
    prisma.accommodation.findMany({ where: where as never, take: 5 }),
    prisma.blogPost.findMany({ where: q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }] } : {}, take: 5 }),
  ]);

  return NextResponse.json({ beaches, accommodations, posts });
}
