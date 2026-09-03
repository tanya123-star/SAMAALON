import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { beachSchema } from "@/lib/validations/beach";
import Link from "next/link";
import { saveUploadedFile } from "@/lib/upload";
import { validateRemoteImageUrl } from "@/lib/imageUrl";
import { EditBeachForm } from "./EditBeachForm";

async function updateBeach(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.beach.findUnique({ where: { id }, include: { images: true } });
  if (!existing) throw new Error("Beach not found");

  // --- kept ids from client (optimistic removal) ---
  const keptIds = formData.getAll("keptImageIds") as string[];
  const existingFiltered = keptIds.length ? (existing.images as unknown as { id: string; url: string }[]).filter((img) => keptIds.includes(img.id)) : existing.images as unknown as { id: string; url: string }[];
  // If client sent no keptImageIds at all (JS disabled), keep all
  const hasKeptInput = formData.has("keptImageIds");
  const effectiveExisting = hasKeptInput ? existingFiltered : (existing.images as unknown as { id: string; url: string }[]);
  const existingUrls = effectiveExisting.map((i) => i.url);

  // --- new remote URLs from textarea ---
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

  // --- uploaded files from <input type=file multiple> ---
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

  // --- build final image list: keep existing + add new ---
  const allUrls = [...existingUrls, ...newRemoteUrls, ...newLocalPaths];

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
        images: { deleteMany: {}, create: allUrls.map((url, i) => ({ url, sortOrder: i })) },
      } as never,
    });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") throw new Error("Slug already taken");
    throw e;
  }
  revalidatePath("/admin/beaches");
  revalidatePath("/beaches");
  revalidatePath("/");
  revalidatePath(`/beaches/${d.slug}`);
  redirect("/admin/beaches");
}

export default async function EditBeachPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beach = await prisma.beach.findUnique({ where: { id }, include: { images: true } });
  if (!beach) return <p className="p-4 text-sm">Beach not found</p>;

  const beachData = {
    id: beach.id,
    name: beach.name,
    slug: beach.slug,
    location: beach.location,
    description: beach.description,
    entranceFee: beach.entranceFee != null ? String(beach.entranceFee) : null,
    openingHours: beach.openingHours ?? null,
    contactInfo: beach.contactInfo ?? null,
    googleMapsUrl: beach.googleMapsUrl ?? null,
    latitude: beach.latitude != null ? String(beach.latitude) : null,
    longitude: beach.longitude != null ? String(beach.longitude) : null,
  };

  const initialImages = ((beach.images as unknown as { id: string; url: string }[]) || []).map((img) => ({
    id: img.id,
    url: img.url,
    isLocal: img.url.startsWith("/uploads/"),
  }));

  return (
    <div>
      <Link href="/admin/beaches" className="text-sm text-muted-foreground hover:text-foreground">← Back to Beaches</Link>
      <h1 className="mt-2 text-xl font-bold">Edit Beach: {beach.name}</h1>
      <EditBeachForm beach={beachData} initialImages={initialImages} updateBeach={updateBeach} />
    </div>
  );
}
