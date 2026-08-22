import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { accommodationSchema } from "@/lib/validations/accommodation";

async function updateAccommodation(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
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
    maxGuests: String(formData.get("maxGuests") ?? "") || undefined,
  };
  const parsed = accommodationSchema.safeParse({
    name: raw.name,
    slug: raw.slug,
    description: raw.description || raw.name,
    facebookUrl: raw.facebookUrl,
    beachId: raw.beachId,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  try {
    await prisma.accommodation.update({
      where: { id },
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
        maxGuests: raw.maxGuests ? Number(raw.maxGuests) : null as never,
      } as never,
    });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") throw new Error("Slug already taken");
    throw e;
  }
  revalidatePath("/admin/accommodations");
  revalidatePath("/accommodations");
  revalidatePath("/");
  redirect("/admin/accommodations");
}

export default async function EditAccommodationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [acc, beaches] = await Promise.all([
    prisma.accommodation.findUnique({ where: { id } }),
    prisma.beach.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!acc) return <p className="p-4 text-sm">Accommodation not found</p>;
  return (
    <div>
      <Link href="/admin/accommodations" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Accommodations
      </Link>
      <h1 className="mt-2 text-xl font-bold">Edit Accommodation: {acc.name}</h1>
      <form action={updateAccommodation} className="mt-4 grid gap-2 rounded-lg border p-4">
        <input type="hidden" name="id" value={acc.id} />
        <input name="name" defaultValue={acc.name} required className="rounded border px-2 py-1 text-sm" />
        <input name="slug" defaultValue={acc.slug} required pattern="[a-z0-9-]+" className="rounded border px-2 py-1 text-sm" />
        <select name="beachId" defaultValue={acc.beachId} required className="rounded border px-2 py-1 text-sm">
          {beaches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <textarea name="description" defaultValue={acc.description} required className="rounded border px-2 py-1 text-sm" rows={2} />
        <div className="grid gap-2 sm:grid-cols-4">
          <input name="priceRange" defaultValue={acc.priceRange ?? ""} placeholder="Price Range" className="rounded border px-2 py-1 text-sm" />
          <input name="facebookUrl" defaultValue={acc.facebookUrl} required className="rounded border px-2 py-1 text-sm" />
          <input name="contactInfo" defaultValue={acc.contactInfo ?? ""} placeholder="Contact Info" className="rounded border px-2 py-1 text-sm" />
          <input name="maxGuests" defaultValue={acc.maxGuests ? String(acc.maxGuests) : ""} placeholder="Max Guests" type="number" className="rounded border px-2 py-1 text-sm" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <input name="checkInTime" defaultValue={acc.checkInTime ?? ""} placeholder="Check-in" className="rounded border px-2 py-1 text-sm" />
          <input name="checkOutTime" defaultValue={acc.checkOutTime ?? ""} placeholder="Check-out" className="rounded border px-2 py-1 text-sm" />
        </div>
        <button type="submit" className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground">
          Save Changes
        </button>
      </form>
    </div>
  );
}
