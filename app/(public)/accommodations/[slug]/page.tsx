import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { BookNowButton } from "@/components/booking/BookNowButton";

export default async function AccommodationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const acc = await prisma.accommodation.findUnique({
    where: { slug },
    include: { beach: true, roomTypes: true, images: true, amenities: { include: { amenity: true } } },
  });
  if (!acc) notFound();

  const reviews = await prisma.review.findMany({ where: { accommodationId: acc.id }, include: { user: true }, orderBy: { createdAt: "desc" }, take: 5 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href={`/beaches/${acc.beach.slug}`} className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to {acc.beach.name}
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{acc.name}</h1>
      <p className="text-sm text-muted-foreground">
        {acc.beach.name} · {acc.beach.location}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {acc.priceRange ? <Badge>{acc.priceRange}</Badge> : null}
        {acc.maxGuests ? <Badge variant="secondary">Up to {acc.maxGuests} guests</Badge> : null}
        {acc.avgRating ? <Badge variant="outline">★ {String(acc.avgRating)}</Badge> : <Badge variant="outline">No ratings</Badge>}
        <FavoriteButton accommodationId={acc.id} />
      </div>

      <p className="mt-6 max-w-3xl text-sm leading-6">{acc.description}</p>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        {acc.checkInTime ? (
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Check-in</p>
              <p className="font-medium">{acc.checkInTime}</p>
            </CardContent>
          </Card>
        ) : null}
        {acc.checkOutTime ? (
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Check-out</p>
              <p className="font-medium">{acc.checkOutTime}</p>
            </CardContent>
          </Card>
        ) : null}
        {acc.contactInfo ? (
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Contact</p>
              <p className="font-medium">{acc.contactInfo}</p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {acc.amenities.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold">Amenities</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {acc.amenities.map((a) => (
              <Badge key={a.amenityId} variant="outline">
                {a.amenity.name}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Room Types</h2>
        {acc.roomTypes.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No room types listed yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {acc.roomTypes.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <CardTitle className="text-base">{r.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-muted-foreground">{r.description ?? "No description"}</p>
                  <p className="mt-2 font-medium">₱{String(r.price)} {r.maxGuests ? `· ${r.maxGuests} guests` : ""}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <BookNowButton facebookUrl={acc.facebookUrl} accommodationName={acc.name} />
        <span className="inline-flex h-9 items-center text-xs text-muted-foreground">{session ? "Opens Facebook in new tab" : "Google login required"}</span>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <div className="mt-4">
          <ReviewForm accommodationId={acc.id} />
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

      {acc.beach.googleMapsUrl ? (
        <div className="mt-8">
          <a href={acc.beach.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
            📍 View {acc.beach.name} on Google Maps →
          </a>
        </div>
      ) : null}
    </div>
  );
}
