import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const qRaw = (searchParams.get("q") ?? "").trim();
  if (!qRaw || qRaw.length < 1) return NextResponse.json({ suggestions: [] });
  const q = qRaw.slice(0, 100);

  try {
    const rows = await prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { category: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 8,
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true },
    });
    const suggestions = rows.map((r) => ({ title: r.title, slug: r.slug }));
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
