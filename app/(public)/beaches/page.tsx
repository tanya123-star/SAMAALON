import { prisma } from "@/lib/prisma"
import { searchParamsSchema } from "@/lib/validations/search"
import { BeachCard } from "@/components/beaches/BeachCard"
import { BeachFilters } from "@/components/beaches/BeachFilters"

export default async function BeachesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const parsed = searchParamsSchema.safeParse(raw)
  const { q, location } = parsed.success ? parsed.data : {}

  const where: Record<string, unknown> = {}
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ]
  }
  if (location) {
    where.location = { contains: location, mode: "insensitive" }
  }

  const beaches = await prisma.beach.findMany({
    where: where as never,
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* Header Banner */}
      <section className="border-b border-[#1C2A28]/10 bg-white px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold tracking-widest text-[#2D6A4F] uppercase">
            Samal Directory
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#1C2A28] sm:text-5xl">
            Beaches & Coastal Coves
          </h1>
          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-[#5A6B68] sm:text-sm">
            Browse pristine public beach parks, secluded limestone coves, and
            luxury resort shorelines across the Island Garden City of Samal.
          </p>
        </div>
      </section>

      {/* Docking Filter Bar */}
      <BeachFilters />

      {/* Grid List */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
        {beaches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1C2A28]/20 bg-white p-12 text-center">
            <div className="mb-3 text-3xl">🏖️</div>
            <h3 className="font-serif text-lg font-bold text-[#1C2A28]">
              No beaches found
            </h3>
            <p className="mt-1 text-xs text-[#5A6B68]">
              Try adjusting your search keywords or district filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {beaches.map((b) => (
              <BeachCard key={b.id} beach={b as never} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
