import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, include: { category: true } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Travel Guides</h1>
      <p className="mt-1 text-sm text-muted-foreground">Guides for Samal Island — beaches, accommodations, transport.</p>
      {categories.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Badge key={c.id} variant="secondary">
              {c.name}
            </Badge>
          ))}
        </div>
      ) : null}
      {posts.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No guides published yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  <Link href={`/blog/${p.slug}`} className="hover:underline">
                    {p.title}
                  </Link>
                </CardTitle>
                {p.category ? <p className="text-xs text-muted-foreground">{p.category.name}</p> : null}
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{p.content.slice(0, 160)}…</p>
                <p className="mt-3 text-xs text-muted-foreground">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ""}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
