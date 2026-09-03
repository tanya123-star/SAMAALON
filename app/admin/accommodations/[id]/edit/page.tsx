import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { saveUploadedFile } from "@/lib/upload";
import { validateRemoteImageUrl } from "@/lib/imageUrl";
import { EditAccommodationForm } from "./EditAccommodationForm";

async function updateAccommodation(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.accommodation.findUnique({ where: { id }, include: { images: true } });
  if (!existing) throw new Error("Accommodation not found");

  const keptIds = formData.getAll("keptImageIds") as string[];
  const hasKeptInput = formData.has("keptImageIds");
  const existingFiltered = hasKeptInput
    ? (existing.images as unknown as { id: string; url: string }[]).filter((img) => keptIds.includes(img.id))
    : (existing.images as unknown as { id: string; url: string }[]);
  const existingUrls = existingFiltered.map((i) => i.url);

  const newUrlStr = String(formData.get("newRemoteUrls") ?? "").trim();
  const rawRemoteUrls = newUrlStr
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const newRemoteUrls: string[] = [];
  for (const s of rawRemoteUrls) {
    const v = validateRemoteImageUrl(s);
    if (!v.ok) throw new Error(v.error);
    newRemoteUrls.push(v.url);
  }

  const uploadedFiles = formData.getAll("newUploadedFiles") as File[];
  const newLocalPaths: string[] = [];
  for (const f of uploadedFiles) {
    if (!f || typeof (f as File).name !== "string" || (f as File).size === 0) continue;
    try {
      const path = await saveUploadedFile(f, { maxSize: 5 * 1024 * 1024 });
      newLocalPaths.push(path);
    } catch (e) {
      console.error("Upload error:", e);
    }
  }

  const allUrls = [...existingUrls, ...newRemoteUrls, ...newLocalPaths];

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
    maxGuests: formData.get("maxGuests") ? String(formData.get("maxGuests")) : undefined,
  };

  const parsed = (await import("@/lib/validations/accommodation")).accommodationSchema.safeParse({
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
        images: { deleteMany: {}, create: allUrls.map((url, i) => ({ url, sortOrder: i })) },
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
  revalidatePath(`/admin/accommodations/${id}/room-types`);
  redirect("/admin/accommodations");
}

export default async function EditAccommodationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [acc, beaches] = await Promise.all([
    prisma.accommodation.findUnique({ where: { id }, include: { images: true, beach: true } }),
    prisma.beach.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!acc) return <p className="p-4 text-sm">Accommodation not found</p>;

  const accommodationData = {
    id: acc.id,
    name: acc.name,
    slug: acc.slug,
    beachId: acc.beachId,
    description: acc.description,
    priceRange: acc.priceRange ?? null,
    facebookUrl: acc.facebookUrl,
    contactInfo: acc.contactInfo ?? null,
    checkInTime: acc.checkInTime ?? null,
    checkOutTime: acc.checkOutTime ?? null,
    maxGuests: acc.maxGuests != null ? String(acc.maxGuests) : null,
  };

  const beachOptions = beaches.map((b) => ({ id: b.id, name: b.name }));
  const initialImages = ((acc.images as unknown as { id: string; url: string }[]) || []).map((img) => ({
    id: img.id,
    url: img.url,
    isLocal: img.url.startsWith("/uploads/"),
  }));

  return (
    <div>
      <Link href="/admin/accommodations" className="text-sm text-muted-foreground hover:text-foreground">← Back to Accommodations</Link>
      <h1 className="mt-2 text-xl font-bold">Edit Accommodation: {acc.name}</h1>
      <EditAccommodationForm accommodation={accommodationData} beaches={beachOptions} initialImages={initialImages} updateAccommodation={updateAccommodation} />
    </div>
  );
}
