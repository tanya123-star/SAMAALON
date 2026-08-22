import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { blogPostSchema } from "@/lib/validations/blog";

async function updatePost(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
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
    await prisma.blogPost.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        categoryId: parsed.data.categoryId || null as never,
        featuredImage: parsed.data.featuredImage || null,
      } as never,
    });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") throw new Error("Slug already taken");
    throw e;
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath("/");
  redirect("/admin/blog");
}

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!post) return <p className="p-4 text-sm">Post not found</p>;
  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Blog
      </Link>
      <h1 className="mt-2 text-xl font-bold">Edit Post: {post.title}</h1>
      <form action={updatePost} className="mt-4 grid gap-2 rounded-lg border p-4">
        <input type="hidden" name="id" value={post.id} />
        <input name="title" defaultValue={post.title} required className="rounded border px-2 py-1 text-sm" />
        <input name="slug" defaultValue={post.slug} required pattern="[a-z0-9-]+" className="rounded border px-2 py-1 text-sm" />
        <select name="categoryId" defaultValue={post.categoryId ?? ""} className="rounded border px-2 py-1 text-sm">
          <option value="">No Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea name="content" defaultValue={post.content} required className="rounded border px-2 py-1 text-sm" rows={4} />
        <input name="featuredImage" defaultValue={post.featuredImage ?? ""} placeholder="Featured Image URL" className="rounded border px-2 py-1 text-sm" />
        <button type="submit" className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground">
          Save Changes
        </button>
      </form>
    </div>
  );
}
