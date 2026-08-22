import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { blogCategorySchema } from "@/lib/validations/blog";

async function createCategory(formData: FormData) {
  "use server";
  const raw = { name: String(formData.get("name") ?? ""), slug: String(formData.get("slug") ?? "") };
  const parsed = blogCategorySchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  try {
    await prisma.blogCategory.create({ data: parsed.data });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") throw new Error("Slug already taken");
    throw e;
  }
  revalidatePath("/admin/blog/categories");
  revalidatePath("/admin/blog");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.blogCategory.delete({ where: { id } });
  revalidatePath("/admin/blog/categories");
  revalidatePath("/admin/blog");
}

export default async function BlogCategoriesPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="text-xl font-bold">Manage Blog Categories</h1>
      <form action={createCategory} className="mt-4 flex gap-2 rounded-lg border p-4">
        <input name="name" placeholder="Name *" required className="rounded border px-2 py-1 text-sm flex-1" />
        <input name="slug" placeholder="slug *" required pattern="[a-z0-9-]+" className="rounded border px-2 py-1 text-sm flex-1" />
        <button type="submit" className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground">
          Create
        </button>
      </form>
      <div className="mt-6 space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
            <span>
              {c.name} — {c.slug}
            </span>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
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
