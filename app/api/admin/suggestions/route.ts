import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  const role = (session?.user as unknown as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    return NextResponse.json({ suggestions: [] }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity");
  const qRaw = (searchParams.get("q") ?? "").trim();
  if (!qRaw || qRaw.length < 1) return NextResponse.json({ suggestions: [] });
  const q = qRaw.slice(0, 100);

  const take = 8;
  let suggestions: string[] = [];

  try {
    if (entity === "beaches") {
      const rows = await prisma.beach.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { location: { contains: q, mode: "insensitive" } },
          ],
        },
        take,
        orderBy: { createdAt: "desc" },
        select: { name: true, slug: true, location: true },
      });
      const set = new Set<string>();
      for (const r of rows) {
        if (r.name.toLowerCase().includes(q.toLowerCase())) set.add(r.name);
        if (r.slug.toLowerCase().includes(q.toLowerCase())) set.add(r.slug);
        if (r.location.toLowerCase().includes(q.toLowerCase())) set.add(r.location);
        if (set.size >= take) break;
      }
      // Fallback to names if nothing matched field-extracted but rows exist
      if (set.size === 0) rows.forEach((r) => set.add(r.name));
      suggestions = Array.from(set).slice(0, take);
    } else if (entity === "accommodations") {
      const rows = await prisma.accommodation.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { beach: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        take,
        orderBy: { createdAt: "desc" },
        include: { beach: { select: { name: true } } },
      } as never);
      const set = new Set<string>();
      for (const r of rows as unknown as { name: string; slug: string; beach: { name: string } }[]) {
        if (r.name.toLowerCase().includes(q.toLowerCase())) set.add(r.name);
        if (r.slug.toLowerCase().includes(q.toLowerCase())) set.add(r.slug);
        if (r.beach?.name.toLowerCase().includes(q.toLowerCase())) set.add(r.beach.name);
        if (set.size >= take) break;
      }
      if (set.size === 0) (rows as unknown as { name: string }[]).forEach((r) => set.add(r.name));
      suggestions = Array.from(set).slice(0, take);
    } else if (entity === "blog") {
      const rows = await prisma.blogPost.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        take,
        orderBy: { createdAt: "desc" },
        include: { category: { select: { name: true } } },
      } as never);
      const set = new Set<string>();
      for (const r of rows as unknown as { title: string; slug: string; category: { name: string } | null }[]) {
        if (r.title.toLowerCase().includes(q.toLowerCase())) set.add(r.title);
        if (r.slug.toLowerCase().includes(q.toLowerCase())) set.add(r.slug);
        if (r.category?.name.toLowerCase().includes(q.toLowerCase())) set.add(r.category.name);
        if (set.size >= take) break;
      }
      if (set.size === 0) (rows as unknown as { title: string }[]).forEach((r) => set.add(r.title));
      suggestions = Array.from(set).slice(0, take);
    } else if (entity === "reviews") {
      const rows = await prisma.review.findMany({
        where: {
          OR: [
            { comment: { contains: q, mode: "insensitive" } },
            { user: { name: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { beach: { name: { contains: q, mode: "insensitive" } } },
            { accommodation: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        take,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } }, beach: { select: { name: true } }, accommodation: { select: { name: true } } },
      } as never);
      const set = new Set<string>();
      for (const r of rows as unknown as { comment: string; user: { name: string | null; email: string }; beach: { name: string } | null; accommodation: { name: string } | null }[]) {
        if (r.user?.name?.toLowerCase().includes(q.toLowerCase())) set.add(r.user.name);
        else if (r.user?.email.toLowerCase().includes(q.toLowerCase())) set.add(r.user.email);
        if (r.beach?.name.toLowerCase().includes(q.toLowerCase())) set.add(r.beach.name);
        if (r.accommodation?.name.toLowerCase().includes(q.toLowerCase())) set.add(r.accommodation.name);
        if (r.comment.toLowerCase().includes(q.toLowerCase())) {
          const snippet = r.comment.length > 50 ? r.comment.slice(0, 50) + "…" : r.comment;
          set.add(snippet);
        }
        if (set.size >= take) break;
      }
      suggestions = Array.from(set).slice(0, take);
    }
  } catch {
    suggestions = [];
  }

  return NextResponse.json({ suggestions });
}
