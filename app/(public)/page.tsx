import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function HomePage() {
  const [featuredBeaches, popularAccommodations, latestPosts] = await Promise.all([
    prisma.beach.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    prisma.accommodation.findMany({ take: 6, include: { beach: true }, orderBy: { createdAt: "desc" } }),
    prisma.blogPost.findMany({ where: { published: true }, take: 3, orderBy: { publishedAt: "desc" } }),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Discover Samal Island — beaches, stays & guides
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Minimalist discovery platform. Browse beaches, accommodations, maps and travel guides. Save favorites with Google — booking via Facebook, no in-site reservations.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/beaches" className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
              Explore Beaches
            </Link>
            <Link href="/blog" className="inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium">
              Read Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Beaches */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Beaches</h2>
          <Link href="/beaches" className="text-sm text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        {featuredBeaches.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No beaches yet — add via admin.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBeaches.map((b) => (
              <Card key={b.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <Link href={`/beaches/${b.slug}`} className="hover:underline">
                      {b.name}
                    </Link>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{b.location}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="line-clamp-2 text-muted-foreground">{b.description}</p>
                  <div className="flex items-center gap-2">
                    {b.entranceFee ? <Badge variant="secondary">₱{b.entranceFee.toString()} entry</Badge> : null}
                    {b.googleMapsUrl ? (
                      <a href={b.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        Maps →
                      </a>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Popular Accommodations */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <h2 className="text-xl font-semibold">Popular Accommodations</h2>
        {popularAccommodations.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No accommodations yet.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularAccommodations.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link href={`/accommodations/${a.slug}`} className="hover:underline">
                      {a.name}
                    </Link>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{a.beach.name} · {a.priceRange ?? "Contact for price"}</p>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{a.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Latest Blog */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest Guides</h2>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">View all →</Link>
        </div>
        {latestPosts.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No guides yet.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {latestPosts.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">
                    <Link href={`/blog/${p.slug}`} className="hover:underline">
                      {p.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{p.content.slice(0, 140)}…</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* About Samal */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h2 className="text-xl font-semibold">About Samal Island</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Samal Island, Davao del Norte — white-sand beaches, clear waters, and island culture a short ferry from Davao City. Explore geography, how to get there, and things to do via our guides.
          </p>
          <Link href="/about" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Learn more →
          </Link>
        </div>
      </section>
    </div>
  );
}
