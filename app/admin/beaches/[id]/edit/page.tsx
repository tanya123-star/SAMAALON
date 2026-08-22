import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { beachSchema } from "@/lib/validations/beach";
import Link from "next/link";

async function updateBeach(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    location: String(formData.get("location") ?? ""),
    description: String(formData.get("description") ?? ""),
    entranceFee: formData.get("entranceFee") ? String(formData.get("entranceFee")) : undefined,
    openingHours: String(formData.get("openingHours") ?? "") || undefined,
    contactInfo: String(formData.get("contactInfo") ?? "") || undefined,
    latitude: formData.get("latitude") ? String(formData.get("latitude")) : undefined,
    longitude: formData.get("longitude") ? String(formData.get("longitude")) : undefined,
    googleMapsUrl: String(formData.get("googleMapsUrl") ?? "") || undefined,
  };
  const parsed = beachSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const d = parsed.data;
  try {
    await prisma.beach.update({
      where: { id },
      data: {
        name: d.name,
        slug: d.slug,
        location: d.location,
        description: d.description,
        entranceFee: d.entranceFee ?? null as never,
        openingHours: d.openingHours,
        contactInfo: d.contactInfo,
        latitude: d.latitude ?? null as never,
        longitude: d.longitude ?? null as never,
        googleMapsUrl: d.googleMapsUrl || null,
      } as never,
    });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") throw new Error("Slug already taken");
    throw e;
  }
  revalidatePath("/admin/beaches");
  revalidatePath("/beaches");
  revalidatePath(`/beaches/${d.slug}`);
  revalidatePath("/");
  redirect("/admin/beaches");
}

export default async function EditBeachPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beach = await prisma.beach.findUnique({ where: { id } });
  if (!beach) return <p className="p-4 text-sm">Beach not found</p>;
  return (
    <div>
      <Link href="/admin/beaches" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Beaches
      </Link>
      <h1 className="mt-2 text-xl font-bold">Edit Beach: {beach.name}</h1>
      <form action={updateBeach} className="mt-4 grid gap-2 rounded-lg border p-4">
        <input type="hidden" name="id" value={beach.id} />
        <input name="name" defaultValue={beach.name} required className="rounded border px-2 py-1 text-sm" />
        <input name="slug" defaultValue={beach.slug} required pattern="[a-z0-9-]+" className="rounded border px-2 py-1 text-sm" />
        <input name="location" defaultValue={beach.location} required className="rounded border px-2 py-1 text-sm" />
        <textarea name="description" defaultValue={beach.description} required className="rounded border px-2 py-1 text-sm" rows={2} />
        <div className="grid gap-2 sm:grid-cols-4">
          <input name="entranceFee" defaultValue={beach.entranceFee ? String(beach.entranceFee) : ""} placeholder="Entrance Fee" type="number" step="0.01" className="rounded border px-2 py-1 text-sm" />
          <input name="openingHours" defaultValue={beach.openingHours ?? ""} placeholder="Opening Hours" className="rounded border px-2 py-1 text-sm" />
          <input name="contactInfo" defaultValue={beach.contactInfo ?? ""} placeholder="Contact Info" className="rounded border px-2 py-1 text-sm" />
          <input name="googleMapsUrl" defaultValue={beach.googleMapsUrl ?? ""} placeholder="Google Maps URL" className="rounded border px-2 py-1 text-sm" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <input name="latitude" defaultValue={beach.latitude ? String(beach.latitude) : ""} placeholder="Latitude" type="number" step="any" className="rounded border px-2 py-1 text-sm" />
          <input name="longitude" defaultValue={beach.longitude ? String(beach.longitude) : ""} placeholder="Longitude" type="number" step="any" className="rounded border px-2 py-1 text-sm" />
        </div>
        <button type="submit" className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground">
          Save Changes
        </button>
      </form>
    </div>
  );
}
