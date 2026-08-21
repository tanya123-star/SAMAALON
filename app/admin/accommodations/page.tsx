import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function createAccommodation(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const beachId = String(formData.get("beachId") ?? "").trim();
  const facebookUrl = String(formData.get("facebookUrl") ?? "").trim();
  if (!name || !slug || !beachId || !facebookUrl) return;
  await prisma.accommodation.create({ data: { name, slug, beachId, facebookUrl, description: name } as never });
  revalidatePath("/admin/accommodations");
}

async function deleteAccommodation(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.accommodation.delete({ where: { id } });
  revalidatePath("/admin/accommodations");
}

export default async function AdminAccommodationsPage() {
  const [accommodations, beaches] = await Promise.all([
    prisma.accommodation.findMany({ include: { beach: true }, orderBy: { createdAt: "desc" } }),
    prisma.beach.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <div>
      <h1 className="text-xl font-bold">Manage Accommodations</h1>
      <form action={createAccommodation} className="mt-4 grid gap-2 rounded-lg border p-4 sm:grid-cols-5">
        <input name="name" placeholder="Name" required className="rounded border px-2 py-1 text-sm" />
        <input name="slug" placeholder="slug" required className="rounded border px-2 py-1 text-sm" />
        <select name="beachId" required className="rounded border px-2 py-1 text-sm">
          <option value="">Select Beach</option>
          {beaches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <input name="facebookUrl" placeholder="https://facebook.com/..." required className="rounded border px-2 py-1 text-sm" />
        <button type="submit" className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground">
          Create
        </button>
      </form>
      <div className="mt-6 space-y-2">
        {accommodations.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
            <span>
              {a.name} — {a.slug} — {a.beach.name}
            </span>
            <form action={deleteAccommodation}>
              <input type="hidden" name="id" value={a.id} />
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
