import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");
  const userId = (session.user as unknown as { id: string }).id;
  const [beaches, accommodations] = await Promise.all([
    prisma.favoriteBeach.findMany({ where: { userId }, include: { beach: true } }),
    prisma.favoriteAccommodation.findMany({ where: { userId }, include: { accommodation: true } }),
  ]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Favorites</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="font-semibold">Beaches</h2>
          {beaches.length === 0 ? <p className="text-sm text-muted-foreground">No beach favorites.</p> : beaches.map((f) => (
            <Card key={f.beachId} className="mt-2"><CardHeader><CardTitle className="text-base"><Link href={`/beaches/${f.beach.slug}`} className="hover:underline">{f.beach.name}</Link></CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{f.beach.location}</CardContent></Card>
          ))}
        </div>
        <div>
          <h2 className="font-semibold">Accommodations</h2>
          {accommodations.length === 0 ? <p className="text-sm text-muted-foreground">No accommodation favorites.</p> : accommodations.map((f) => (
            <Card key={f.accommodationId} className="mt-2"><CardHeader><CardTitle className="text-base"><Link href={`/accommodations/${f.accommodation.slug}`} className="hover:underline">{f.accommodation.name}</Link></CardTitle></CardHeader></Card>
          ))}
        </div>
      </div>
    </div>
  );
}
