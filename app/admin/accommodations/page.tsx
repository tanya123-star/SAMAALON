import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { accommodationSchema } from "@/lib/validations/accommodation"
import { searchParamsSchema } from "@/lib/validations/search"
import { Button } from "@/components/ui/button"
import { AdminSearchAutocomplete } from "@/components/admin/AdminSearchAutocomplete"

async function createAccommodation(formData: FormData) {
  "use server"
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    beachId: String(formData.get("beachId") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    description: String(formData.get("description") ?? ""),
    priceRange: String(formData.get("priceRange") ?? "") || undefined,
    contactInfo: String(formData.get("contactInfo") ?? "") || undefined,
    checkInTime: String(formData.get("checkInTime") ?? "") || undefined,
    checkOutTime: String(formData.get("checkOutTime") ?? "") || undefined,
    maxGuests: formData.get("maxGuests")
      ? String(formData.get("maxGuests"))
      : undefined,
  }
  // coerce maxGuests
  const toValidate: Record<string, unknown> = { ...raw }
  if (raw.maxGuests) toValidate.maxGuests = Number(raw.maxGuests)
  // validate core via accommodationSchema (name/slug/facebookUrl/beachId)
  const parsed = accommodationSchema.safeParse({
    name: raw.name,
    slug: raw.slug,
    description: raw.description || raw.name,
    facebookUrl: raw.facebookUrl,
    beachId: raw.beachId,
  })
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)
  try {
    const amenities = formData.getAll("amenities") as string[]
    const photos = String(formData.get("photos") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    await prisma.accommodation.create({
      data: {
        name: raw.name,
        slug: raw.slug,
        beachId: raw.beachId,
        facebookUrl: raw.facebookUrl,
        description: raw.description || raw.name,
        priceRange: raw.priceRange,
        contactInfo: raw.contactInfo,
        checkInTime: raw.checkInTime,
        checkOutTime: raw.checkOutTime,
        maxGuests: raw.maxGuests ? Number(raw.maxGuests) : (null as never),
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
  revalidatePath("/admin/accommodations")
  revalidatePath("/accommodations")
  revalidatePath("/")
}

async function deleteAccommodation(formData: FormData) {
  "use server"
  const id = String(formData.get("id") ?? "")
  if (!id) return
  await prisma.accommodation.delete({ where: { id } })
  revalidatePath("/admin/accommodations")
  revalidatePath("/accommodations")
  revalidatePath("/")
}

export default async function AdminAccommodationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; q?: string; beachId?: string }>
}) {
  const { error, q: rawQ, beachId: rawBeachId } = await searchParams
  const parsed = searchParamsSchema.safeParse({ q: rawQ })
  const q = parsed.success ? parsed.data.q : undefined
  const beachId = rawBeachId?.trim() || undefined
  const where = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { slug: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
              {
                beach: { name: { contains: q, mode: "insensitive" as const } },
              },
            ],
          }
        : {},
      beachId ? { beachId } : {},
    ],
  }
  const [accommodations, beaches, amenities] = await Promise.all([
    prisma.accommodation.findMany({
      where: where as never,
      include: { beach: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.beach.findMany({ orderBy: { name: "asc" } }),
    prisma.amenity.findMany({ orderBy: { name: "asc" } }),
  ])
  return (
    <div>
      <h1 className="text-xl font-bold">Manage Accommodations</h1>
      {error ? (
        <p className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {decodeURIComponent(error)}
        </p>
      ) : null}
      <form
        action={createAccommodation}
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
            placeholder="slug *"
            required
            pattern="[a-z0-9-]+"
            className="rounded border px-2 py-1 text-sm"
          />
          <select
            name="beachId"
            required
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="">Select Beach *</option>
            {beaches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
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
            name="priceRange"
            placeholder="Price Range (e.g. ₱2,500 - ₱6,500)"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="facebookUrl"
            placeholder="Facebook URL https://... *"
            required
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="contactInfo"
            placeholder="Contact Info"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="maxGuests"
            placeholder="Max Guests"
            type="number"
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            name="checkInTime"
            placeholder="Check-in (e.g. 2:00 PM)"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="checkOutTime"
            placeholder="Check-out (e.g. 12:00 PM)"
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
        ) : null}
        <input
          name="photos"
          placeholder="Photo URLs comma-separated"
          className="rounded border px-2 py-1 text-sm"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm"
        >
          Create Accommodation
        </button>
      </form>
      <form method="GET" className="mt-4 flex gap-2">
        <AdminSearchAutocomplete
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, slug, description, beach..."
          entity="accommodations"
        />
        <select
          name="beachId"
          defaultValue={beachId ?? ""}
          className="border-input h-8 rounded-lg border bg-transparent px-2.5 text-sm"
        >
          <option value="">All Beaches</option>
          {beaches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
        <a
          href="/admin/accommodations"
          className="hover:bg-muted inline-flex h-7 items-center justify-center rounded-md border px-2.5 text-xs"
        >
          Clear
        </a>
      </form>
      {q || beachId ? (
        <p className="text-muted-foreground mt-2 text-xs">
          Showing {accommodations.length} result
          {accommodations.length === 1 ? "" : "s"}
          {q ? ` for “${q}”` : ""}
          {beachId
            ? ` in ${beaches.find((b) => b.id === beachId)?.name ?? "beach"}`
            : ""}
        </p>
      ) : null}
      <div className="mt-6 space-y-2">
        {accommodations.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded border px-3 py-2 text-sm"
          >
            <span>
              {a.name} — {a.slug} — {a.beach.name} — {a.priceRange ?? "—"}
            </span>
            <div className="flex gap-1">
              <Link
                href={`/admin/accommodations/${a.id}/edit`}
                className="hover:bg-muted rounded border px-2 py-1 text-xs"
              >
                Edit
              </Link>
              <form action={deleteAccommodation}>
                <input type="hidden" name="id" value={a.id} />
                <button
                  type="submit"
                  className="hover:bg-muted rounded border px-2 py-1 text-xs"
                >
                  Delete
                </button>
              </form>
              <Link
                href={`/admin/accommodations/${a.id}/room-types`}
                className="hover:bg-muted rounded border px-2 py-1 text-xs"
              >
                Rooms
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
