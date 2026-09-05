import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { blogPostSchema } from "@/lib/validations/blog"
import { searchParamsSchema } from "@/lib/validations/search"
import { Button } from "@/components/ui/button"
import { AdminSearchAutocomplete } from "@/components/admin/AdminSearchAutocomplete"

async function createPost(formData: FormData) {
  "use server"
  const session = await auth()
  const authorId = (session?.user as unknown as { id?: string })?.id
  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    content: String(formData.get("content") ?? ""),
    categoryId: String(formData.get("categoryId") ?? "") || undefined,
    featuredImage: String(formData.get("featuredImage") ?? "") || undefined,
  }
  const parsed = blogPostSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)
  try {
    await prisma.blogPost.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        categoryId: parsed.data.categoryId || (null as never),
        featuredImage: parsed.data.featuredImage || null,
        authorId: authorId ?? (null as never),
        published: true,
        publishedAt: new Date(),
      } as never,
    })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === "P2002") throw new Error("Slug already taken")
    throw e
  }
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath("/")
}

async function togglePublish(formData: FormData) {
  "use server"
  const id = String(formData.get("id") ?? "")
  if (!id) return
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) return
  await prisma.blogPost.update({
    where: { id },
    data: {
      published: !post.published,
      publishedAt: !post.published ? new Date() : (null as never),
    },
  })
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath(`/blog/${post.slug}`)
  revalidatePath("/")
}

async function deletePost(formData: FormData) {
  "use server"
  const id = String(formData.get("id") ?? "")
  if (!id) return
  const post = await prisma.blogPost.findUnique({ where: { id } })
  await prisma.blogPost.delete({ where: { id } })
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  if (post) revalidatePath(`/blog/${post.slug}`)
  revalidatePath("/")
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string
    q?: string
    categoryId?: string
    published?: string
  }>
}) {
  const {
    error,
    q: rawQ,
    categoryId: rawCategoryId,
    published: rawPublished,
  } = await searchParams
  const parsed = searchParamsSchema.safeParse({ q: rawQ })
  const q = parsed.success ? parsed.data.q : undefined
  const categoryId = rawCategoryId?.trim() || undefined
  const published = rawPublished?.trim() || undefined
  const where = {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { slug: { contains: q, mode: "insensitive" as const } },
              { content: { contains: q, mode: "insensitive" as const } },
              {
                category: {
                  name: { contains: q, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {},
      categoryId ? { categoryId } : {},
      published === "true"
        ? { published: true }
        : published === "false"
          ? { published: false }
          : {},
    ],
  }
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: where as never,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ])
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage Blog Posts</h1>
        <Link
          href="/admin/blog/categories"
          className="text-primary text-xs hover:underline"
        >
          Manage Categories →
        </Link>
      </div>
      {error ? (
        <p className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {decodeURIComponent(error)}
        </p>
      ) : null}
      <form
        action={createPost}
        className="mt-4 grid gap-2 rounded-lg border p-4"
      >
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            name="title"
            placeholder="Title *"
            required
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="slug"
            placeholder="slug *"
            required
            pattern="[a-z0-9-]+"
            className="rounded border px-2 py-1 text-sm"
          />
          <select
            name="categoryId"
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="">No Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          name="content"
          placeholder="Content *"
          required
          className="rounded border px-2 py-1 text-sm"
          rows={2}
        />
        <input
          name="featuredImage"
          placeholder="Featured Image URL https://..."
          className="rounded border px-2 py-1 text-sm"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm"
        >
          Create Post
        </button>
      </form>
      <form method="GET" className="mt-4 flex gap-2">
        <AdminSearchAutocomplete
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search title, slug, content, category..."
          entity="blog"
        />
        <select
          name="categoryId"
          defaultValue={categoryId ?? ""}
          className="border-input h-8 rounded-lg border bg-transparent px-2.5 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="published"
          defaultValue={published ?? ""}
          className="border-input h-8 rounded-lg border bg-transparent px-2.5 text-sm"
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
        <a
          href="/admin/blog"
          className="hover:bg-muted inline-flex h-7 items-center justify-center rounded-md border px-2.5 text-xs"
        >
          Clear
        </a>
      </form>
      {q || categoryId || published ? (
        <p className="text-muted-foreground mt-2 text-xs">
          Showing {posts.length} result{posts.length === 1 ? "" : "s"}
          {q ? ` for “${q}”` : ""}
          {categoryId
            ? ` in ${categories.find((c) => c.id === categoryId)?.name ?? "category"}`
            : ""}
          {published
            ? ` · ${published === "true" ? "Published" : "Draft"}`
            : ""}
        </p>
      ) : null}
      <div className="mt-6 space-y-2">
        {posts.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded border px-3 py-2 text-sm"
          >
            <span>
              {p.title} — {p.slug} — {p.category?.name ?? "No category"} —{" "}
              {p.published ? "Published" : "Draft"}
            </span>
            <div className="flex gap-1">
              <Link
                href={`/admin/blog/${p.id}/edit`}
                className="hover:bg-muted rounded border px-2 py-1 text-xs"
              >
                Edit
              </Link>
              <form action={togglePublish}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="hover:bg-muted rounded border px-2 py-1 text-xs"
                >
                  Toggle
                </button>
              </form>
              <form action={deletePost}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="hover:bg-muted rounded border px-2 py-1 text-xs"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
