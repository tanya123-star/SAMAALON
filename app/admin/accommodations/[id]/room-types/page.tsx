import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { roomTypeSchema } from "@/lib/validations/roomType";

async function createRoomType(formData: FormData) {
  "use server";
  const accommodationId = String(formData.get("accommodationId") ?? "");
  const raw = {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    price: String(formData.get("price") ?? ""),
    maxGuests: String(formData.get("maxGuests") ?? "") || undefined,
    amenities: String(formData.get("amenities") ?? "") || undefined,
    accommodationId,
  };
  const parsed = roomTypeSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  try {
    await prisma.roomType.create({ data: parsed.data as never });
  } catch (e: unknown) {
    throw e;
  }
  revalidatePath(`/admin/accommodations/${accommodationId}/room-types`);
  revalidatePath(`/accommodations`);
  revalidatePath("/");
}

async function deleteRoomType(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const accommodationId = String(formData.get("accommodationId") ?? "");
  if (!id) return;
  await prisma.roomType.delete({ where: { id } });
  revalidatePath(`/admin/accommodations/${accommodationId}/room-types`);
}

export default async function RoomTypesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: accommodationId } = await params;
  const [acc, roomTypes] = await Promise.all([
    prisma.accommodation.findUnique({ where: { id: accommodationId }, include: { beach: true } }),
    prisma.roomType.findMany({ where: { accommodationId }, orderBy: { name: "asc" } }),
  ]);
  if (!acc) return <p className="p-4 text-sm">Accommodation not found</p>;
  return (
    <div>
      <Link href="/admin/accommodations" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Accommodations
      </Link>
      <h1 className="mt-2 text-xl font-bold">Room Types: {acc.name} ({acc.beach.name})</h1>
      <form action={createRoomType} className="mt-4 grid gap-2 rounded-lg border p-4">
        <input type="hidden" name="accommodationId" value={accommodationId} />
        <input name="name" placeholder="Name (e.g. Deluxe)" required className="rounded border px-2 py-1 text-sm" />
        <textarea name="description" placeholder="Description" className="rounded border px-2 py-1 text-sm" rows={2} />
        <div className="grid gap-2 sm:grid-cols-3">
          <input name="price" placeholder="Price * (e.g. 3200)" type="number" step="0.01" required className="rounded border px-2 py-1 text-sm" />
          <input name="maxGuests" placeholder="Max Guests" type="number" className="rounded border px-2 py-1 text-sm" />
          <input name="amenities" placeholder="Amenities (comma separated)" className="rounded border px-2 py-1 text-sm" />
        </div>
        <button type="submit" className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground">
          Create Room Type
        </button>
      </form>
      <div className="mt-6 space-y-2">
        {roomTypes.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
            <span>
              {r.name} — ₱{String(r.price)} — {r.maxGuests ? `${r.maxGuests} guests` : "—"} — {r.amenities ?? ""}
              {r.imageUrl ? ` — 🖼 ${r.imageUrl}` : ""}
            </span>
            <div className="flex gap-1">
              <Link href={`/admin/accommodations/${accommodationId}/room-types/${r.id}/edit`} className="rounded border px-2 py-1 text-xs hover:bg-muted">
                Edit
              </Link>
              <form action={deleteRoomType}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="accommodationId" value={accommodationId} />
                <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {roomTypes.length === 0 ? <p className="text-sm text-muted-foreground">No room types yet.</p> : null}
      </div>
    </div>
  );
}
