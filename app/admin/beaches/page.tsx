import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function createBeach(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name || !slug || !location) return;
  await prisma.beach.create({ data: { name, slug, location, description: description || name } as never });
  revalidatePath("/admin/beaches");
  revalidatePath("/beaches");
}

async function deleteBeach(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.beach.delete({ where: { id } });
  revalidatePath("/admin/beaches");
}

export default async function AdminBeachesPage() {
  const beaches = await prisma.beach.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-xl font-bold">Manage Beaches</h1>
      <form action={createBeach} className="mt-4 grid gap-2 rounded-lg border p-4 sm:grid-cols-4">
        <input name="name" placeholder="Name" required className="rounded border px-2 py-1 text-sm" />
        <input name="slug" placeholder="slug-like-this" required className="rounded border px-2 py-1 text-sm" />
        <input name="location" placeholder="Location" required className="rounded border px-2 py-1 text-sm" />
        <input name="description" placeholder="Description" className="rounded border px-2 py-1 text-sm" />
        <button type="submit" className="col-span-full rounded bg-primary px-3 py-1 text-sm text-primary-foreground sm:col-span-1">
          Create
        </button>
      </form>
      <div className="mt-6 space-y-2">
        {beaches.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
            <span>
              {b.name} — {b.slug} — {b.location}
            </span>
            <form action={deleteBeach}>
              <input type="hidden" name="id" value={b.id} />
              <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
