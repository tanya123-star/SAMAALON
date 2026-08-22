import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations/blog";

async function createPost(formData: FormData) {
  "use server";
  const session = await auth();
  const authorId = (session?.user as unknown as { id?: string })?.id;
  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    content: String(formData.get("content") ?? ""),
    categoryId: String(formData.get("categoryId") ?? "") || undefined,
    featuredImage: String(formData.get("featuredImage") ?? "") || undefined,
  };
  const parsed = blogPostSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  try {
    await prisma.blogPost.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        categoryId: parsed.data.categoryId || null as never,
        featuredImage: parsed.data.featuredImage || null,
        authorId: authorId ?? null as never,
        published: true,
        publishedAt: new Date(),
      } as never,
    });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") throw new Error("Slug already taken");
    throw e;
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
}

async function togglePublish(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return;
  await prisma.blogPost.update({
    where: { id },
    data: { published: !post.published, publishedAt: !post.published ? new Date() : null as never },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
}

async function deletePost(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (post) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
}

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage Blog Posts</h1>
        <Link href="/admin/blog/categories" className="text-xs text-primary hover:underline">
          Manage Categories →
        </Link>
      </div>
      {error ? <p className="mt-2 rounded bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{decodeURIComponent(error)}</p> : null}
      <form action={createPost} className="mt-4 grid gap-2 rounded-lg border p-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <input name="title" placeholder="Title *" required className="rounded border px-2 py-1 text-sm" />
          <input name="slug" placeholder="slug *" required pattern="[a-z0-9-]+" className="rounded border px-2 py-1 text-sm" />
          <select name="categoryId" className="rounded border px-2 py-1 text-sm">
            <option value="">No Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <textarea name="content" placeholder="Content *" required className="rounded border px-2 py-1 text-sm" rows={2} />
        <input name="featuredImage" placeholder="Featured Image URL https://..." className="rounded border px-2 py-1 text-sm" />
        <button type="submit" className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground">
          Create Post
        </button>
      </form>
      <div className="mt-6 space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
            <span>
              {p.title} — {p.slug} — {p.category?.name ?? "No category"} — {p.published ? "Published" : "Draft"}
            </span>
            <div className="flex gap-1">
              <Link href={`/admin/blog/${p.id}/edit`} className="rounded border px-2 py-1 text-xs hover:bg-muted">
                Edit
              </Link>
              <form action={togglePublish}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted">
                  Toggle
                </button>
              </form>
              <form action={deletePost}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
