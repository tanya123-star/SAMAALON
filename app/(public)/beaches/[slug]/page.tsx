import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export default async function BeachDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const beach = await prisma.beach.findUnique({
    where: { slug },
    include: { accommodations: true, images: true, amenities: { include: { amenity: true } } },
  });
  if (!beach) notFound();

  const reviews = await prisma.review.findMany({ where: { beachId: beach.id }, include: { user: true }, orderBy: { createdAt: "desc" }, take: 5 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href="/beaches" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Beaches
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{beach.name}</h1>
      <p className="text-sm text-muted-foreground">{beach.location}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {beach.entranceFee ? <Badge>₱{String(beach.entranceFee)} entrance</Badge> : null}
        {beach.avgRating ? <Badge variant="secondary">★ {String(beach.avgRating)} ({beach.reviewCount} reviews)</Badge> : <Badge variant="secondary">No ratings yet</Badge>}
        {beach.googleMapsUrl ? (
          <a href={beach.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-7 items-center rounded-md border px-3 text-xs hover:bg-muted">
            📍 View on Google Maps
          </a>
        ) : null}
        <FavoriteButton beachId={beach.id} />
      </div>

      {beach.latitude && beach.longitude ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {String(beach.latitude)}, {String(beach.longitude)}
        </p>
      ) : null}

      <p className="mt-6 max-w-3xl text-sm leading-6">{beach.description}</p>

      {beach.amenities.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold">Amenities</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {beach.amenities.map((ba) => (
              <Badge key={ba.amenityId} variant="outline">
                {ba.amenity.name}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Accommodations at {beach.name}</h2>
        {beach.accommodations.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No accommodations listed for this beach yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {beach.accommodations.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link href={`/accommodations/${a.slug}`} className="hover:underline">
                      {a.name}
                    </Link>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{a.priceRange ?? "Contact for price"} · Up to {a.maxGuests ?? "—"} guests</p>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{a.description}</p>
                  <Link href={`/accommodations/${a.slug}`} className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
                    View details →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <div className="mt-4">
          <ReviewForm beachId={beach.id} />
        </div>
        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {reviews.map((r) => (
              <Card key={r.id}>
                <CardContent className="pt-4 text-sm">
                  <p className="font-medium">★ {r.rating} · {r.user.name ?? r.user.email}</p>
                  <p className="mt-1 text-muted-foreground">{r.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
