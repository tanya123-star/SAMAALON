import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import Link from "next/link"
import { saveUploadedFile } from "@/lib/upload"
import { blogPostSchema } from "@/lib/validations/blog"

async function updatePost(formData: FormData) {
  "use server"
  const id = String(formData.get("id") ?? "")
  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) throw new Error("Post not found")

  const existingFeatured = existing.featuredImage

  // --- new remote URL ---
  const newRemoteUrl =
    String(formData.get("newRemoteUrl") ?? "").trim() || undefined

  // --- uploaded file ---
  const uploadedFile = formData.get("newUploadedFile") as File | null
  const newLocalPath = uploadedFile
    ? await saveUploadedFile(uploadedFile, { maxSize: 5 * 1024 * 1024 })
    : undefined

  // --- take precedence: file over URL ---
  const featuredImage = newLocalPath || newRemoteUrl || existingFeatured

  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    content: String(formData.get("content") ?? ""),
    categoryId: String(formData.get("categoryId") ?? "") || undefined,
    featuredImage,
  }
  const parsed = blogPostSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  try {
    await prisma.blogPost.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        categoryId: parsed.data.categoryId || (null as never),
        featuredImage: parsed.data.featuredImage || null,
      } as never,
    })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === "P2002") throw new Error("Slug already taken")
    throw e
  }
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath(`/blog/${parsed.data.slug}`)
  revalidatePath("/")
  redirect("/admin/blog")
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ])
  if (!post) return <p className="p-4 text-sm">Post not found</p>

  return (
    <div>
      <Link
        href="/admin/blog"
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        ← Back to Blog
      </Link>
      <h1 className="mt-2 text-xl font-bold">Edit Post: {post.title}</h1>
      <form
        action={updatePost}
        className="mt-4 grid gap-2 rounded-lg border p-4"
      >
        <input type="hidden" name="id" value={post.id} />
        <input
          name="title"
          defaultValue={post.title}
          required
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          name="slug"
          defaultValue={post.slug}
          required
          pattern="[a-z0-9-]"
          className="rounded border px-2 py-1 text-sm"
        />
        <select
          name="categoryId"
          defaultValue={post.categoryId ?? ""}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="">No Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea
          name="content"
          defaultValue={post.content}
          required
          className="rounded border px-2 py-1 text-sm"
          rows={4}
        />
        <input
          name="featuredImage"
          defaultValue={post.featuredImage ?? ""}
          placeholder="Featured Image URL https://..."
          className="rounded border px-2 py-1 text-sm"
        />
        {/* Remote URL input (shown; file input hidden) */}
        <input
          name="newRemoteUrl"
          type="text"
          placeholder="https://example.com/img.jpg"
          className="mt-2 hidden w-full rounded border px-2 py-1 text-sm"
        />
        {/* File upload: hidden input + button */}
        <div className="mt-3">
          <h3 className="mb-1 text-xs font-medium">Or upload new file</h3>
          <input
            name="newUploadedFile"
            type="file"
            accept="image/*,image/apng,image/svg+xml"
            className="hidden"
          />
          <button
            type="button"
            onClick={() =>
              (
                document.querySelector(
                  'input[name="newUploadedFile"]'
                ) as HTMLInputElement
              ).click()
            }
            className="hover:bg-muted rounded border px-3 py-2 text-xs transition-colors"
          >
            Browse File
          </button>
          <p className="text-muted-foreground mt-1 text-xs">
            Allowed: JPEG, PNG, WebP. Max 5MB.
          </p>
        </div>
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
