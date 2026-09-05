import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { beachSchema } from "@/lib/validations/beach"
import { searchParamsSchema } from "@/lib/validations/search"
import { Button } from "@/components/ui/button"
import { AdminSearchAutocomplete } from "@/components/admin/AdminSearchAutocomplete"

async function createBeach(formData: FormData) {
  "use server"
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    location: String(formData.get("location") ?? ""),
    description: String(formData.get("description") ?? ""),
    entranceFee: formData.get("entranceFee")
      ? String(formData.get("entranceFee"))
      : undefined,
    openingHours: String(formData.get("openingHours") ?? "") || undefined,
    contactInfo: String(formData.get("contactInfo") ?? "") || undefined,
    latitude: formData.get("latitude")
      ? String(formData.get("latitude"))
      : undefined,
    longitude: formData.get("longitude")
      ? String(formData.get("longitude"))
      : undefined,
    googleMapsUrl: String(formData.get("googleMapsUrl") ?? "") || undefined,
  }
  const parsed = beachSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)
  const d = parsed.data
  try {
    const amenities = formData.getAll("amenities") as string[]
    const photos = String(formData.get("photos") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    await prisma.beach.create({
      data: {
        name: d.name,
        slug: d.slug,
        location: d.location,
        description: d.description,
        entranceFee: d.entranceFee ?? (null as never),
        openingHours: d.openingHours,
        contactInfo: d.contactInfo,
        latitude: d.latitude ?? (null as never),
        longitude: d.longitude ?? (null as never),
        googleMapsUrl: d.googleMapsUrl || null,
        amenities: amenities.length
          ? { create: amenities.map((amenityId) => ({ amenityId })) }
          : undefined,
        images: photos.length
          ? { create: photos.map((url, i) => ({ url, sortOrder: i })) }
          : undefined,
      } as never,
    })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === "P2002") throw new Error("Slug already taken")
    throw e
  }
  revalidatePath("/admin/beaches")
  revalidatePath("/beaches")
  revalidatePath("/")
  revalidatePath("/admin")
}

async function deleteBeach(formData: FormData) {
  "use server"
  const id = String(formData.get("id") ?? "")
  if (!id) return
  const count = await prisma.accommodation.count({ where: { beachId: id } })
  if (count > 0)
    throw new Error(
      `Cannot delete: ${count} accommodation(s) still linked. Delete them first or cascade.`
    )
  await prisma.beach.delete({ where: { id } })
  revalidatePath("/admin/beaches")
  revalidatePath("/beaches")
  revalidatePath("/")
}

export default async function AdminBeachesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; q?: string }>
}) {
  const { error, q: rawQ } = await searchParams
  const parsed = searchParamsSchema.safeParse({ q: rawQ })
  const q = parsed.success ? parsed.data.q : undefined
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
          { location: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {}
  const [beaches, amenities] = await Promise.all([
    prisma.beach.findMany({
      where: where as never,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { accommodations: true } } },
    }),
    prisma.amenity.findMany({ orderBy: { name: "asc" } }),
  ])
  return (
    <div>
      <h1 className="text-xl font-bold">Manage Beaches</h1>
      {error ? (
        <p className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {decodeURIComponent(error)}
        </p>
      ) : null}
      <form
        action={createBeach}
        className="mt-4 grid gap-2 rounded-lg border p-4"
      >
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            name="name"
            placeholder="Name *"
            required
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="slug"
            placeholder="slug-like-this *"
            required
            pattern="[a-z0-9-]+"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="location"
            placeholder="Location *"
            required
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        <textarea
          name="description"
          placeholder="Description *"
          required
          className="rounded border px-2 py-1 text-sm"
          rows={2}
        />
        <div className="grid gap-2 sm:grid-cols-4">
          <input
            name="entranceFee"
            placeholder="Entrance Fee (e.g. 250)"
            type="number"
            step="0.01"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="openingHours"
            placeholder="Opening Hours (e.g. 6AM-5PM)"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="contactInfo"
            placeholder="Contact Info"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="googleMapsUrl"
            placeholder="Google Maps URL https://..."
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            name="latitude"
            placeholder="Latitude (e.g. 7.0907)"
            type="number"
            step="any"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="longitude"
            placeholder="Longitude (e.g. 125.6957)"
            type="number"
            step="any"
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        {amenities.length > 0 ? (
          <div>
            <p className="mb-1 text-xs font-medium">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {amenities.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-1 rounded border px-2 py-1 text-xs"
                >
                  <input type="checkbox" name="amenities" value={a.id} />
                  {a.name}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">
            No amenities seeded — add via `Amenity` table or use Beach.amenities
            array later.
          </p>
        )}
        <input
          name="photos"
          placeholder="Photo URLs comma-separated (https://... , https://...)"
          className="rounded border px-2 py-1 text-sm"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm"
        >
          Create Beach
        </button>
      </form>
      <form method="GET" className="mt-4 flex gap-2">
        <AdminSearchAutocomplete
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, slug, or location..."
          entity="beaches"
        />
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
        <a
          href="/admin/beaches"
          className="hover:bg-muted inline-flex h-7 items-center justify-center rounded-md border px-2.5 text-xs"
        >
          Clear
        </a>
      </form>
      {q ? (
        <p className="text-muted-foreground mt-2 text-xs">
          Showing {beaches.length} result{beaches.length === 1 ? "" : "s"} for
          &ldquo;{q}&rdquo;
        </p>
      ) : null}
      <div className="mt-6 space-y-2">
        {beaches.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between rounded border px-3 py-2 text-sm"
          >
            <span>
              {b.name} — {b.slug} — {b.location} — ₱
              {String(b.entranceFee ?? "—")} — {b._count.accommodations}{" "}
              accommodations
            </span>
            <div className="flex gap-1">
              <Link
                href={`/admin/beaches/${b.id}/edit`}
                className="hover:bg-muted rounded border px-2 py-1 text-xs"
              >
                Edit
              </Link>
              <form action={deleteBeach}>
                <input type="hidden" name="id" value={b.id} />
                <button
                  type="submit"
                  className="hover:bg-muted rounded border px-2 py-1 text-xs"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
