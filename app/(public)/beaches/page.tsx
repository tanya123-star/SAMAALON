import { prisma } from "@/lib/prisma";
import { searchParamsSchema } from "@/lib/validations/search";
import { BeachCard } from "@/components/beaches/BeachCard";
import { BeachFilters } from "@/components/beaches/BeachFilters";

export default async function BeachesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const parsed = searchParamsSchema.safeParse(raw);
  const { q, location } = parsed.success ? parsed.data : {};

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }
  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  const beaches = await prisma.beach.findMany({ where: where as never, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Beaches</h1>
      <p className="mt-1 text-sm text-muted-foreground">Search by name, location — filters via Prisma where (amenities/rating added Phase 3.9).</p>
      <div className="mt-6">
        <BeachFilters />
      </div>
      {beaches.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No beaches match filters.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beaches.map((b) => (
            <BeachCard key={b.id} beach={b as never} />
          ))}
        </div>
      )}
    </div>
  );
}
