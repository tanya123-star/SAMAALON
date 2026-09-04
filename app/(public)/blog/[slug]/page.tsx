import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!post || !post.published) notFound()

  return (
    <article className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* Header */}
      <section className="border-b border-[#1C2A28]/10 bg-white px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/blog"
            className="mb-4 block text-xs font-bold tracking-widest text-[#2D6A4F] uppercase hover:text-[#1C2A28]"
          >
            ← Back to Travel Guides
          </Link>
          {post.category && (
            <span className="mb-3 inline-block rounded-full border border-[#1C2A28]/10 bg-[#FAF8F5] px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#1C2A28] uppercase">
              {post.category.name}
            </span>
          )}
          <h1 className="font-serif text-3xl leading-tight font-bold text-[#1C2A28] sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-xs text-[#5A6B68]">
            <span>
              Published{" "}
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : ""}
            </span>
            <span>·</span>
            <span>Samal Tourism Journal</span>
          </div>
        </div>
      </section>

      {/* Featured Cover Image */}
      {post.featuredImage && (
        <div className="z-10 mx-auto -mt-6 w-full max-w-4xl px-4 sm:px-8">
          <div className="h-96 overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
        <div className="space-y-6 rounded-2xl border border-[#1C2A28]/10 bg-white p-8 text-sm leading-relaxed text-[#1C2A28] shadow-sm sm:p-12 sm:text-base">
          <p className="font-sans leading-loose whitespace-pre-wrap text-[#1C2A28]/90">
            {post.content}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[#1C2A28]/10 pt-8 text-xs">
          <Link
            href="/blog"
            className="font-bold text-[#2D6A4F] hover:underline"
          >
            ← Explore more Samal stories
          </Link>
          <Link
            href="/beaches"
            className="font-bold text-[#1C2A28] hover:underline"
          >
            Browse Samal Beaches →
          </Link>
        </div>
      </section>
    </article>
  )
}
