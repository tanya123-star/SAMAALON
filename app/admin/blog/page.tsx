import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function createPost(formData: FormData) {
  "use server";
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !slug) return;
  await prisma.blogPost.create({ data: { title, slug, content: content || title, published: true, publishedAt: new Date() } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

async function togglePublish(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return;
  await prisma.blogPost.update({ where: { id }, data: { published: !post.published } });
  revalidatePath("/admin/blog");
}

async function deletePost(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
}

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-xl font-bold">Manage Blog Posts</h1>
      <form action={createPost} className="mt-4 grid gap-2 rounded-lg border p-4 sm:grid-cols-4">
        <input name="title" placeholder="Title" required className="rounded border px-2 py-1 text-sm" />
        <input name="slug" placeholder="slug" required className="rounded border px-2 py-1 text-sm" />
        <input name="content" placeholder="Content" className="rounded border px-2 py-1 text-sm" />
        <button type="submit" className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground">
          Create
        </button>
      </form>
      <div className="mt-6 space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
            <span>
              {p.title} — {p.slug} — {p.published ? "Published" : "Draft"}
            </span>
            <div className="flex gap-1">
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
