import { prisma } from "@/lib/prisma"
import { BlogContent } from "@/components/blog/BlogContent"
import { Suspense } from "react"

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <Suspense>
      <BlogContent posts={posts} categories={categories} />
    </Suspense>
  )
}
